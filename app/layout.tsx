import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Scale Solar System",
  description:
    "A true-to-scale 3D model of our solar system with accurate planetary sizes, distances, and scientific data",
  generator: "Next.js",
  icons: {
    icon: "/favicon.svg",
  },
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
