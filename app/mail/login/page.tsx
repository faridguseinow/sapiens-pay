import type { Metadata } from "next";
import Link from "next/link";
import { MailLoginForm } from "./login-form";

export const metadata: Metadata = { title: "Mail giriş | Sapiens Pay", robots: { index: false, follow: false } };

export default function MailLoginPage() {
  return <main className="mail-login"><section>
    <Link href="/" className="mail-brand"><span>sapiens</span><b>pay</b></Link>
    <small>ŞİRKƏT POÇTU</small><h1>Xoş gəldiniz</h1>
    <p>@sapiens-pay.com poçt qutunuza təhlükəsiz giriş.</p>
    <MailLoginForm />
  </section></main>;
}
