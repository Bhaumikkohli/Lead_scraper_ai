This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Firebase Auth & Profile Setup

1) Create a Firebase project and enable:
- Authentication → Sign-in method → Google provider
- Firestore Database → Start in production mode

2) Create a Web App in Firebase console and copy the client config to `.env.local`:

```
cp .env.local.example .env.local
# Fill NEXT_PUBLIC_FIREBASE_* values from Firebase Web App config
# Add admin creds (Service Account → Generate new private key)
```

3) Admin credentials (server):
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (escape newlines as \n or use quotes in example)

4) Run the app:

```
npm ci
npm run dev
```

5) Auth flow:
- Use the sidebar button or visit `/signin` to sign in with Google
- Profile at `/profile` lets you edit display name, avatar URL, theme, and accent color
- API routes verify Firebase ID tokens; dashboard actions require sign-in

## Getting Started

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

