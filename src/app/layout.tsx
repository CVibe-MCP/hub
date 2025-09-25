import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "cvibe - Free AI Prompt Hub | Share & Discover Prompts for ChatGPT, Claude, Gemini",
  description: "cvibe is a free, community-driven platform where developers share and discover AI prompts. Like npm for prompts - browse, install, and contribute reusable prompts for ChatGPT, Claude, Gemini. Join the community building better AI workflows.",
  keywords: [
    "free prompt management",
    "ai prompt hub",
    "free ai prompts",
    "chatgpt prompts",
    "claude prompts",
    "gemini prompts",
    "prompt sharing platform",
    "open source prompts",
    "free prompt library",
    "prompt versioning",
    "community prompts",
    "mcp prompts",
    "cursor prompts",
    "prompt engineering",
    "ai workflow tools",
    "free prompt repository"
  ],
  authors: [{ name: "cvibe Community" }],
  openGraph: {
    title: "cvibe - Free AI Prompt Hub",
    description: "Free platform for sharing and discovering AI prompts for ChatGPT, Claude, Gemini. Join the community building better AI workflows.",
    url: "https://cvibe.dev",
    siteName: "cvibe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "cvibe - Free AI Prompt Hub",
    description: "Free platform for sharing AI prompts for ChatGPT, Claude, Gemini. Join the community! 🤖",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "cvibe - AI Prompt Hub",
    "description": "Free platform for sharing and discovering AI prompts for ChatGPT, Claude, Gemini",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Free AI prompt sharing",
      "Community-driven prompt library",
      "Version control for prompts",
      "ChatGPT, Claude, Gemini compatible",
      "MCP integration",
      "Open source"
    ],
    "url": "https://cvibe.dev",
    "sameAs": [
      "https://github.com/cvibe-MCP/"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-white`}>
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}