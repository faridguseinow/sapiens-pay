export const SAPIENS_SERVICES = [
  { key: "foreign-bank-accounts", label: "Xarici bank hesablarının açılması" },
  { key: "shopify-payments", label: "Shopify Payments quraşdırılması" },
  { key: "company-formation", label: "Xarici şirkət açılması" },
  { key: "international-payments", label: "Beynəlxalq ödəniş sistemlərinin qoşulması" },
] as const;

export type SapiensServiceKey = (typeof SAPIENS_SERVICES)[number]["key"];

export function serviceLabel(key: string) {
  return SAPIENS_SERVICES.find((service) => service.key === key)?.label ?? key;
}
