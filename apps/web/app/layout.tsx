import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Icon } from "./components/icons";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className={plusJakarta.variable}>
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden>
                <Icon name="logo" size={26} />
              </span>
              <span className="brand-text">Before You Sign</span>
            </Link>
            <nav className="header-nav">
              <Link href="/about" className="btn btn-ghost">
                About
              </Link>
              <Link href="/how" className="btn btn-ghost">
                How This Works
              </Link>
              <Link href="/demo" className="btn btn-ghost">
                Demo
              </Link>
              <Link href="/faq" className="btn btn-ghost">
                FAQ
              </Link>
              <Link href="/login" className="btn btn-ghost">
                <Icon name="user" size={16} />
              </Link>
              <Link href="/login" className="btn">
                Get started
              </Link>
            </nav>
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
