import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Before You Sign",
  description:
    "Understand the real cost and consequence of a financial product before you sign. " +
    "We don't sell anything. We don't tell you what to buy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
