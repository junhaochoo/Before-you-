"use client";

import { useState } from "react";
import { hasConsent, setConsent } from "@/lib/storage";
import { Icon } from "./icons";

export function PrivacyConsent() {
  const [agreed, setAgreed] = useState(hasConsent());

  if (agreed) return null;

  return (
    <div className="privacy-banner">
      <Icon name="shield" size={20} />
      <p>
        <strong>Before you upload</strong> — We remove your name, NRIC and
        policy number before anything is read. We never keep uploads or sell
        data.
      </p>
      <label className="consent-check">
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setConsent(true);
              setAgreed(true);
            }
          }}
        />
        I understand
      </label>
    </div>
  );
}
