import { AdminLanguageLayer } from "./admin-language";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>
    <AdminLanguageLayer />
    {children}
  </>;
}
