"use client";

import { useState } from "react";
import type { Locale } from "../lib/i18n";

type Choice = {
  label: string;
  value: string;
};

type QuizCopy = {
  step1Title: string;
  step1Subtitle: string;
  step2Title: string;
  step2Subtitle: string;
  step3Title: string;
  step3Subtitle: string;
  stepLabel: string;
  next: string;
  back: string;
  submitLead: string;
  successTitle: string;
  successText: string;
  submitErrorText: string;
  problemBanner: string;
  q1: string;
  q1Options: Choice[];
  q2: string;
  q2Options: Choice[];
  q3: string;
  q3Options: Choice[];
  q4: string;
  q4Options: Choice[];
  q5: string;
  q5Options: Choice[];
  q6: string;
  q6Options: Choice[];
  q7: string;
  q7Placeholder: string;
  q8: string;
  q8Placeholder: string;
  q9: string;
  q9Options: Choice[];
  submitLeadText: string;
};

const quizCopy: Record<Locale, QuizCopy> = {
  az: {
    step1Title: "Gəlin sizi daha yaxından tanıyaq",
    step1Subtitle: "Sizə ən uyğun həlli təklif etmək üçün 3 qısa suala cavab verin",
    step2Title: "İndi əsas məsələyə keçək",
    step2Subtitle: "Komissiyalar sizə nə qədər təsir edir?",
    step3Title: "Sizə uyğun həlli hazırlayaq",
    step3Subtitle: "Məlumatlarınızı qeyd edin, biz sizinlə əlaqə saxlayaq",
    stepLabel: "Addım",
    next: "Növbəti",
    back: "Geri",
    submitLead: "Müraciət et",
    successTitle: "Müraciətiniz qeydə alındı",
    successText: "Qısa zamanda sizinlə əlaqə saxlayacağıq.",
    submitErrorText: "Göndəriş alınmadı. Zəhmət olmasa bir daha cəhd edin.",
    problemBanner: "Siz artıq ayda təxminən",
    q1: "Hansı sahədə fəaliyyət göstərirsiniz?",
    q1Options: [
      { label: "E-commerce (online mağaza)", value: "ecom" },
      { label: "Marketinq / Reklam agentliyi", value: "agency" },
      { label: "Dropshipping", value: "dropshipping" },
      { label: "Freelancer (SMM, dizayn, proqramlaşdırma və s.)", value: "freelancer" },
      { label: "Şirkət / Biznes sahibi", value: "business" },
      { label: "Digər", value: "other" },
    ],
    q2: "Reklamları harada yerləşdirirsiniz?",
    q2Options: [
      { label: "Meta (Instagram / Facebook)", value: "meta" },
      { label: "Google Ads", value: "google" },
      { label: "TikTok Ads", value: "tiktok" },
      { label: "Hamısı", value: "all" },
      { label: "Hələ reklam vermirəm", value: "none" },
    ],
    q3: "Aylıq reklam büdcəniz nə qədərdir?",
    q3Options: [
      { label: "0 – 500 AZN", value: "0-500" },
      { label: "500 – 2000 AZN", value: "500-2000" },
      { label: "2000 – 5000 AZN", value: "2000-5000" },
      { label: "5000+ AZN", value: "5000+" },
    ],
    q4: "Reklam ödənişlərində komissiya ödəyirsiniz?",
    q4Options: [
      { label: "Bəli, çox yüksəkdir", value: "high" },
      { label: "Bəli, amma nə qədər olduğunu bilmirəm", value: "unknown" },
      { label: "Bəzən olur", value: "sometimes" },
      { label: "Xeyr (əmin deyiləm)", value: "not-sure" },
    ],
    q5: "Təxminən aylıq nə qədər komissiya ödəyirsiniz?",
    q5Options: [
      { label: "50 – 200 AZN", value: "50-200" },
      { label: "200 – 500 AZN", value: "200-500" },
      { label: "500+ AZN", value: "500+" },
      { label: "Bilmirəm, amma hiss edirəm ki, çoxdur", value: "dont-know" },
    ],
    q6: "Əgər bu xərcləri azaltsanız, nə edərdiniz?",
    q6Options: [
      { label: "Daha çox reklam verərdim", value: "more-ads" },
      { label: "Yeni məhsul / xidmət əlavə edərdim", value: "new-product" },
      { label: "Biznesimi böyüdərdim", value: "grow" },
      { label: "Sadəcə qənaət edərdim", value: "save" },
    ],
    q7: "Adınız",
    q7Placeholder: "Adınızı daxil edin",
    q8: "Telefon nömrəniz",
    q8Placeholder: "+994 XX XXX XX XX",
    q9: "Hansı üsulla əlaqə saxlayaq?",
    q9Options: [
      { label: "Zəng", value: "call" },
      { label: "WhatsApp", value: "whatsapp" },
      { label: "Telegram", value: "telegram" },
    ],
    submitLeadText: "Müraciətinizi göndərin və komissiyalara artıq pul ödəməyin",
  },
  ru: {
    step1Title: "Давайте познакомимся ближе",
    step1Subtitle: "Ответьте на 3 коротких шага, чтобы мы предложили оптимальное решение",
    step2Title: "Теперь к основной задаче",
    step2Subtitle: "Насколько комиссии влияют на ваш бизнес?",
    step3Title: "Подготовим решение под вас",
    step3Subtitle: "Оставьте контакты, и мы свяжемся с вами",
    stepLabel: "Шаг",
    next: "Далее",
    back: "Назад",
    submitLead: "Оставить заявку",
    successTitle: "Заявка отправлена",
    successText: "Мы свяжемся с вами в ближайшее время.",
    submitErrorText: "Не удалось отправить заявку. Попробуйте ещё раз.",
    problemBanner: "Вы уже теряете примерно",
    q1: "В какой сфере вы работаете?",
    q1Options: [
      { label: "E-commerce (онлайн-магазин)", value: "ecom" },
      { label: "Маркетинг / Рекламное агентство", value: "agency" },
      { label: "Dropshipping", value: "dropshipping" },
      { label: "Фриланс (SMM, дизайн, разработка и т.д.)", value: "freelancer" },
      { label: "Компания / Владелец бизнеса", value: "business" },
      { label: "Другое", value: "other" },
    ],
    q2: "Где размещаете рекламу?",
    q2Options: [
      { label: "Meta (Instagram / Facebook)", value: "meta" },
      { label: "Google Ads", value: "google" },
      { label: "TikTok Ads", value: "tiktok" },
      { label: "Везде", value: "all" },
      { label: "Пока не запускаю рекламу", value: "none" },
    ],
    q3: "Какой у вас месячный рекламный бюджет?",
    q3Options: [
      { label: "0 – 500 AZN", value: "0-500" },
      { label: "500 – 2000 AZN", value: "500-2000" },
      { label: "2000 – 5000 AZN", value: "2000-5000" },
      { label: "5000+ AZN", value: "5000+" },
    ],
    q4: "Платите комиссии при рекламных платежах?",
    q4Options: [
      { label: "Да, очень высокие", value: "high" },
      { label: "Да, но не знаю сколько", value: "unknown" },
      { label: "Иногда", value: "sometimes" },
      { label: "Нет (не уверен)", value: "not-sure" },
    ],
    q5: "Сколько примерно в месяц уходит на комиссии?",
    q5Options: [
      { label: "50 – 200 AZN", value: "50-200" },
      { label: "200 – 500 AZN", value: "200-500" },
      { label: "500+ AZN", value: "500+" },
      { label: "Не знаю, но чувствую что много", value: "dont-know" },
    ],
    q6: "Что сделаете, если снизите эти расходы?",
    q6Options: [
      { label: "Запущу больше рекламы", value: "more-ads" },
      { label: "Добавлю новый продукт / услугу", value: "new-product" },
      { label: "Масштабирую бизнес", value: "grow" },
      { label: "Просто буду экономить", value: "save" },
    ],
    q7: "Ваше имя",
    q7Placeholder: "Введите имя",
    q8: "Ваш номер телефона",
    q8Placeholder: "+994 XX XXX XX XX",
    q9: "Как с вами связаться?",
    q9Options: [
      { label: "Звонок", value: "call" },
      { label: "WhatsApp", value: "whatsapp" },
      { label: "Telegram", value: "telegram" },
    ],
    submitLeadText: "Отправьте заявку и перестаньте переплачивать комиссии",
  },
  en: {
    step1Title: "Let us get to know you",
    step1Subtitle: "Answer 3 short steps so we can suggest the best-fit solution",
    step2Title: "Now let us address the core issue",
    step2Subtitle: "How much do commissions affect your business?",
    step3Title: "Let us prepare your best-fit solution",
    step3Subtitle: "Leave your details and we will contact you",
    stepLabel: "Step",
    next: "Next",
    back: "Back",
    submitLead: "Apply now",
    successTitle: "Your request has been sent",
    successText: "Our team will contact you shortly.",
    submitErrorText: "Request was not sent. Please try again.",
    problemBanner: "You are already losing around",
    q1: "What area do you work in?",
    q1Options: [
      { label: "E-commerce (online store)", value: "ecom" },
      { label: "Marketing / Advertising agency", value: "agency" },
      { label: "Dropshipping", value: "dropshipping" },
      { label: "Freelancer (SMM, design, development, etc.)", value: "freelancer" },
      { label: "Company / Business owner", value: "business" },
      { label: "Other", value: "other" },
    ],
    q2: "Where do you run ads?",
    q2Options: [
      { label: "Meta (Instagram / Facebook)", value: "meta" },
      { label: "Google Ads", value: "google" },
      { label: "TikTok Ads", value: "tiktok" },
      { label: "All of them", value: "all" },
      { label: "I am not running ads yet", value: "none" },
    ],
    q3: "What is your monthly ad budget?",
    q3Options: [
      { label: "0 – 500 AZN", value: "0-500" },
      { label: "500 – 2000 AZN", value: "500-2000" },
      { label: "2000 – 5000 AZN", value: "2000-5000" },
      { label: "5000+ AZN", value: "5000+" },
    ],
    q4: "Do you pay commissions on ad payments?",
    q4Options: [
      { label: "Yes, very high", value: "high" },
      { label: "Yes, but I do not know how much", value: "unknown" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No (not sure)", value: "not-sure" },
    ],
    q5: "How much do you roughly pay in monthly commissions?",
    q5Options: [
      { label: "50 – 200 AZN", value: "50-200" },
      { label: "200 – 500 AZN", value: "200-500" },
      { label: "500+ AZN", value: "500+" },
      { label: "Not sure, but it feels high", value: "dont-know" },
    ],
    q6: "If you reduced these costs, what would you do?",
    q6Options: [
      { label: "Run more ads", value: "more-ads" },
      { label: "Add a new product / service", value: "new-product" },
      { label: "Scale my business", value: "grow" },
      { label: "Just save the difference", value: "save" },
    ],
    q7: "Your name",
    q7Placeholder: "Enter your name",
    q8: "Your phone number",
    q8Placeholder: "+994 XX XXX XX XX",
    q9: "How should we contact you?",
    q9Options: [
      { label: "Phone call", value: "call" },
      { label: "WhatsApp", value: "whatsapp" },
      { label: "Telegram", value: "telegram" },
    ],
    submitLeadText: "Send your request and stop overpaying commissions",
  },
};

type Answers = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  name: string;
  phone: string;
  contact?: string;
};

type LeadPayload = {
  locale: Locale;
  estimatedLoss: number;
  contact: {
    name: string;
    phone: string;
    preferredContact: string;
  };
  profile: {
    businessType: string;
    adPlatforms: string;
    adBudget: string;
    commissionLevel: string;
    commissionAmount: string;
    growthPlan: string;
  };
  qa: Array<{ question: string; answer: string }>;
  submittedAt: string;
};

const PHONE_PREFIX = "+994";

const initialAnswers: Answers = {
  name: "",
  phone: PHONE_PREFIX,
};

const budgetEstimate: Record<string, number> = {
  "0-500": 350,
  "500-2000": 1250,
  "2000-5000": 3500,
  "5000+": 6000,
};

const commissionRate: Record<string, number> = {
  high: 0.18,
  unknown: 0.12,
  sometimes: 0.08,
  "not-sure": 0.06,
};

const fixedLoss: Record<string, number> = {
  "50-200": 125,
  "200-500": 350,
  "500+": 650,
};

function calculateLoss(answers: Answers) {
  if (answers.q5 && answers.q5 in fixedLoss) {
    return fixedLoss[answers.q5];
  }

  const budget = answers.q3 ? budgetEstimate[answers.q3] ?? 700 : 700;
  const rate = answers.q4 ? commissionRate[answers.q4] ?? 0.1 : 0.1;
  const value = Math.round((budget * rate) / 10) * 10;
  return Math.max(value, 60);
}

function findLabel(options: Choice[], value?: string) {
  if (!value) return "—";
  return options.find((item) => item.value === value)?.label ?? value;
}

function buildPayload(locale: Locale, c: QuizCopy, answers: Answers, estimatedLoss: number): LeadPayload {
  const q1 = findLabel(c.q1Options, answers.q1);
  const q2 = findLabel(c.q2Options, answers.q2);
  const q3 = findLabel(c.q3Options, answers.q3);
  const q4 = findLabel(c.q4Options, answers.q4);
  const q5 = findLabel(c.q5Options, answers.q5);
  const q6 = findLabel(c.q6Options, answers.q6);
  const q9 = findLabel(c.q9Options, answers.contact);

  return {
    locale,
    estimatedLoss,
    contact: {
      name: answers.name.trim(),
      phone: answers.phone.trim(),
      preferredContact: q9,
    },
    profile: {
      businessType: q1,
      adPlatforms: q2,
      adBudget: q3,
      commissionLevel: q4,
      commissionAmount: q5,
      growthPlan: q6,
    },
    qa: [
      { question: c.q1, answer: q1 },
      { question: c.q2, answer: q2 },
      { question: c.q3, answer: q3 },
      { question: c.q4, answer: q4 },
      { question: c.q5, answer: q5 },
      { question: c.q6, answer: q6 },
      { question: c.q7, answer: answers.name.trim() },
      { question: c.q8, answer: answers.phone.trim() },
      { question: c.q9, answer: q9 },
    ],
    submittedAt: new Date().toISOString(),
  };
}

export function LeadQuiz({ locale }: { locale: Locale }) {
  const c = quizCopy[locale];
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  const estimatedLoss = calculateLoss(answers);
  const phoneDigits = answers.phone.replace(/\D/g, "");
  const hasPhoneNumber = phoneDigits.length > 3;

  const canNextFromStep1 = Boolean(answers.q1 && answers.q2 && answers.q3);
  const canNextFromStep2 = Boolean(answers.q4 && answers.q5 && answers.q6);
  const canSubmit = Boolean(answers.name.trim() && hasPhoneNumber && answers.contact);

  const handlePhoneChange = (rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "");
    const localDigits = digits.startsWith("994") ? digits.slice(3) : digits;
    setAnswers((prev) => ({ ...prev, phone: `${PHONE_PREFIX}${localDigits}` }));
  };

  const goNext = () => {
    if (step === 0 && !canNextFromStep1) return;
    if (step === 1 && !canNextFromStep2) return;
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setSubmitError(null);
    setIsSubmitting(true);

    const payload = buildPayload(locale, c, answers, estimatedLoss);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as
          | { error?: string; detail?: string }
          | null;
        const backendMessage = errorData?.detail ?? errorData?.error ?? "failed_to_send";
        throw new Error(backendMessage);
      }

      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setSubmitError(message ? `${c.submitErrorText} (${message})` : c.submitErrorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="lead-quiz section" id="muraciet">
      <div className="container lead-quiz__inner">
        <div className="lead-quiz__head">
          <p className="tag">
            {c.stepLabel} {step + 1}/3
          </p>
          <h2>{step === 0 ? c.step1Title : step === 1 ? c.step2Title : c.step3Title}</h2>
          <p className="lead-quiz__sub">
            {step === 0 ? c.step1Subtitle : step === 1 ? c.step2Subtitle : c.step3Subtitle}
          </p>

          {step === 2 ? (
            <p className="lead-quiz__loss">
              {c.problemBanner} <strong>{estimatedLoss} AZN</strong>
            </p>
          ) : null}
        </div>

        <form className="lead-quiz__form" onSubmit={onSubmit}>
          {submitted ? (
            <div className="lead-quiz__success">
              <h3>{c.successTitle}</h3>
              <p>{c.successText}</p>
            </div>
          ) : null}

          {!submitted && step === 0 ? (
            <div className="lead-quiz__step">
              <fieldset>
                <legend>{c.q1}</legend>
                {c.q1Options.map((option) => (
                  <label key={option.value} className="lead-quiz__option">
                    <input
                      type="radio"
                      name="q1"
                      value={option.value}
                      checked={answers.q1 === option.value}
                      onChange={() => setAnswers((prev) => ({ ...prev, q1: option.value }))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset>
                <legend>{c.q2}</legend>
                {c.q2Options.map((option) => (
                  <label key={option.value} className="lead-quiz__option">
                    <input
                      type="radio"
                      name="q2"
                      value={option.value}
                      checked={answers.q2 === option.value}
                      onChange={() => setAnswers((prev) => ({ ...prev, q2: option.value }))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset>
                <legend>{c.q3}</legend>
                {c.q3Options.map((option) => (
                  <label key={option.value} className="lead-quiz__option">
                    <input
                      type="radio"
                      name="q3"
                      value={option.value}
                      checked={answers.q3 === option.value}
                      onChange={() => setAnswers((prev) => ({ ...prev, q3: option.value }))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>
            </div>
          ) : null}

          {!submitted && step === 1 ? (
            <div className="lead-quiz__step">
              <fieldset>
                <legend>{c.q4}</legend>
                {c.q4Options.map((option) => (
                  <label key={option.value} className="lead-quiz__option">
                    <input
                      type="radio"
                      name="q4"
                      value={option.value}
                      checked={answers.q4 === option.value}
                      onChange={() => setAnswers((prev) => ({ ...prev, q4: option.value }))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset>
                <legend>{c.q5}</legend>
                {c.q5Options.map((option) => (
                  <label key={option.value} className="lead-quiz__option">
                    <input
                      type="radio"
                      name="q5"
                      value={option.value}
                      checked={answers.q5 === option.value}
                      onChange={() => setAnswers((prev) => ({ ...prev, q5: option.value }))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset>
                <legend>{c.q6}</legend>
                {c.q6Options.map((option) => (
                  <label key={option.value} className="lead-quiz__option">
                    <input
                      type="radio"
                      name="q6"
                      value={option.value}
                      checked={answers.q6 === option.value}
                      onChange={() => setAnswers((prev) => ({ ...prev, q6: option.value }))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>
            </div>
          ) : null}

          {!submitted && step === 2 ? (
            <div className="lead-quiz__step">
              <label className="lead-quiz__input">
                <span>{c.q7}</span>
                <input
                  type="text"
                  placeholder={c.q7Placeholder}
                  value={answers.name}
                  onChange={(event) =>
                    setAnswers((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="lead-quiz__input">
                <span>{c.q8}</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder={c.q8Placeholder.replace("+994 ", "")}
                  value={answers.phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  required
                />
              </label>

              <fieldset>
                <legend>{c.q9}</legend>
                <div className="lead-quiz__contact-grid">
                  {c.q9Options.map((option) => (
                    <label key={option.value} className="lead-quiz__option">
                      <input
                        type="radio"
                        name="q9"
                        value={option.value}
                        checked={answers.contact === option.value}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, contact: option.value }))
                        }
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          ) : null}

          {!submitted && submitError ? <p className="lead-quiz__error">{submitError}</p> : null}

          {!submitted ? (
            <div className="lead-quiz__actions">
              {step > 0 ? (
                <button type="button" className="btn btn--ghost" onClick={goBack}>
                  {c.back}
                </button>
              ) : (
                <span />
              )}

              {step < 2 ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={goNext}
                  disabled={
                    isSubmitting ||
                    (step === 0 && !canNextFromStep1) ||
                    (step === 1 && !canNextFromStep2)
                  }
                >
                  {c.next}
                </button>
              ) : (
                <div className="lead-quiz__submit-wrap">
                  <p>{c.submitLeadText}</p>
                  <button type="submit" className="btn btn--primary" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Sending..." : c.submitLead}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
