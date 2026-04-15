| CS-601       | Web Applicaiton Development |
| ------------ | --------------------------- |
| Contributors | Johannes Bekele,            |
| Date         | 04/28/2026                  |
| Course       | Spring                      |
| Assignment # | Final Project               |

# Assignment Overview

- Full-stack application fro messaging dashboards using tools such as next.js, MongoDB, Auth.js, Pusher

# Johannes Contributions

- Created/Initialized routes (explicity handled backend logic and data) for `group/[id]`, `dashboard` and `create-group`
- Created/Initialzed components `ChatInput.tsx` and `Messages.tsx`
- Defined Types for Messages
- Initialized MongoDB connection in `lib/mongodb.ts` for database operations.
- Set up authentication using `@/auth` for route protection and session management.
- Added `app/dashboard/page.tsx` which displays group chats owned by the authenticated user.
- Developed a create group form in `app/create-group/page.tsx` for users to create new group chats (with name and description).
- Created an API route at `app/api/create-group/route.ts` for handling creation of new groups with backend validation.
- Created an API route at `app/api/chat/[id]/send/route.ts` for handling message sending within groups.
- Created an API route at `app/api/chat/[id]/get/route.ts` for getting message within groups.
- Configured Pusher in `lib/pusher-client.ts` and `lib/pusher-server.ts` for real-time communication and notifications (using environment variables).
  - (Documentation used)[https://pusher.com/docs/channels/using_channels/client-api-overview/]
- Managed group ownership and listing, ensuring groups are associated with their creators via user authentication.
- Added `.env.local` setup for configuration of database, authentication, and Pusher credentials.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
