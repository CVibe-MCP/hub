import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cvibe - Like npm, but for prompts",
  description: "Reusable, standardized, MCP-native prompts. Build better AI workflows with the community. Like npm, but for prompts - discover, publish, and install prompt packages.",
  keywords: [
    "npm for prompts", 
    "prompt management", 
    "prompt cli", 
    "prompt mcp", 
    "prompt hub", 
    "ai prompts", 
    "mcp native", 
    "prompt packages", 
    "claude code", 
    "cursor prompts",
    "prompt engineering",
    "ai workflow",
    "developer tools"
  ],
  authors: [{ name: "Cvibe" }],
  openGraph: {
    title: "Cvibe - Like npm, but for prompts",
    description: "Reusable, standardized, MCP-native prompts. Build better AI workflows with the community.",
    url: "https://cvibe.dev",
    siteName: "Cvibe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cvibe - Like npm, but for prompts",
    description: "Reusable, standardized, MCP-native prompts. Build better AI workflows with the community.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white`}>
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}