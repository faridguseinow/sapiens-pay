"use client";

import { useActionState } from "react";
import { mailLogin } from "../actions";

export function MailLoginForm() {
  const [state, action, pending] = useActionState(mailLogin, undefined);
  return <form action={action} className="mail-login__form">
    <label>E-poçt<input name="email" type="email" required autoFocus autoComplete="email" /></label>
    <label>Şifrə<input name="password" type="password" required autoComplete="current-password" /></label>
    {state?.error ? <p className="mail-error">{state.error}</p> : null}
    <button disabled={pending}>{pending ? "Yoxlanılır..." : "Daxil ol"}</button>
  </form>;
}
