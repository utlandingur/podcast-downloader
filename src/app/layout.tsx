import type { Metadata } from "next";
import "@/globals.css";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { PageLoadProvider } from "@/providers/pageLoadProvider";
import { ThemeProvider } from "@/providers/themeProvider";
import { Header } from "@/components/header";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Download Podcasts To Mp3",
  description: "Quickly download podcasts to mp3 for free",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // officially recommended by next-themes...
    >
      <body>
        <Header />
        <ThemeProvider
          attribute="class" // Ensures theme is applied using a class
          defaultTheme="system" // Default theme used during SSR
          enableSystem={true} // Optional: Enables system preference detection
          disableTransitionOnChange // Optional: Prevents transition effects during hydration
        >
          <QueryClientProvider>
            <PageLoadProvider>{children}</PageLoadProvider>
          </QueryClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
