import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netizen TMA",
  description: "HELLO EPTA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        {children}
      </body>
    </html>
  );
}
