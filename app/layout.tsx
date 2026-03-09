import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SneakPeek - Find Your Perfect Sneaker",
  description:
    "Discover and compare sneakers before you buy. Find your perfect shoe with detailed insights and recommendations from people like you.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <ConvexClientProvider>
          {children}
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
