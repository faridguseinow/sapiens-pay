"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import type { Locale } from "../lib/i18n";

export type ServiceKey =
  | "foreign-bank-accounts"
  | "shopify-payments"
  | "company-formation"
  | "international-payments";

export type LeadContext = {
  service?: ServiceKey;
  packageName?: string;
  sourcePath?: string;
  sourceLabel?: string;
};

type Choice = { value: string; label: string };

const services: Record<Locale, Choice[]> = {
  az: [
    { value: "foreign-bank-accounts", label: "Xarici bank hesablarının açılması" },
    { value: "shopify-payments", label: "Shopify Payments quraşdırılması" },
    { value: "company-formation", label: "Xarici şirkət açılması" },
    { value: "international-payments", label: "Beynəlxalq ödəniş sistemlərinin qoşulması" },
  ],
  ru: [
    { value: "foreign-bank-accounts", label: "Открытие зарубежного банковского счёта" },
    { value: "shopify-payments", label: "Подключение Shopify Payments" },
    { value: "company-formation", label: "Регистрация компании за рубежом" },
    { value: "international-payments", label: "Подключение международных платёжных систем" },
  ],
  en: [
    { value: "foreign-bank-accounts", label: "Foreign bank account opening" },
    { value: "shopify-payments", label: "Shopify Payments setup" },
    { value: "company-formation", label: "Foreign company formation" },
    { value: "international-payments", label: "International payment system integration" },
  ],
};

const packages: Record<ServiceKey, Record<Locale, Choice[]>> = {
  "foreign-bank-accounts": {
    az: [
      { value: "Wise Personal", label: "Wise Personal — 149 USD" },
      { value: "Wise Business", label: "Wise Business — 249 USD" },
      { value: "Payoneer Business", label: "Payoneer Business — 249 USD" },
      { value: "Məsləhət lazımdır", label: "Hansı hesabın uyğun olduğuna əmin deyiləm" },
    ],
    ru: [
      { value: "Wise Personal", label: "Wise Personal — 149 USD" },
      { value: "Wise Business", label: "Wise Business — 249 USD" },
      { value: "Payoneer Business", label: "Payoneer Business — 249 USD" },
      { value: "Нужна консультация", label: "Не уверен, какой счёт мне подходит" },
    ],
    en: [
      { value: "Wise Personal", label: "Wise Personal — USD 149" },
      { value: "Wise Business", label: "Wise Business — USD 249" },
      { value: "Payoneer Business", label: "Payoneer Business — USD 249" },
      { value: "Consultation needed", label: "I am not sure which account fits" },
    ],
  },
  "shopify-payments": {
    az: [
      { value: "Şirkətsiz quraşdırma", label: "Şirkətsiz quraşdırma — 279 USD" },
      { value: "Şirkət üzərindən biznes", label: "Şirkət üzərindən biznes — 349 USD" },
      { value: "Məsləhət lazımdır", label: "Uyğun paketi birlikdə seçək" },
    ],
    ru: [
      { value: "Настройка без компании", label: "Настройка без компании — 279 USD" },
      { value: "Бизнес через компанию", label: "Бизнес через компанию — 349 USD" },
      { value: "Нужна консультация", label: "Помогите выбрать пакет" },
    ],
    en: [
      { value: "Setup without company", label: "Setup without a company — USD 279" },
      { value: "Company business setup", label: "Company business setup — USD 349" },
      { value: "Consultation needed", label: "Help me choose a package" },
    ],
  },
  "company-formation": {
    az: [
      { value: "ABŞ", label: "ABŞ-da şirkət" },
      { value: "Böyük Britaniya", label: "Böyük Britaniyada şirkət" },
      { value: "Digər ölkə", label: "Digər ölkə və ya ölkə seçimi üzrə konsultasiya" },
    ],
    ru: [
      { value: "США", label: "Компания в США" },
      { value: "Великобритания", label: "Компания в Великобритании" },
      { value: "Другая страна", label: "Другая страна или консультация по выбору" },
    ],
    en: [
      { value: "USA", label: "Company in the USA" },
      { value: "United Kingdom", label: "Company in the United Kingdom" },
      { value: "Other country", label: "Another country or country-selection advice" },
    ],
  },
  "international-payments": {
    az: [
      { value: "Stripe", label: "Stripe" },
      { value: "PayPal", label: "PayPal" },
      { value: "Digər sistem", label: "Digər ödəniş sistemi" },
      { value: "Məsləhət lazımdır", label: "Biznesimə uyğun həlli seçmək istəyirəm" },
    ],
    ru: [
      { value: "Stripe", label: "Stripe" },
      { value: "PayPal", label: "PayPal" },
      { value: "Другая система", label: "Другая платёжная система" },
      { value: "Нужна консультация", label: "Хочу подобрать решение для бизнеса" },
    ],
    en: [
      { value: "Stripe", label: "Stripe" },
      { value: "PayPal", label: "PayPal" },
      { value: "Other system", label: "Another payment system" },
      { value: "Consultation needed", label: "I want the right solution for my business" },
    ],
  },
};

const copy = {
  az: {
    titles: ["Sizə hansı xidmət lazımdır?", "Ehtiyacınızı dəqiqləşdirək", "Əlaqə məlumatlarınız"],
    subtitles: [
      "Maraqlandığınız xidməti seçin — müraciətiniz birbaşa uyğun istiqamət üzrə qeydə alınacaq.",
      "Bu məlumatlar komandamızın sizə daha dəqiq həll təklif etməsinə kömək edəcək.",
      "Müraciəti tamamlayın, komandamız qısa zamanda sizinlə əlaqə saxlasın.",
    ],
    step: "Addım", next: "Növbəti", back: "Geri", submit: "Müraciəti göndər",
    package: "Hansı paket və ya istiqamət sizi maraqlandırır?",
    status: "Hazırda şirkətiniz varmı?", timeline: "Nə vaxt başlamağı planlaşdırırsınız?",
    details: "Əlavə qeydiniz", detailsPlaceholder: "Biznesiniz və ehtiyacınız haqqında qısa məlumat...",
    name: "Adınız", email: "E-poçt ünvanınız", emailPlaceholder: "adiniz@example.com",
    emailError: "Düzgün e-poçt ünvanı daxil edin (məsələn: adiniz@example.com).",
    phone: "Telefon nömrəniz", contact: "Sizinlə necə əlaqə saxlayaq?",
    directTitle: "üçün müraciət", directSubtitle: "Şəxsi məlumatlarınızı qeyd edin, komandamız sizinlə əlaqə saxlasın.",
    success: "Müraciətiniz qeydə alındı", successText: "Seçdiyiniz xidmət üzrə qısa zamanda sizinlə əlaqə saxlayacağıq.",
    error: "Göndəriş alınmadı. Zəhmət olmasa bir daha cəhd edin.",
    statuses: ["Şirkətim var", "Şirkətim yoxdur", "Şəxsi istifadə üçündür"],
    timelines: ["Mümkün qədər tez", "1 ay ərzində", "Hələ araşdırıram"],
  },
  ru: {
    titles: ["Какая услуга вам нужна?", "Уточним вашу задачу", "Ваши контакты"],
    subtitles: [
      "Выберите услугу — заявка сразу попадёт к нужному направлению.",
      "Эти данные помогут команде предложить более точное решение.",
      "Завершите заявку, и мы свяжемся с вами в ближайшее время.",
    ],
    step: "Шаг", next: "Далее", back: "Назад", submit: "Отправить заявку",
    package: "Какой пакет или вариант вас интересует?",
    status: "У вас уже есть компания?", timeline: "Когда планируете начать?",
    details: "Дополнительный комментарий", detailsPlaceholder: "Кратко опишите бизнес и задачу...",
    name: "Ваше имя", email: "Электронная почта", emailPlaceholder: "name@example.com",
    emailError: "Введите корректный адрес электронной почты (например: name@example.com).",
    phone: "Номер телефона", contact: "Как с вами связаться?",
    directTitle: "— заявка", directSubtitle: "Оставьте контактные данные, и наша команда свяжется с вами.",
    success: "Заявка принята", successText: "Мы скоро свяжемся с вами по выбранной услуге.",
    error: "Не удалось отправить заявку. Попробуйте ещё раз.",
    statuses: ["Компания есть", "Компании нет", "Для личного использования"],
    timelines: ["Как можно скорее", "В течение месяца", "Пока изучаю варианты"],
  },
  en: {
    titles: ["Which service do you need?", "Let’s clarify your needs", "Your contact details"],
    subtitles: [
      "Choose a service and your request will be routed to the right specialist.",
      "This information helps our team recommend a more accurate solution.",
      "Complete the request and our team will contact you shortly.",
    ],
    step: "Step", next: "Next", back: "Back", submit: "Send request",
    package: "Which package or direction interests you?",
    status: "Do you currently have a company?", timeline: "When do you plan to start?",
    details: "Additional note", detailsPlaceholder: "Briefly describe your business and needs...",
    name: "Your name", email: "Email address", emailPlaceholder: "name@example.com",
    emailError: "Enter a valid email address (for example: name@example.com).",
    phone: "Phone number", contact: "How should we contact you?",
    directTitle: "application", directSubtitle: "Leave your contact details and our team will get in touch.",
    success: "Your request has been received", successText: "We will contact you shortly about your selected service.",
    error: "The request could not be sent. Please try again.",
    statuses: ["I have a company", "I do not have a company", "For personal use"],
    timelines: ["As soon as possible", "Within one month", "I am still researching"],
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

const contactOptions: Choice[] = [
  { value: "call", label: "Call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
];

function countryFlag(code: CountryCode) {
  return code
    .split("")
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join("");
}

function CountryPhoneField({
  locale,
  countryCode,
  onCountryChange,
  localPhone,
  onPhoneChange,
  label,
}: {
  locale: Locale;
  countryCode: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  localPhone: string;
  onPhoneChange: (value: string) => void;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const displayNames = useMemo(
    () => new Intl.DisplayNames([locale], { type: "region" }),
    [locale],
  );
  const countries = useMemo(
    () =>
      getCountries()
        .map((code) => ({
          code,
          name: displayNames.of(code) ?? code,
          dial: `+${getCountryCallingCode(code)}`,
        }))
        .sort((a, b) =>
          a.code === "AZ" ? -1 : b.code === "AZ" ? 1 : a.name.localeCompare(b.name, locale),
        ),
    [displayNames, locale],
  );
  const selected = countries.find((country) => country.code === countryCode) ?? countries[0];
  const normalizedSearch = search.trim().toLocaleLowerCase(locale);
  const filteredCountries = countries.filter(
    (country) =>
      !normalizedSearch ||
      country.name.toLocaleLowerCase(locale).includes(normalizedSearch) ||
      country.code.toLocaleLowerCase(locale).includes(normalizedSearch) ||
      country.dial.includes(normalizedSearch.replace(/\s/g, "")),
  );

  useEffect(() => {
    if (!isOpen) return;
    searchRef.current?.focus();
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="lead-quiz__phone" ref={rootRef}>
      <div className="country-picker">
        <button
          type="button"
          className="country-picker__trigger"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => {
            setIsOpen((value) => !value);
            setSearch("");
          }}
        >
          <span>{countryFlag(selected.code)}</span>
          <b>{selected.dial}</b>
          <i aria-hidden="true">⌄</i>
        </button>
        {isOpen ? (
          <div className="country-picker__dropdown">
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={locale === "az" ? "Ölkə və ya kod axtar..." : locale === "ru" ? "Поиск страны или кода..." : "Search country or code..."}
              aria-label={locale === "az" ? "Ölkə axtar" : locale === "ru" ? "Поиск страны" : "Search country"}
            />
            <div className="country-picker__list" role="listbox">
              {filteredCountries.map((country) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={country.code === countryCode}
                  key={country.code}
                  onClick={() => {
                    onCountryChange(country.code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <span>{countryFlag(country.code)}</span>
                  <span>{country.name}</span>
                  <b>{country.dial}</b>
                </button>
              ))}
              {!filteredCountries.length ? (
                <p>{locale === "az" ? "Ölkə tapılmadı" : locale === "ru" ? "Страна не найдена" : "No country found"}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={localPhone}
        placeholder={countryCode === "AZ" ? "50 123 45 67" : label}
        onChange={(event) => onPhoneChange(event.target.value.replace(/[^\d\s()-]/g, ""))}
        aria-label={label}
        required
      />
    </div>
  );
}

export function LeadQuiz({
  locale,
  embedded = false,
  context = {},
}: {
  locale: Locale;
  embedded?: boolean;
  context?: LeadContext;
}) {
  const c = copy[locale];
  const isDirectPackageLead = Boolean(context.service && context.packageName);
  const [step, setStep] = useState(isDirectPackageLead ? 2 : 0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [service, setService] = useState<ServiceKey | "">(context.service ?? "");
  const [packageName, setPackageName] = useState(context.packageName ?? "");
  const [businessStatus, setBusinessStatus] = useState("");
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("AZ");
  const [localPhone, setLocalPhone] = useState("");
  const [preferredContact, setPreferredContact] = useState("");

  const selectedService = services[locale].find((item) => item.value === service);
  const currentTitle = isDirectPackageLead
    ? locale === "az"
      ? `${packageName} ${c.directTitle}`
      : locale === "ru"
        ? `${packageName} ${c.directTitle}`
        : `${packageName} ${c.directTitle}`
    : c.titles[step];
  const currentSubtitle = isDirectPackageLead ? c.directSubtitle : c.subtitles[step];
  const canContinue = step === 0 ? Boolean(service) : Boolean(packageName && businessStatus && timeline);
  const fullPhone = `+${getCountryCallingCode(countryCode)}${localPhone.replace(/\D/g, "").replace(/^0+/, "")}`;
  const normalizedEmail = email.trim().toLocaleLowerCase();
  const isEmailValid =
    normalizedEmail.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail);
  const canSubmit =
    name.trim().length >= 2 &&
    isEmailValid &&
    fullPhone.replace(/\D/g, "").length >= 10 &&
    Boolean(preferredContact);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!service || !canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const contactLabel =
      preferredContact === "call"
        ? locale === "az" ? "Zəng" : locale === "ru" ? "Звонок" : "Call"
        : preferredContact === "telegram" && locale === "ru" ? "Телеграм" : preferredContact === "telegram" ? "Telegram" : "WhatsApp";

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          serviceKey: service,
          serviceName: selectedService?.label ?? service,
          packageName,
          sourcePath: context.sourcePath || window.location.pathname,
          sourceLabel: context.sourceLabel || "consultation",
          estimatedLoss: 0,
          contact: { name: name.trim(), email: normalizedEmail, phone: fullPhone, preferredContact },
          profile: {
            serviceKey: service,
            service: selectedService?.label ?? service,
            package: packageName,
            businessStatus,
            timeline,
            details,
            email: normalizedEmail,
            sourcePath: context.sourcePath || window.location.pathname,
            sourceLabel: context.sourceLabel || "consultation",
          },
          qa: [
            { question: c.titles[0], answer: selectedService?.label ?? service },
            { question: c.package, answer: packageName },
            { question: c.status, answer: businessStatus },
            { question: c.timeline, answer: timeline },
            { question: c.details, answer: details || "—" },
            { question: c.email, answer: normalizedEmail },
            { question: c.contact, answer: contactLabel },
          ],
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("failed_to_send");
      setSubmitted(true);
    } catch {
      setSubmitError(c.error as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`lead-quiz section${embedded ? " lead-quiz--embedded" : ""}`}>
      <div className="container lead-quiz__inner">
        <div className="lead-quiz__head">
          <p className="tag">{c.step} {isDirectPackageLead ? "1/1" : `${step + 1}/3`}</p>
          <h2>{currentTitle}</h2>
          <p className="lead-quiz__sub">{currentSubtitle}</p>
        </div>
        <form className="lead-quiz__form" onSubmit={submit}>
          {submitted ? (
            <div className="lead-quiz__success"><h3>{c.success}</h3><p>{c.successText}</p></div>
          ) : null}

          {!submitted && step === 0 ? (
            <div className="lead-quiz__step"><fieldset><legend>{c.titles[0]}</legend>
              {services[locale].map((option) => (
                <label key={option.value} className="lead-quiz__option">
                  <input type="radio" checked={service === option.value} onChange={() => {
                    setService(option.value as ServiceKey);
                    if (option.value !== context.service) setPackageName("");
                  }} />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset></div>
          ) : null}

          {!submitted && step === 1 && service ? (
            <div className="lead-quiz__step">
              <fieldset><legend>{c.package}</legend>
                {packages[service][locale].map((option) => (
                  <label key={option.value} className="lead-quiz__option">
                    <input type="radio" checked={packageName === option.value} onChange={() => setPackageName(option.value)} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>
              <fieldset><legend>{c.status}</legend>
                {(c.statuses as string[]).map((option) => (
                  <label key={option} className="lead-quiz__option">
                    <input type="radio" checked={businessStatus === option} onChange={() => setBusinessStatus(option)} />
                    <span>{option}</span>
                  </label>
                ))}
              </fieldset>
              <fieldset><legend>{c.timeline}</legend>
                {(c.timelines as string[]).map((option) => (
                  <label key={option} className="lead-quiz__option">
                    <input type="radio" checked={timeline === option} onChange={() => setTimeline(option)} />
                    <span>{option}</span>
                  </label>
                ))}
              </fieldset>
            </div>
          ) : null}

          {!submitted && step === 2 ? (
            <div className="lead-quiz__step">
              <label className="lead-quiz__input"><span>{c.name}</span>
                <input value={name} maxLength={100} autoComplete="name" onChange={(event) => setName(event.target.value)} required />
              </label>
              <label className="lead-quiz__input">
                <span>{c.email}</span>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  maxLength={254}
                  placeholder={c.emailPlaceholder as string}
                  aria-invalid={emailTouched && !isEmailValid}
                  aria-describedby="lead-email-error"
                  onBlur={() => setEmailTouched(true)}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                {emailTouched && !isEmailValid ? (
                  <small className="lead-quiz__field-error" id="lead-email-error">
                    {c.emailError}
                  </small>
                ) : null}
              </label>
              <label className="lead-quiz__input"><span>{c.phone}</span>
                <CountryPhoneField
                  locale={locale}
                  countryCode={countryCode}
                  onCountryChange={setCountryCode}
                  localPhone={localPhone}
                  onPhoneChange={setLocalPhone}
                  label={c.phone as string}
                />
              </label>
              <fieldset><legend>{c.contact}</legend><div className="lead-quiz__contact-grid">
                {contactOptions.map((option) => (
                  <label key={option.value} className="lead-quiz__option">
                    <input type="radio" checked={preferredContact === option.value} onChange={() => setPreferredContact(option.value)} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div></fieldset>
              <label className="lead-quiz__input"><span>{c.details}</span>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={details}
                  placeholder={c.detailsPlaceholder as string}
                  onChange={(event) => setDetails(event.target.value)}
                />
              </label>
            </div>
          ) : null}

          {!submitted && submitError ? <p className="lead-quiz__error">{submitError}</p> : null}
          {!submitted ? (
            <div className="lead-quiz__actions">
              {step > 0 && !isDirectPackageLead ? <button type="button" className="btn btn--ghost" onClick={() => setStep(step - 1)}>{c.back}</button> : <span />}
              {step < 2 ? (
                <button type="button" className="btn btn--primary" disabled={!canContinue} onClick={() => canContinue && setStep(step + 1)}>{c.next}</button>
              ) : (
                <button type="submit" className="btn btn--primary" disabled={!canSubmit || isSubmitting}>{isSubmitting ? "..." : c.submit}</button>
              )}
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
