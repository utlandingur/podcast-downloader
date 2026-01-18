import type { Metadata } from 'next';
import '@/globals.css';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import { ThemeProvider } from '@/providers/themeProvider';
import { Header } from '@/components/header';
import { SyncUserWrapper } from '@/components/syncUserWrapper';
import { faqItems } from '@/components/faq';
import { SessionProvider } from 'next-auth/react';


export const metadata: Metadata = {
  title: 'Download Podcasts To Mp3',
  description: 'Quickly download podcasts to mp3 for free',
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
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta property="og:type" content="website" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="dns-prefetch" href="https://api.podcastindex.org" />
        {/* Removed to reduce the number of requests to keep costs down */}
        {/* {process.env.NODE_ENV !== 'development' && (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SRC}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          ></script>
        )} */}
        {/* Structured Data (FAQ Schema for SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: Array.isArray(faqItems)
                ? faqItems.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: item.answer,
                    },
                  }))
                : [],
            }),
          }}
        />
      </head>
      <body>
        <SessionProvider>
          <Header />
          <ThemeProvider
            attribute="class" // Ensures theme is applied using a class
            defaultTheme="dark" // Default theme used during SSR
            enableSystem={true} // Optional: Enables system preference detection
            disableTransitionOnChange // Optional: Prevents transition effects during hydration
          >
            <QueryClientProvider>
              <SyncUserWrapper>{children}</SyncUserWrapper>
            </QueryClientProvider>
            <footer className="py-6 text-center text-xs text-muted-foreground">
              Personal use only.
              <br />
              Please respect podcast host terms.
              <br />
              <br />
              Consider supporting the podcast creators.
            </footer>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
