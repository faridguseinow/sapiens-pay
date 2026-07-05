import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.scss";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-NPNDGYZQ7E";

export const metadata: Metadata = {
  metadataBase: new URL("https://sapiens-pay.com"),
  title: {
    default: "Sapiens Pay — Beynəlxalq biznes həlləri",
    template: "%s | Sapiens Pay",
  },
  description:
    "Xarici bank hesabları, Shopify Payments, xarici şirkət qeydiyyatı və beynəlxalq ödəniş həlləri.",
  applicationName: "Sapiens Pay",
  openGraph: {
    type: "website",
    siteName: "Sapiens Pay",
    title: "Sapiens Pay — Beynəlxalq biznes həlləri",
    description:
      "Xarici bank hesabları, Shopify Payments və xarici şirkət qeydiyyatı üçün praktik dəstək.",
    url: "https://sapiens-pay.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sapiens Pay — Beynəlxalq biznes həlləri",
    description:
      "Xarici bank hesabları, Shopify Payments və xarici şirkət qeydiyyatı üçün praktik dəstək.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
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
