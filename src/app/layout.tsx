import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cvibe - The npm for Prompts",
  description: "Discover, share, and access field-tested AI prompts. The lightweight, open hub where developers publish, discover, and reuse AI prompts without reinventing the wheel.",
  keywords: ["AI prompts", "prompt engineering", "developer tools", "AI", "prompts", "MCP", "Claude"],
  authors: [{ name: "Cvibe Community" }],
  openGraph: {
    title: "Cvibe - The npm for Prompts",
    description: "Discover, share, and access field-tested AI prompts",
    url: "https://cvibe.dev",
    siteName: "Cvibe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cvibe - The npm for Prompts",
    description: "Discover, share, and access field-tested AI prompts",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}