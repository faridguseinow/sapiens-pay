"use client";

import { useActionState } from "react";
import { setSalesPassword } from "./actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState(setSalesPassword, undefined);
  return (
    <form action={action} className="admin-login__form">
      <label><span>Yeni şifrə</span><input name="password" type="password" minLength={10} autoComplete="new-password" required autoFocus /></label>
      <label><span>Şifrəni təkrarla</span><input name="confirmation" type="password" minLength={10} autoComplete="new-password" required /></label>
      {state?.error ? <p className="admin-form-error">{state.error}</p> : null}
      <button className="admin-button admin-button--primary" disabled={pending}>{pending ? "Yadda saxlanılır..." : "Şifrəni təyin et"}</button>
    </form>
  );
}
