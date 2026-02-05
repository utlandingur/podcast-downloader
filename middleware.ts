export { auth as middleware } from "./auth";

export const config = {
  matcher: [
    // Skip API routes (including /api/search) and Next.js internals
    "/((?!api/|_next/|favicon.ico|robots.txt|sitemap).*)",
  ],
};
