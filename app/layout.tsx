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
  title:
    "Bounty Strategic Suppliers Showcase 2025 | Powering Progress Through Partnership",
  description:
    "Join Bounty’s Strategic Suppliers Showcase 2025 — where innovation meets collaboration for lasting impact. Discover partnerships that power progress and shape the future of agriculture and food systems.",
  openGraph: {
    title:
      "Bounty Strategic Suppliers Showcase 2025 | Powering Progress Through Partnership",
    description:
      "Innovation meets collaboration at Bounty’s Strategic Suppliers Showcase 2025. Explore opportunities to create lasting impact through partnerships.",
    url: "https://bounty-2025-registration.vercel.app/", // Replace with your actual deployed URL
    siteName: "Bounty Showcase 2025",
    images: [
      {
        url: "https://bounty-2025-registration.vercel.app/", // Replace with your actual meta image path
        width: 1200,
        height: 630,
        alt: "Bounty Strategic Suppliers Showcase 2025",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Bounty Strategic Suppliers Showcase 2025 | Powering Progress Through Partnership",
    description:
      "Be part of Bounty’s Strategic Suppliers Showcase 2025 — driving progress with innovation and collaboration.",
    images: ["https://yourdomain.com/meta-image.jpg"], // Replace with your actual meta image path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
