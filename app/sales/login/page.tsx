import type { Metadata } from "next";
import Link from "next/link";
import { SalesLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Satış paneli | Sapiens Pay",
  robots: { index: false, follow: false },
};

export default function SalesLoginPage() {
  return (
    <main className="admin-login sales-login">
      <div className="admin-login__glow" />
      <section className="admin-login__card">
        <Link href="/" className="admin-brand"><span>sapiens</span><b>pay</b></Link>
        <div className="admin-login__heading">
          <span className="admin-eyebrow">Satış komandası</span>
          <h1>Satış iş sahəsi</h1>
          <p>Müştərilərinizi, növbəti addımları və sizə verilən tapşırıqları bir yerdə idarə edin.</p>
        </div>
        <SalesLoginForm />
        <p className="admin-login__secure">Yalnız satış təmsilçiləri üçün qorunan giriş</p>
      </section>
    </main>
  );
}
