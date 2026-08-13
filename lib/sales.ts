import type { SalesCustomerStatus } from "@/lib/database.types";

export const SALES_STATUSES: { value: SalesCustomerStatus; label: string }[] = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "Əlaqə saxlanılıb" },
  { value: "interested", label: "Maraqlanır" },
  { value: "proposal", label: "Təklif verilib" },
  { value: "won", label: "Müştəri oldu" },
  { value: "lost", label: "Bağlandı" },
];

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
