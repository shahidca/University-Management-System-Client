const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN;
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!apiUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not configured. Please check your .env.local file.",
  );
}

if (!apiOrigin) {
  throw new Error(
    "NEXT_PUBLIC_API_ORIGIN is not configured. Please check your .env.local file.",
  );
}

export const env = {
  apiUrl,
  apiOrigin,
  googleClientId,
} as const;