import type { Metadata } from "next";
import "./globals.css";
import "./custom.css"; // Add this line

export const metadata: Metadata = {
  title: "Weather Chat Assistant",
  description: "AI-powered weather chat assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="min-w-[320px]">{children}</body>
    </html>
  );
}