import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Vyapaar",
  description: "The best AI integrated CRM for your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
