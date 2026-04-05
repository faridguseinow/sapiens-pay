import type { Metadata } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Sapiens Pay",
  description:
    "Meta, Google Ads və TikTok reklam ödənişləri üçün xarici bank kartlarının rəsmi açılışı. Daha az xərc, daha çox nəticə.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body>
        {children}
      </body>
    </html>
  );
}
