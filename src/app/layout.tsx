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
  title: "Mise PDV Inteligente | Operação inteligente para restaurantes",
  description:
    "Sistema SaaS para PDV, cozinha, estoque, CMV, delivery proprio, recibo nao fiscal e modulos opcionais.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/mise-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/mise-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/mise-apple.png",
  },
  appleWebApp: {
    capable: true,
    title: "Mise",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
