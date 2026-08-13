import type { SalesCustomerStatus } from "@/lib/database.types";

export const SALES_STATUSES: { value: SalesCustomerStatus; label: string }[] = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "Əlaqə saxlanılıb" },
  { value: "interested", label: "Maraqlanır" },
  { value: "proposal", label: "Təklif verilib" },
  { value: "won", label: "Müştəri oldu" },
  { value: "lost", label: "Bağlandı" },
];

export const SALES_SOURCE_KEYS = [
  "instagram-organic", "whatsapp", "referral", "website", "sales-outbound", "other",
] as const;

export const SALES_SOURCE_LABELS: Record<(typeof SALES_SOURCE_KEYS)[number], string> = {
  "instagram-organic": "Instagram",
  whatsapp: "WhatsApp",
  referral: "Tövsiyə",
  website: "Vebsayt",
  "sales-outbound": "Satış təmsilçisinin birbaşa əlaqəsi",
  other: "Digər",
};

export function salesSourceLabel(key: string, fallback: string) {
  return SALES_SOURCE_LABELS[key as keyof typeof SALES_SOURCE_LABELS] ?? fallback;
}

export function bakuDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Baku", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}
