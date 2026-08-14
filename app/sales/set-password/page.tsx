import type { Metadata } from "next";
import Link from "next/link";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Şifrəni təyin et | Sapiens Pay", robots: { index: false, follow: false } };

export default function SetSalesPasswordPage() {
  return (
    <main className="admin-login sales-login">
      <div className="admin-login__glow" />
      <section className="admin-login__card">
        <Link href="/" className="admin-brand"><span>sapiens</span><b>pay</b></Link>
        <div className="admin-login__heading"><span className="admin-eyebrow">Satış komandası</span><h1>Şifrənizi təyin edin</h1><p>Satış panelinə giriş üçün yalnız sizə məlum olan güclü şifrə yaradın.</p></div>
        <PasswordForm />
        <p className="admin-login__secure">Dəvət linki şəxsi və birdəfəlikdir</p>
      </section>
    </main>
  );
}
