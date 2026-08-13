import { readFile } from "node:fs/promises";

const envText = await readFile(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase server credentials are missing.");

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

const translationGroupId = "c43126b8-49ee-47d1-ae65-38b4223514ea";
const publishedAt = new Date().toISOString();
const coverFile = "wise-freelancer-payments.webp";
const coverObjectPath = `covers/${coverFile}`;
const coverBody = await readFile(new URL(`../public/blog/${coverFile}`, import.meta.url));
const uploadResponse = await fetch(`${url}/storage/v1/object/blog-images/${coverObjectPath}`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "image/webp",
    "x-upsert": "true",
    "Cache-Control": "public, max-age=31536000, immutable",
  },
  body: coverBody,
});
if (!uploadResponse.ok) throw new Error(`Cover upload ${uploadResponse.status}: ${await uploadResponse.text()}`);
const coverImage = `${url}/storage/v1/object/public/blog-images/${coverObjectPath}`;

const posts = [
  {
    translation_group_id: translationGroupId,
    locale: "az",
    title: "Wise hesabı olmayan freelancer nələri qaçırır?",
    subtitle: "Xarici müştəridən ödəniş alarkən sürət, etibar və valyuta çevikliyi niyə vacibdir?",
    slug: "wise-hesabi-olmayan-freelancer-neleri-qacirir",
    excerpt: "Wise hesabı və ya alternativ beynəlxalq ödəniş kanalı olmayan freelancerin qarşılaşdığı gecikmələri, xərcləri və müştəri təcrübəsi risklərini praktik nümunələrlə öyrənin.",
    seo_title: "Wise hesabı olmayan freelancer nələri qaçırır?",
    seo_description: "Wise hesabı olmayan freelancer hansı imkanları itirir? Xaricdən ödəniş, USD/EUR/GBP rekvizitləri, komissiya, gecikmə və alternativləri müqayisə edin.",
    category: "Freelance ödənişləri",
    focus_keyword: "freelancer üçün Wise hesabı",
    secondary_keywords: ["xaricdən ödəniş almaq", "Wise freelancer", "beynəlxalq ödəniş", "freelancer ödəniş üsulları"],
    tags: ["Wise", "freelancer", "xaricdən ödəniş", "çoxvalyutalı hesab", "Payoneer"],
    featured_image_alt: "Noutbuk qarşısında beynəlxalq valyutalarda ödəniş qəbul edən freelancer",
    content: `Freelancer üçün yeni müştəri tapmaq işin yalnız bir hissəsidir. Digər vacib hissə görülən işin ödənişini **vaxtında, təhlükəsiz və müştəri üçün rahat üsulla almaqdır**. Xarici müştəri “Please send your payment details” yazanda uyğun kanal axtarmağa başlamaq ödənişi və növbəti layihəni riskə ata bilər.

Wise yeganə seçim deyil. Ancaq uyğun ölkədə və uyğun hesab növündə Wise rekvizitlərinə çıxışınız varsa, USD, EUR və GBP kimi valyutalarda ödəniş qəbulunu sadələşdirə bilər. Əsas məqsəd bir platformaya bağlı qalmaq deyil, əvvəlcədən hazırlanmış və sənədlərlə uyğun gələn beynəlxalq ödəniş sistemi qurmaqdır.

> [!INFO] Wise funksiyaları yaşayış və ya şirkət qeydiyyatı ölkəsinə, hesab növünə və valyutaya görə dəyişir. Qeydiyyatdan əvvəl hesab məlumatlarının sizə açıq olub-olmadığını Wise daxilində yoxlayın.

## Wise hesabı olmayan freelancerin itirə biləcəyi 6 imkan

### 1. Müştəriyə dərhal ödəniş rekviziti göndərmək

Layihə təhvil verilib, invoice təsdiqlənib və müştəri ödənişə hazırdır. Bu anda bir neçə gün hesab axtarmaq qeyri-peşəkar təsir bağışlaya və ödəniş tarixini növbəti maliyyə dövrünə keçirə bilər. Hazır rekvizitlər isə invoice ilə birlikdə dərhal göndərilir.

### 2. Yerli ödəniş rekvizitlərindən istifadə etmək

Wise uyğun istifadəçilərə bəzi valyutalar üzrə yerli hesab məlumatları təqdim edir. Məsələn, USD üçün routing və account number, GBP üçün sort code və account number, EUR üçün isə IBAN istifadə oluna bilər. Bu rekvizitlər ayrıca bank hesabı deyil; Wise balansına ödəniş qəbul etməyin üsuludur.

Müştəri ödənişi öz ölkəsində yerli köçürmə kimi edə bildikdə proses SWIFT köçürməsindən daha sadə və bəzi hallarda daha sərfəli ola bilər. Lakin konkret komissiya və müddət valyuta, göndərmə üsulu və ölkədən asılıdır.

### 3. USD, EUR və GBP gəlirlərini ayrı idarə etmək

Müştəri USD ilə ödəyir, xərcləriniz isə EUR və ya AZN-dir. Birbaşa məcburi konvertasiya məzənnə itkisini artıra bilər. Çoxvalyutalı hesab uyğun olduqda gəliri həmin valyutada saxlamaq, sonra ehtiyac zamanı çevirmək və ya başqa hesaba göndərmək mümkün olur.

### 4. Müştəri üçün daha rahat ödəniş təcrübəsi yaratmaq

Peşəkarlıq yalnız işin keyfiyyəti deyil. Müqavilə, invoice, kommunikasiya və ödəniş mərhələsi birlikdə müştəri təcrübəsini yaradır. Aydın rekvizit, düzgün beneficiary adı və əvvəlcədən razılaşdırılmış valyuta müştərinin maliyyə komandasının işini asanlaşdırır.

### 5. Komissiyanı əvvəlcədən müqayisə etmək

Klassik beynəlxalq bank köçürməsində göndərən bank, müxbir bank və qəbul edən bank xərci yarana bilər. Wise-da da çevirmə, bəzi rekvizitlərin açılması və SWIFT qəbulu üzrə ödənişlər ola bilər. Üstünlük bütün hallarda avtomatik “ən ucuz” olmaq deyil; ödəniş göndərilməzdən əvvəl real marşrut və yekun məbləği müqayisə etmək imkanının olmasıdır.

### 6. Alternativ ödəniş kanalı saxlamaq

Bir platformada texniki yoxlama, limit və ya əlavə sənəd sorğusu yarana bilər. Buna görə peşəkar freelancer yalnız bir kanaldan asılı qalmır. Wise, Payoneer və uyğun bank köçürməsi kimi variantlardan ibarət ehtiyat planı ödənişin dayanması riskini azaldır.

## Wise freelancer üçün necə işləyə bilər?

Proses adətən belə görünür:

1. Hesab növü və qeydiyyat ölkəsi üzrə uyğunluq yoxlanılır.
2. Şəxsiyyət və tələb olunduqda fəaliyyət məlumatları təsdiqlənir.
3. Lazım olan valyuta seçilir və mövcuddursa hesab rekvizitləri açılır.
4. Rekvizitdəki ad invoice və müqavilədəki adla uyğunlaşdırılır.
5. Müştəriyə valyuta, rekvizit və ödəniş təyinatı göndərilir.
6. İlk böyük ödənişdən əvvəl kiçik test köçürməsi nəzərdən keçirilir.

[Wise-ın rəsmi məlumatına görə](https://wise.com/help/articles/2898124/how-do-i-receive-money-to-my-wise-account-details), hesab rekvizitləri uyğunluq şərtləri daxilində paylaşılaraq şəxslərdən və şirkətlərdən ödəniş qəbul etmək üçün istifadə olunur. Mövcud valyutalar və funksiyalar regiona görə dəyişə bilər.

## Personal, Business, yoxsa alternativ hesab?

| Variant | Daha çox kimə uyğundur? | Əsas diqqət nöqtəsi |
| --- | --- | --- |
| Wise Personal | Fərdi istifadə və şəxsi köçürmələr | Davamlı kommersiya gəlirinin hesab qaydalarına uyğunluğu |
| Wise Business | Şirkət və rəsmi biznes fəaliyyəti | Şirkət sənədləri, fəaliyyət və beneficial owner yoxlaması |
| Payoneer | Marketplace və platforma payout-ları alanlar | Mənbə platforması, komissiya və çıxarış üsulu |
| Bank/SWIFT | Birbaşa bank köçürməsinə üstünlük verənlər | Müxbir bank xərcləri, müddət və valyuta çevrilməsi |

Əgər ödəniş şirkət fəaliyyəti adından alınırsa, şəxsi və biznes əməliyyatlarını qarışdırmamaq daha düzgün yanaşmadır. Wise da biznes adından əməliyyatlar üçün Business hesabının tələb oluna biləcəyini bildirir.

## Wise hesabı olmadan da işləmək mümkündürmü?

Bəli. Wise vacib ödəniş vasitələrindən biridir, amma freelancer olmağın şərti deyil. Müştərinin ölkəsi, müqavilə forması, ödəniş məbləği və sizin hüquqi statusunuz başqa variantı daha uyğun edə bilər. Əsas məsələ aşağıdakı suallara əvvəlcədən cavab verməkdir:

- müştəri hansı valyuta və üsulla ödəyəcək;
- invoice hansı ad və hüquqi statusla veriləcək;
- ödənişi qəbul edən hesab həmin adla uyğun gəlirmi;
- bütün komissiyalar çıxıldıqdan sonra nə qədər məbləğ qalacaq;
- əlavə verifikasiya tələb olunarsa hansı ehtiyat kanal istifadə ediləcək.

## Hesab açmazdan əvvəl yoxlama siyahısı

- Yaşayış və ya şirkət qeydiyyatı ölkəniz üzrə funksiyaları yoxlayın.
- Personal və Business hesab arasından fəaliyyətinizə uyğun olanı seçin.
- Şəxsiyyət, ünvan və biznes sənədlərindəki məlumatları uyğunlaşdırın.
- Müştəridən gələcək ödənişin valyutasını və marşrutunu dəqiqləşdirin.
- Qəbul, çevirmə və çıxarış xərclərini birlikdə hesablayın.
- Hesab təsdiqlənmədən müştəriyə aktiv rekvizit vəd etməyin.
- Müqavilə, invoice və ödəniş qeydlərini saxlayın.

## Tez-tez verilən suallar

### Wise bank hesabıdırmı?

Wise-ın təqdim etdiyi valyuta rekvizitləri ayrıca bank hesabı deyil. Bunlar uyğun olduqda Wise hesabınıza ödəniş qəbul etməyə imkan verən hesab məlumatlarıdır.

### Azərbaycanda yaşayan hər freelancer Wise rekviziti ala bilərmi?

Xeyr, bunu avtomatik qəbul etmək olmaz. Əlçatanlıq qeydiyyat ünvanı, hesab növü, valyuta və Wise-ın cari uyğunluq qaydalarından asılıdır. Tətbiqdə “Get account details” seçiminin mövcudluğunu və tələbləri yoxlamaq lazımdır.

### Wise kartı Azərbaycanda sifariş etmək mümkündürmü?

Wise-ın cari rəsmi siyahısında Azərbaycan personal kartın təqdim olunduğu ölkələr arasında göstərilmir. Hesab rekvizitlərinin əlçatanlığı ilə kart əlçatanlığı eyni məsələ deyil.

### Xarici müştəri ödənişi üçün Personal hesab kifayətdirmi?

Bu, fəaliyyətin hüquqi statusundan və hesab qaydalarından asılıdır. Şirkət adından ödəniş alırsınızsa və ya biznes əməliyyatı aparırsınızsa, Wise Business və uyğun şirkət strukturu tələb oluna bilər.

### Wise yoxsa Payoneer daha yaxşıdır?

Universal cavab yoxdur. Müştərinin ödəniş üsulu, marketplace inteqrasiyası, valyuta, komissiya və çıxarış imkanları müqayisə edilməlidir. Bəzi freelancerlər hər ikisini ehtiyat kanal kimi saxlayır.

## Nəticə: itirilən əsas imkan hesab deyil, hazırlıqdır

Wise hesabı olmayan freelancerin qaçırdığı əsas üstünlük təkcə bir tətbiq deyil. Əsl itki müştəri ödənişə hazır olanda rekvizit təqdim edə bilməmək, valyuta və komissiyanı əvvəlcədən planlaşdırmamaq və alternativ kanal saxlamamaqdır.

Sapiens Pay uyğunluğunuzu, hesab növünü və sənəd hazırlığını qiymətləndirməyə kömək edə bilər. [Wise və xarici bank hesabı xidmətinə baxın](/az/services/foreign-bank-accounts) və ya vəziyyətinizə uyğun yol xəritəsi üçün konsultasiya göndərin.

[CTA: Pulsuz konsultasiya al | /az#consultation]`,
  },
  {
    translation_group_id: translationGroupId,
    locale: "ru",
    title: "Что теряет фрилансер без аккаунта Wise?",
    subtitle: "Почему скорость, доверие и гибкость валют важны при оплате от зарубежных клиентов",
    slug: "chto-teryaet-frilanser-bez-akkaunta-wise",
    excerpt: "Разбираем задержки, расходы и риски клиентского опыта, с которыми сталкивается фрилансер без Wise или другого подготовленного канала международных платежей.",
    seo_title: "Что теряет фрилансер без аккаунта Wise?",
    seo_description: "Что теряет фрилансер без Wise: реквизиты USD/EUR/GBP, сроки, комиссии и доверие клиента. Сравните Wise, Payoneer и банковский перевод.",
    category: "Платежи фрилансерам",
    focus_keyword: "Wise для фрилансера",
    secondary_keywords: ["получать оплату из-за границы", "Wise фрилансер", "международные платежи", "способы оплаты фрилансеру"],
    tags: ["Wise", "фрилансер", "международные платежи", "мультивалютный счет", "Payoneer"],
    featured_image_alt: "Фрилансер получает международные платежи в разных валютах за ноутбуком",
    content: `Найти зарубежного клиента — только половина задачи. Не менее важно **вовремя, безопасно и удобно для заказчика получить оплату**. Если после сообщения “Please send your payment details” вы только начинаете искать платежный сервис, выплата и продолжение сотрудничества могут оказаться под угрозой.

Wise — не единственный вариант. Но если функции доступны для вашей страны и типа аккаунта, реквизиты в USD, EUR или GBP могут упростить прием международных платежей. Цель — не зависеть от одной платформы, а заранее создать понятную и подтверждаемую платежную систему.

> [!INFO] Возможности Wise зависят от страны проживания или регистрации бизнеса, типа аккаунта и валюты. Перед регистрацией проверьте доступность реквизитов непосредственно в Wise.

## 6 возможностей, которые может терять фрилансер без Wise

### 1. Мгновенно отправить клиенту платежные реквизиты

Когда проект сдан и invoice согласован, несколько дней поиска счета могут перенести выплату на следующий платежный цикл. Подготовленные реквизиты можно отправить вместе с invoice без лишней паузы.

### 2. Использовать локальные реквизиты

Для подходящих пользователей Wise предоставляет локальные реквизиты в отдельных валютах: например, routing и account number для USD, sort code и account number для GBP, IBAN для EUR. Это не отдельные банковские счета, а способ получить деньги на баланс Wise.

Локальный перевод может быть проще и в некоторых случаях дешевле SWIFT. Фактические комиссии и сроки зависят от валюты, маршрута и страны.

### 3. Раздельно управлять доходами в USD, EUR и GBP

Если клиент платит в USD, а расходы возникают в EUR или другой валюте, немедленная обязательная конвертация может увеличить потери на курсе. Мультивалютный баланс, когда он доступен, позволяет выбрать момент обмена или отправить средства на другой счет.

### 4. Сделать оплату удобнее для клиента

Профессионализм включает не только качество работы, но и договор, invoice, коммуникацию и оплату. Понятные реквизиты, корректное имя получателя и заранее согласованная валюта упрощают работу финансовой команды клиента.

### 5. Заранее сравнить расходы

В международном банковском переводе могут участвовать банк отправителя, банки-корреспонденты и банк получателя. В Wise также возможны комиссии за конвертацию, открытие некоторых реквизитов и прием SWIFT. Важно не обещание “всегда дешевле”, а расчет конкретного маршрута и итоговой суммы до отправки.

### 6. Иметь резервный платежный канал

Любая платформа может запросить документы, установить лимит или временно проверять операцию. Поэтому опытные фрилансеры не зависят от одного решения и держат резерв: Wise, Payoneer или подходящий банковский перевод.

## Как Wise может работать для фрилансера

1. Проверяется доступность для страны и нужного типа аккаунта.
2. Подтверждается личность и, если требуется, деятельность.
3. Выбирается валюта и открываются доступные реквизиты.
4. Имя в реквизитах сопоставляется с договором и invoice.
5. Клиенту отправляются валюта, реквизиты и назначение платежа.
6. Перед крупной первой выплатой рассматривается тестовый перевод.

[По официальной справке Wise](https://wise.com/help/articles/2898124/how-do-i-receive-money-to-my-wise-account-details), доступные реквизиты можно передать человеку или компании для получения платежа. Набор валют и функций зависит от региона.

## Personal, Business или альтернативный счет?

| Вариант | Кому чаще подходит | Что проверить |
| --- | --- | --- |
| Wise Personal | Личные переводы и индивидуальное использование | Соответствует ли коммерческий доход правилам аккаунта |
| Wise Business | Компании и официальная бизнес-деятельность | Документы компании, деятельность и владельцы |
| Payoneer | Получатели выплат от платформ и маркетплейсов | Источник выплаты, комиссии и вывод средств |
| Банк/SWIFT | Те, кому нужен прямой банковский перевод | Банки-корреспонденты, сроки и конвертация |

Если платеж принимается от имени компании, личные и бизнес-операции лучше не смешивать. Для операций от имени бизнеса Wise может требовать Business аккаунт.

## Можно ли работать без Wise?

Да. Wise — один из инструментов, а не обязательное условие работы. Другой вариант может лучше подходить под страну клиента, договор, сумму и ваш юридический статус. До начала проекта ответьте на вопросы:

- в какой валюте и каким способом заплатит клиент;
- на чье имя будет выставлен invoice;
- совпадает ли имя получателя с договором;
- какая сумма останется после всех комиссий;
- какой резервный канал использовать при дополнительной проверке.

## Чек-лист перед открытием аккаунта

- Проверьте функции для страны проживания или регистрации компании.
- Выберите Personal или Business в соответствии с деятельностью.
- Сверьте данные в удостоверении личности, адресе и документах бизнеса.
- Уточните валюту и маршрут будущего платежа.
- Рассчитайте прием, конвертацию и вывод вместе.
- Не обещайте клиенту реквизиты до их активации.
- Храните договоры, invoices и подтверждения платежей.

## Частые вопросы

### Wise — это банковский счет?

Валютные реквизиты Wise не являются отдельными банковскими счетами. Это реквизиты для приема денег на баланс Wise, если функция доступна пользователю.

### Каждый ли фрилансер из стран СНГ может получить реквизиты Wise?

Нет. Доступность зависит от зарегистрированного адреса, типа аккаунта, валюты и текущих правил Wise. Нужно проверить наличие функции “Get account details” и требования в своем аккаунте.

### Можно ли заказать карту Wise в Азербайджане?

В актуальном официальном списке Wise Азербайджан не указан среди стран, где выдается personal card. Доступность реквизитов и карты — разные вещи.

### Достаточно ли Personal аккаунта для оплаты от клиента?

Это зависит от юридического статуса деятельности и правил аккаунта. Для оплаты в адрес компании или бизнес-операций может потребоваться Wise Business и подходящая структура.

### Что лучше: Wise или Payoneer?

Универсального ответа нет. Сравните способ оплаты клиента, интеграции с платформами, валюту, комиссии и вывод. Иногда разумно держать оба сервиса как основные или резервные каналы.

## Вывод: главная потеря — не аккаунт, а неподготовленность

Главный риск — не отсутствие конкретного приложения, а неспособность дать реквизиты, когда клиент готов платить, отсутствие расчета комиссий и резервного канала.

Sapiens Pay поможет оценить доступность, выбрать тип аккаунта и подготовить документы. [Посмотрите услугу Wise и зарубежного банковского счета](/ru/services/foreign-bank-accounts) или отправьте заявку на консультацию.

[CTA: Получить бесплатную консультацию | /ru#consultation]`,
  },
].map((post) => ({
  ...post,
  cover_image_url: coverImage,
  og_image_url: coverImage,
  canonical_url: `https://sapiens-pay.com/${post.locale}/blog/${post.slug}`,
  og_title: post.title,
  og_description: post.seo_description,
  author: "Sapiens Pay",
  status: "published",
  published_at: publishedAt,
  scheduled_at: null,
  is_featured: false,
  robots_index: true,
  include_in_sitemap: true,
}));

const response = await fetch(`${url}/rest/v1/posts?on_conflict=locale,slug`, {
  method: "POST",
  headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
  body: JSON.stringify(posts),
});

if (!response.ok) throw new Error(`Supabase upsert ${response.status}: ${await response.text()}`);
const saved = await response.json();
if (saved.length !== posts.length) throw new Error(`Expected ${posts.length} posts, received ${saved.length}.`);

console.log(`Published ${saved.length} Wise freelancer articles.`);
for (const post of saved) console.log(`- https://sapiens-pay.com/${post.locale}/blog/${post.slug}`);
