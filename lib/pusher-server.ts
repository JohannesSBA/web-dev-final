import Pusher from "pusher";

const key =
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? process.env.PUSHER_APP_KEY;
const cluster =
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? process.env.PUSHER_CLUSTER;

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: key as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: cluster as string,
  useTLS: true,
});
