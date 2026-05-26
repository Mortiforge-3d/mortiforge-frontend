import type { Metadata } from "next";
import "./globals.css";
import { dmSans, bebasNeue } from "../lib/fonts";

export const metadata: Metadata = {
  title: "Mortiforge 3D",
  description: "Premium 3D printing store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${bebasNeue.variable}`}>
        {children}
      </body>
    </html>
  );
}