import type { Metadata } from "next";
import "./globals.css";
import { dmSans, bebasNeue } from "../lib/fonts";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer/footer";
import { auth } from "../../auth";
import Providers from "../components/providers";

export const metadata: Metadata = {
  title: "Mortiforge 3D",
  description: "Premium 3D printing store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${bebasNeue.variable}`}>
        <Providers session={session}>
          <Navbar user={session?.user ?? null} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}