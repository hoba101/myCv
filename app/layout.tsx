import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Ehab — Creative Web Developer",
  description:
    "Portfolio of Ehab, a creative web developer specializing in React, Next.js, and modern web experiences.",
  openGraph: {
    title: "Ehab — Creative Web Developer",
    description:
      "Portfolio of Ehab, a creative web developer specializing in React, Next.js, and modern web experiences.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ehab — Creative Web Developer",
    description:
      "Portfolio of Ehab, a creative web developer specializing in React, Next.js, and modern web experiences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
