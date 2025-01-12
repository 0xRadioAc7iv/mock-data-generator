import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mock Data Generator",
  description: "Generate Fake Data for your Database using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
