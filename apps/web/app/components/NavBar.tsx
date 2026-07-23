"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Icon } from "./icons";

export function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("bys_logged_in") === "1");
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("click", handleClick);
    }
    return () => document.removeEventListener("click", handleClick);
  }, [menuOpen]);

  function signOut() {
    localStorage.removeItem("bys_logged_in");
    localStorage.removeItem("bys_email");
    window.location.href = "/";
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={loggedIn ? "/dashboard" : "/"} className="brand">
          <span className="brand-mark" aria-hidden>
            <Icon name="logo" size={26} />
          </span>
          <span className="brand-text">Before You Sign</span>
        </Link>
        <nav className="header-nav">
          {loggedIn ? (
            <>
              <Link href="/analyze" className="ghost-link">
                Analyze
              </Link>
              <Link href="/compare" className="ghost-link">
                Compare Funds
              </Link>
              <Link href="/needs" className="ghost-link">
                My Goals
              </Link>
              <div ref={menuRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.4rem",
                  }}
                >
                  <img
                    src="/images/user-icon.png"
                    alt="Account"
                    width={20}
                    height={20}
                    style={{ display: "block" }}
                  />
                </button>
                {menuOpen && (
                  <div className="nav-dropdown">
                    <Link
                      href="/dashboard"
                      className="nav-dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/faq"
                      className="nav-dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                    <div className="nav-dropdown-divider" />
                    <Link
                      href="/account"
                      className="nav-dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      Account settings
                    </Link>
                    <button
                      type="button"
                      className="nav-dropdown-item danger"
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/about" className="ghost-link">
                About
              </Link>
              <Link href="/how" className="ghost-link">
                How This Works
              </Link>
              <Link href="/demo" className="ghost-link">
                Demo
              </Link>
              <Link href="/faq" className="ghost-link">
                FAQ
              </Link>
              <Link
                href="/login?mode=signup"
                className="btn"
                style={{ marginRight: "0.5rem" }}
              >
                Get started
              </Link>
              <Link href="/login" style={{ padding: "0.4rem" }}>
                <img
                  src="/images/user-icon.png"
                  alt="Log in"
                  width={20}
                  height={20}
                  style={{ display: "block" }}
                />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
