import { User } from "@prisma/client"
import { prisma } from "../../db"

export const getFirstBackupOnDate = async (date: Date, filter?: { user: User }) => {
  return prisma.backup.findFirst({
    where: {
      user_id: filter?.user.id,
      date: date,
    },
  })
}

export const getBackupsOnDate = async (date: Date, filter?: { user: User }) => {
  return prisma.backup.findMany({
    where: {
      user_id: filter?.user.id,
      date: date,
    },
  })
}

export const createBackup = async ({ user, date }: { user: User, date: Date }) => {
  return prisma.backup.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      date: date,
    },
  })
}