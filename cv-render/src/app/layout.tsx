import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hasir Sayed — AI/ML Safety and Data Pipeline Engineer",
  description:
    "Portfolio of Hasir Sayed, an AI/ML Engineer specializing in LLM safety, NLP, data pipelines, and agentic workflows.",
};

import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                  }
                  window.scrollTo(0, 0);
                } catch (e) {}
                try {
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'dark') {
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)]">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
