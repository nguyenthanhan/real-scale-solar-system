import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar System",
  description:
    "An interactive 3D model of our solar system with realistic planetary orbits and information",
  generator: "Next.js",
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
