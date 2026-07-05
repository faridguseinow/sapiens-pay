import { ImageResponse } from "next/og";

export const alt = "Sapiens Pay — beynəlxalq biznes və ödəniş həlləri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 85% 20%, #efffa0 0, #fbfff1 22%, #f5f6f2 48%, #ffffff 75%)",
          color: "#10130f",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 62, fontWeight: 700 }}>
          <span>sapiens</span>
          <span
            style={{
              display: "flex",
              marginLeft: 18,
              padding: "8px 20px",
              borderRadius: 18,
              background: "#dafa11",
              textTransform: "uppercase",
            }}
          >
            pay
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 950 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 700 }}>
            Beynəlxalq biznesiniz üçün düzgün ödəniş infrastrukturu
          </div>
          <div style={{ marginTop: 30, fontSize: 30, color: "#5f665b" }}>
            Xarici hesablar • Shopify Payments • Şirkət qeydiyyatı
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#70766c" }}>
          sapiens-pay.com
        </div>
      </div>
    ),
    size,
  );
}
