import {
  createMailbox,
  createAlias,
  removeAlias,
  removeMailbox,
  setMailboxStatus,
  updateMailboxPassword,
} from "./actions";
import {
  listMailcowMailboxes,
  listMailcowAliases,
  type MailcowAlias,
  type MailcowMailbox,
} from "@/lib/mail/mailcow";
import { PasswordField } from "./password-field";

const DOMAIN = "sapiens-pay.com";

function megabytes(bytes = 0) {
  return Math.round(bytes / 1024 / 1024);
}

export default async function MailboxesPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    error?: string;
    displayName?: string;
    localPart?: string;
    quotaMb?: string;
  }>;
}) {
  const params = await searchParams;
  let mailboxes: MailcowMailbox[] = [];
  let aliases: MailcowAlias[] = [];
  let connectionError = false;
  try {
    const [mailboxItems, aliasItems] = await Promise.all([listMailcowMailboxes(), listMailcowAliases()]);
    mailboxes = mailboxItems.filter(
      (item) => item.domain === DOMAIN || item.username.endsWith(`@${DOMAIN}`),
    );
    aliases = aliasItems.filter((item) => item.domain === DOMAIN && !item.is_catch_all);
  } catch {
    connectionError = true;
  }

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Sapiens Mail</span>
          <h1>Mail ünvanları</h1>
          <p>Şirkət mailbox-larını Mailcow panelinə girmədən idarə edin.</p>
        </div>
        <a className="admin-button" href="/mail" target="_blank">
          Maili aç ↗
        </a>
      </div>

      {params.success ? <div className="mail-admin-alert is-success">{params.success}</div> : null}
      {params.error || connectionError ? (
        <div className="mail-admin-alert is-error">
          {params.error || "Mail serverinin idarəetmə API-si ilə əlaqə qurulmadı."}
        </div>
      ) : null}

      <section className="admin-panel mail-admin-create">
        <div className="admin-panel__header">
          <div>
            <h2>Yeni mail ünvanı</h2>
            <p>Məsələn: support, sales və ya əməkdaşın adı.</p>
          </div>
        </div>
        <form action={createMailbox} className="mail-admin-form">
          <label>
            Görünən ad
            <input name="displayName" required placeholder="Sapiens Support" maxLength={80} defaultValue={params.displayName} />
          </label>
          <label>
            Mail ünvanı
            <span className="mail-admin-address">
              <input name="localPart" required placeholder="support" maxLength={64} autoCapitalize="none" defaultValue={params.localPart} />
              <b>@{DOMAIN}</b>
            </span>
          </label>
          <PasswordField />
          <label>
            Yaddaş limiti
            <select name="quotaMb" defaultValue={params.quotaMb || "5120"}>
              <option value="2048">2 GB</option>
              <option value="5120">5 GB</option>
              <option value="10240">10 GB</option>
            </select>
          </label>
          <button className="admin-button admin-button--primary">+ Ünvan yarat</button>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__header">
          <div>
            <h2>Mövcud mailbox-lar</h2>
            <p>{mailboxes.length} ayrıca giriş hesabı</p>
          </div>
        </div>
        {mailboxes.length ? (
          <div className="mail-admin-list">
            {mailboxes.map((item) => {
              const active = String(item.active) === "1";
              const primary = item.username === "info@sapiens-pay.com";
              return (
                <article className="mail-admin-item" key={item.username}>
                  <div className="mail-admin-identity">
                    <b>{(item.name || item.username).slice(0, 1).toUpperCase()}</b>
                    <span>
                      <strong>{item.name || "Adsız mailbox"}</strong>
                      <small>{item.username}</small>
                    </span>
                  </div>
                  <div className="mail-admin-usage">
                    <span>{item.messages ?? 0} məktub</span>
                    <span>{megabytes(item.quota_used)} / {megabytes(item.quota)} MB</span>
                    <i className={active ? "is-active" : ""}>{active ? "Aktiv" : "Deaktiv"}</i>
                  </div>
                  <details className="mail-admin-details">
                    <summary>İdarə et</summary>
                    <div>
                      <form action={updateMailboxPassword}>
                        <input type="hidden" name="username" value={item.username} />
                        <PasswordField label="Yeni şifrə" />
                        <button className="admin-button">Şifrəni dəyiş</button>
                      </form>
                      {!primary ? (
                        <form action={setMailboxStatus}>
                          <input type="hidden" name="username" value={item.username} />
                          <input type="hidden" name="active" value={active ? "0" : "1"} />
                          <button className="admin-button">{active ? "Deaktiv et" : "Aktiv et"}</button>
                        </form>
                      ) : null}
                      {!primary ? (
                        <form action={removeMailbox} className="mail-admin-delete">
                          <input type="hidden" name="username" value={item.username} />
                          <label>
                            Silmək üçün ünvanı tam yazın
                            <input name="confirmation" required placeholder={item.username} autoComplete="off" />
                          </label>
                          <button className="admin-button">Birdəfəlik sil</button>
                        </form>
                      ) : <small>Əsas info mailbox-u deaktiv edilə və silinə bilməz.</small>}
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        ) : !connectionError ? <div className="admin-empty">Mailbox tapılmadı.</div> : null}
      </section>

      <section className="admin-panel mail-admin-create" style={{ marginTop: 22 }}>
        <div className="admin-panel__header"><div><h2>Yönləndirmə aliasları</h2><p>Ayrıca mailbox yaratmadan ünvanı mövcud hesaba yönləndirin.</p></div></div>
        <form action={createAlias} className="mail-admin-form">
          <label>Alias ünvanı<span className="mail-admin-address"><input name="localPart" required placeholder="support" autoCapitalize="none"/><b>@{DOMAIN}</b></span></label>
          <label>Çatacağı mailbox<select name="destination" required>{mailboxes.filter((item) => String(item.active) === "1").map((item) => <option key={item.username}>{item.username}</option>)}</select></label>
          <button className="admin-button admin-button--primary">+ Alias yarat</button>
        </form>
        <div className="mail-admin-list">
          {aliases.map((item) => <article className="mail-admin-item" key={item.id}>
            <div className="mail-admin-identity"><b>↪</b><span><strong>{item.address}</strong><small>→ {item.goto}</small></span></div>
            <span className="mail-admin-usage"><i className={String(item.active) === "1" ? "is-active" : ""}>{String(item.active) === "1" ? "Aktiv" : "Deaktiv"}</i></span>
            <form action={removeAlias}><input type="hidden" name="id" value={item.id}/><button className="admin-button">Sil</button></form>
          </article>)}
          {!aliases.length ? <div className="admin-empty">Alias yaradılmayıb.</div> : null}
        </div>
      </section>
    </main>
  );
}
