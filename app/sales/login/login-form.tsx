"use client";

import { useActionState } from "react";
import { salesLogin } from "../actions";

export function SalesLoginForm() {
  const [state, action, pending] = useActionState(salesLogin, undefined);
  return (
    <form action={action} className="admin-login__form">
      <label>
        <span>E-poçt</span>
        <input name="email" type="email" placeholder="sales@sapiens-pay.com" autoComplete="email" required autoFocus />
      </label>
      <label>
        <span>Şifrə</span>
        <input name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
      </label>
      {state?.error ? <p className="admin-form-error">{state.error}</p> : null}
      <button className="admin-button admin-button--primary" disabled={pending}>
        {pending ? "Yoxlanılır..." : "Satış panelinə daxil ol"}
      </button>
    </form>
  );
}
