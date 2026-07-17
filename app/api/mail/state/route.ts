import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as {
    messageId?: string;
    folder?: string;
    isRead?: boolean;
    isStarred?: boolean;
  };
  if (
    !body.messageId ||
    (body.folder &&
      !["inbox", "archive", "trash", "spam"].includes(body.folder))
  )
    return Response.json({ error: "Invalid" }, { status: 400 });
  const payload = {
    user_id: auth.user.id,
    message_id: body.messageId,
    ...(body.folder ? { folder: body.folder } : {}),
    ...(typeof body.isRead === "boolean" ? { is_read: body.isRead } : {}),
    ...(typeof body.isStarred === "boolean"
      ? { is_starred: body.isStarred }
      : {}),
  };
  const { error } = await supabase
    .from("mail_states")
    .upsert(payload, { onConflict: "user_id,message_id" });
  return error
    ? Response.json({ error: error.message }, { status: 500 })
    : Response.json({ ok: true });
}
