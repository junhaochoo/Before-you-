import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Icon } from "./components/icons";
import { AccountBadge } from "./components/AccountBadge";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={inter.variable}>
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden>
                <Icon name="check" size={18} />
              </span>
              <span className="brand-text">Before You Sign</span>
            </Link>
            <div className="header-right">
              <span className="badge">
                <Icon name="check" size={15} />
                We earn nothing from your decision
              </span>
              <AccountBadge />
            </div>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <p>
            We don&apos;t sell anything. We don&apos;t tell you what to buy.
            This tool provides factual information and education — not financial
            advice.
          </p>
          <p className="footer-contact">
            <a href="mailto:hello@beforeyousign.sg" className="link">
              <Icon name="mail" size={14} /> Contact us
            </a>
            <span aria-hidden>·</span>
            <span>
              © {new Date().getFullYear()} Before You Sign. All rights reserved.
            </span>
          </p>
        </footer>
      </body>
    </html>
  );
}
