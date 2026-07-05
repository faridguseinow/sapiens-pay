"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="admin-login__form">
      <label>
        <span>E-poçt</span>
        <input
          name="email"
          type="email"
          placeholder="admin@sapienspay.com"
          autoComplete="email"
          required
          autoFocus
        />
      </label>
      <label>
        <span>Şifrə</span>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </label>
      {state?.error ? <p className="admin-form-error">{state.error}</p> : null}
      <button className="admin-button admin-button--primary" disabled={pending}>
        {pending ? "Yoxlanılır..." : "Daxil ol"}
      </button>
    </form>
  );
}
