## Getting Started

You're gonna need an .env file. You can copy the example file and fill in the blanks.

Run `npm install` to install all the dependencies.

You will also need to push and seed the database. You can do this by running `npm seed`.

After that you can run the project in developer mode with `npm run dev`.


## Documentation

- [Next.js](https://nextjs.org/docs)
- [React](https://reactjs.org/docs/getting-started.html)
- [tRPC](https://trpc.io/docs/introduction)
- [NextAuth](https://next-auth.js.org/getting-started/example)
- [Prisma](https://www.prisma.io/docs/)
- [React-Aria](https://react-spectrum.adobe.com/react-aria/getting-started.html)
- [Tailwind](https://tailwindcss.com/docs)
- [AutoAnimate](https://auto-animate.formkit.com/#usage)




```mmd
erDiagram
	User ||--o{ User_Preference : has
	User_Preference ||--o{ Absence : has
	User_Preference ||--o{ Availability : has
	Availability ||--o{ Shift : has
	Shift ||--|{ Staff_Required : has
	Shift ||--o{ Staffing : has
	Shift_Type ||--|{ Staff_Required : "is part of"
	Shift_Type ||--o{ Staffing : "is part of"
	Shift_Type ||--o{ Availability : "is part of"
```