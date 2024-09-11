// utils/getBaseUrl.ts
export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    // Local development URL
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    // Vercel URL, defaulting to HTTPS
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to localhost if no environment variables are set
  return 'http://localhost:3000';
}
