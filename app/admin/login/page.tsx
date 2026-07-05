import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin giriş | Sapiens Pay",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="admin-login">
      <div className="admin-login__glow" />
      <section className="admin-login__card">
        <Link href="/" className="admin-brand" aria-label="Sapiens Pay">
          <span>sapiens</span>
          <b>pay</b>
        </Link>
        <div className="admin-login__heading">
          <span className="admin-eyebrow">Şəxsi idarəetmə paneli</span>
          <h1>Xoş gəldiniz</h1>
          <p>Müştəri müraciətlərini və bloq yazılarını bir mərkəzdən idarə edin.</p>
        </div>
        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <div className="admin-setup-notice">
            <strong>Supabase bağlantısı gözlənilir</strong>
            <p>Panel hazırda qoşulmayıb. Sayt administratoru ilə əlaqə saxlayın.</p>
          </div>
        )}
        <p className="admin-login__secure">Qorunan giriş · Sapiens Pay komandası üçün</p>
      </section>
    </main>
  );
}
