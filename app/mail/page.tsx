import { redirect } from "next/navigation";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { MailClient } from "./mail-client";

export const dynamic = "force-dynamic";

export default async function MailPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) redirect("/mail/login");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const [incoming, outgoing, stateResult, draftResult] = await Promise.all([
    resend.emails.receiving.list({ limit: 100 }),
    resend.emails.list({ limit: 100 }),
    supabase.from("mail_states").select("message_id,folder,is_read,is_starred"),
    supabase
      .from("mail_drafts")
      .select("id,recipients,cc,bcc,subject,body,updated_at")
      .order("updated_at", { ascending: false }),
  ]);
  return (
    <MailClient
      incoming={incoming.data?.data ?? []}
      outgoing={outgoing.data?.data ?? []}
      initialStates={stateResult.data ?? []}
      initialDrafts={draftResult.data ?? []}
      accountEmail={String(auth.claims.email ?? "")}
    />
  );
}
