import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env/server.mjs";
import { prisma } from "./db";
import { Role } from "@prisma/client";
import { LoginLink } from "./mail-templates/login-link";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}


declare module "next-auth" {

  interface Session {
    user?: {
      role?: Role;
    } & DefaultSession["user"];
  }

  // interface Session extends DefaultSession {
  //   user: DefaultSession["user"] & {
  //     id: string;
  //     role: string;
  //   };
  // }

  interface User {
    role?: Role;
  }


  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      return new URL('/', baseUrl).toString()
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: parseInt(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD
        }
      },
      from: env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url, provider: { server, from }, theme }) => {
        const { host } = new URL(url);
        // Place your whitelisted emails below
        const emailWhitelist = await prisma.user.findMany({
          where: {
            email: email,
            role_name: {
              not: 'RETIRED'
            }
          }
        })
        if (emailWhitelist.length <= 0) throw new Error('Email not found');
        const transport = createTransport(server);
        const result = await transport.sendMail({
          to: email,
          from: from,
          subject: `My Project - Sign in to ${host}`,
          html: LoginLink({ url, host, theme }),
          text: `Sign in to ${host}: ${url}\n\n`,
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
};

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
