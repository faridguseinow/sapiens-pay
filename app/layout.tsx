import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.scss";

const GA_MEASUREMENT_ID = "G-NPNDGYZQ7E";

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
      <head>
        <script src="https://app.inlyne.ai/scripts/preview.js" async></script>
      </head>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
