export const MAIL_ADMIN_OWNER = "cavidrahimo@gmail.com";

export function isMailAdminOwner(email: unknown) {
  return typeof email === "string" && email.trim().toLowerCase() === MAIL_ADMIN_OWNER;
}
