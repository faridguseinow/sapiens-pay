"use client";

import { useState } from "react";

function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*_-+";
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("") + "Aa1!";
}

export function PasswordField({ label = "Başlanğıc şifrə" }: { label?: string }) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  return <label>
    {label}
    <span className="mail-admin-password">
      <input name="password" required type={visible ? "text" : "password"} minLength={12} autoComplete="new-password" value={value} onChange={(event) => setValue(event.target.value)} />
      <button type="button" onClick={() => setVisible((current) => !current)}>{visible ? "Gizlət" : "Göstər"}</button>
      <button type="button" onClick={() => { setValue(generatePassword()); setVisible(true); }}>Yarat</button>
    </span>
    <small>Minimum 12 simvol: böyük/kiçik hərf, rəqəm və xüsusi işarə.</small>
  </label>;
}
