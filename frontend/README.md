This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

From the `frontend` directory, copy `.env.example` to `.env.local` and fill in
the values from Firebase Console → Project settings → Your apps → Web app configuration.
For PowerShell:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` is ignored by Git. The configuration module and `.env.example` should
be committed so other developers can configure their own environments.

These `NEXT_PUBLIC_FIREBASE_*` values are browser-visible Firebase web configuration.
Keep Firebase Admin credentials in the backend environment, never in `NEXT_PUBLIC_*` variables.
Restart the development server after changing `.env.local`. For deployment, set the
same variables in your hosting environment before building; Next.js embeds public
environment variables into the client bundle at build time.

## Test authentication

In Firebase Console, open Authentication → Sign-in method and enable the
Email/Password provider. Create a test user under the Users tab, then start both
the backend and frontend. Start the backend from its directory with
`node --experimental-strip-types src/server.ts`, then run `npm run dev` here.
The sign-in form authenticates with Firebase and checks the returned bearer token
against the backend's `/api/auth/me` endpoint.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
