"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";

export function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("bys_logged_in") === "1");
  }, []);

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
              <Link href="/analyze" className="btn btn-ghost">
                Analyze
              </Link>
              <Link href="/compare" className="btn btn-ghost">
                Compare Funds
              </Link>
              <Link href="/needs" className="btn btn-ghost">
                My Goals
              </Link>
              <button type="button" className="btn btn-ghost" onClick={signOut}>
                <img
                  src="/images/user-icon.png"
                  alt="Sign out"
                  width={16}
                  height={16}
                  style={{ display: "block" }}
                />
              </button>
            </>
          ) : (
            <>
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
                <img
                  src="/images/user-icon.png"
                  alt="Log in"
                  width={16}
                  height={16}
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
