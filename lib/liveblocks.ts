import { Liveblocks } from "@liveblocks/node";

const LIVEBLOCKS_CURSOR_COLORS = [
  "#00c8d4",
  "#6457f9",
  "#34d399",
  "#fbbf24",
  "#ff6166",
  "#f75f8f",
  "#52a8ff",
  "#bf7af0",
] as const;

let liveblocksClient: Liveblocks | null = null;

function createCursorColorHash(userId: string) {
  let hash = 0;

  for (const character of userId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

export function getLiveblocksCursorColor(userId: string) {
  return LIVEBLOCKS_CURSOR_COLORS[createCursorColorHash(userId) % LIVEBLOCKS_CURSOR_COLORS.length];
}

export function getLiveblocksClient() {
  if (!liveblocksClient) {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY;

    if (!secret) {
      throw new Error("Missing LIVEBLOCKS_SECRET_KEY");
    }

    liveblocksClient = new Liveblocks({
      secret,
    });
  }

  return liveblocksClient;
}