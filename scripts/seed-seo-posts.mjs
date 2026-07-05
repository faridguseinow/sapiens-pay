import { readFile } from "node:fs/promises";

const envText = await readFile(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(
  envText.split(/\r?\n/).filter((line) => line && !line.startsWith("#")).map((line) => {
    const index = line.indexOf("=");
    return [line.slice(0, index), line.slice(index + 1)];
  }),
);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase server credentials are missing.");

const posts = [
  {
    locale: "az",
    title: "Azərbaycandan xarici bank hesabı açmaq: Wise və Payoneer seçimi",
    slug: "azerbaycandan-xarici-bank-hesabi-acmaq",
    excerpt: "Wise Personal, Wise Business və Payoneer Business hesablarının fərqləri, tələb olunan sənədlər və düzgün seçim üçün praktik bələdçi.",
    seo_title: "Azərbaycandan xarici bank hesabı açmaq | 2026 bələdçisi",
    seo_description: "Wise Personal, Wise Business və Payoneer Business hesablarını müqayisə edin. Sənədlər, uyğunluq və hesab açılışı prosesini öyrənin.",
    category: "Xarici bank hesabları",
    content: `Xarici müştərilərdən ödəniş almaq, marketplace gəlirlərini idarə etmək və beynəlxalq əməliyyatları rahatlaşdırmaq istəyən bizneslər üçün xarici bank hesabı mühüm infrastruktur elementidir. Ancaq hesab seçimi yalnız qiymətə görə edilməməlidir. Fəaliyyət modeli, şirkətin qeydiyyat ölkəsi, dövriyyə və ödəniş mənbələri birlikdə qiymətləndirilməlidir.

## Xarici bank hesabı kimə lazımdır?

Xarici hesab aşağıdakı hallarda faydalı ola bilər:

- beynəlxalq müştərilərdən USD və EUR ilə ödəniş qəbul edirsiniz;
- Shopify, marketplace və ya rəqəmsal xidmət biznesiniz var;
- xarici şirkətinizin əməliyyat hesabına ehtiyacınız var;
- ödəniş provayderindən payout almaq istəyirsiniz;
- şəxsi beynəlxalq köçürmələri daha rahat idarə etmək istəyirsiniz.

Hesabın məqsədi əvvəlcədən aydın olmalıdır. Şəxsi hesabdan biznes əməliyyatları aparmaq platformanın qaydalarına zidd ola və əlavə yoxlamaya səbəb ola bilər.

## Wise Personal və Wise Business fərqi

**Wise Personal** şəxsi köçürmələr və fərdi maliyyə ehtiyacları üçün nəzərdə tutulur. Şirkət fəaliyyəti və kommersiya ödənişləri üçün isə adətən **Wise Business** daha uyğun seçimdir.

Wise Business müraciətində şirkətin qeydiyyat sənədləri, təsisçi məlumatları, fəaliyyət təsviri, sayt və gözlənilən əməliyyatlar tələb oluna bilər. Yekun təsdiq həmişə Wise-ın uyğunluq və risk qiymətləndirməsindən asılıdır.

## Payoneer Business nə zaman uyğundur?

Payoneer Business marketplace, xidmət ixracı və beynəlxalq şirkətlərdən ödəniş alma ssenarilərində istifadə olunur. Müraciət zamanı şirkət məlumatları, sayt və ya fəaliyyət sübutu, müqavilə və hesab-faktura kimi əlavə sənədlər istənə bilər.

Wise və Payoneer bir-birinin tam əvəzi deyil. Seçim gəlirin haradan gəldiyinə və vəsaitin necə istifadə ediləcəyinə əsaslanmalıdır.

## Hesab açılışı üçün hansı sənədlər lazımdır?

Şəxsi hesab üçün adətən şəxsiyyət sənədi, ünvan təsdiqi və telefon nömrəsi tələb olunur. Biznes hesabında isə bunlara əlavə olaraq:

- şirkətin qeydiyyat sənədi;
- təsisçi və direktor məlumatları;
- hüquqi ünvan;
- fəaliyyət göstərən sayt və ya biznes profili;
- gəlir mənbəyini izah edən sənədlər tələb oluna bilər.

Sənədlərdə ad, ünvan və şirkət məlumatlarının bir-biri ilə uyğunluğu vacibdir.

## Ən çox edilən səhvlər

- uyğun olmayan hesab növünü seçmək;
- fəaliyyət sahəsini natamam izah etmək;
- fərqli sənədlərdə ziddiyyətli ünvan göstərmək;
- işləməyən və ya məlumatı az olan sayt təqdim etmək;
- hesab təsdiqlənmədən böyük ödəniş planlaşdırmaq.

Hesabın açılması avtomatik təsdiq demək deyil. Maliyyə platformaları əlavə məlumat istəyə və ya müraciəti qəbul etməyə bilər.

## Düzgün seçim necə edilir?

Əvvəlcə şəxsi və ya biznes hesabına ehtiyacınız olduğunu müəyyənləşdirin. Daha sonra ödəniş mənbələrini, valyutaları, aylıq dövriyyəni və payout platformalarını siyahıya alın. Bu məlumatlara əsasən uyğun həll seçmək daha təhlükəsizdir.

[Xarici bank hesablarının açılması xidməti](/az/services/foreign-bank-accounts) səhifəsində Wise Personal, Wise Business və Payoneer Business paketlərini müqayisə edə bilərsiniz.

## Nəticə

Doğru xarici hesab beynəlxalq biznesin maliyyə axınını sadələşdirə bilər. Lakin hesab növü və sənədlər fəaliyyətinizə uyğun hazırlanmalıdır. [Konsultasiya üçün müraciət edin](/az#consultation), komanda biznes modelinizə uyğun istiqaməti müəyyənləşdirsin.`,
  },
  {
    locale: "az",
    title: "Shopify Payments quraşdırılması: şirkətli və şirkətsiz model",
    slug: "shopify-payments-qurasdirilmasi",
    excerpt: "Shopify Payments aktivləşməsi, şirkətsiz və şirkət üzərindən quraşdırma modelləri, payout hesabı və verifikasiya tələbləri.",
    seo_title: "Shopify Payments quraşdırılması: tam bələdçi",
    seo_description: "Shopify Payments necə aktivləşdirilir? Şirkətli və şirkətsiz modelləri, payout hesabını, sənədləri və əsas uyğunluq tələblərini öyrənin.",
    category: "Shopify Payments",
    content: `Shopify mağazasında rahat checkout təcrübəsi satış nəticəsinə birbaşa təsir edir. Shopify Payments dəstəklənən bazarlarda kart ödənişlərini mağazanın idarəetmə panelindən qəbul etməyə imkan verir. Aktivləşmə üçün ölkə, biznes kateqoriyası, hesab sahibi və bank məlumatları platformanın tələblərinə uyğun olmalıdır.

## Shopify Payments nədir?

Shopify Payments Shopify-ın inteqrasiya olunmuş ödəniş həllidir. Ayrı payment gateway idarəetməsini azaltmağa, ödəniş və payout məlumatlarını eyni paneldə izləməyə kömək edir.

Xidmət hər ölkədə mövcud deyil. Mağaza sahibinin və biznesin məlumatları seçilən dəstəklənən ölkə ilə real və sənədlə təsdiqlənən əlaqəyə malik olmalıdır.

## Şirkətsiz quraşdırma modeli

Şirkətsiz model fərdi məlumatlarla uyğun struktur qurulmasına əsaslanır. Bu yanaşma daha kiçik əməliyyatlar və ilkin mərhələdə olan mağazalar üçün nəzərdən keçirilə bilər.

Sapiens Pay bu modeli təxminən aylıq 4–5 min dollaradək planlanan dövriyyə üçün praktik əməliyyat diapazonu kimi qiymətləndirir. Bu rəqəm Shopify tərəfindən müəyyən edilmiş rəsmi limit deyil.

Şirkətsiz quraşdırmada şəxsiyyət və ünvan məlumatları, mağazanın siyasət səhifələri, məhsullar və payout üçün uyğun xarici bank hesabı birlikdə yoxlanmalıdır.

## Şirkət üzərindən biznes modeli

Böyüyən mağazalar üçün şirkət üzərindən quraşdırma daha strukturlaşdırılmış yanaşmadır. Bu halda şirkətin qeydiyyat sənədləri, təsisçi məlumatları, hüquqi ünvan və biznes hesabı tələb oluna bilər.

Şirkət modeli böyük dövriyyəyə avtomatik zəmanət vermir. Shopify və maliyyə tərəfdaşları məhsul kateqoriyasını, chargeback riskini və sənədlərin uyğunluğunu ayrıca qiymətləndirirlər.

## Aktivləşmədən əvvəl mağaza auditi

Müraciətdən əvvəl bunlar hazırlanmalıdır:

- əlaqə, çatdırılma və geri qaytarma siyasəti;
- aydın məhsul təsvirləri və real qiymətlər;
- işlək domen və əlaqə məlumatları;
- qadağan olunmayan məhsul kateqoriyası;
- şirkət və ya hesab sahibi məlumatları ilə uyğun mağaza məlumatları.

Natamam siyasət səhifələri və qeyri-müəyyən məhsul təsvirləri əlavə yoxlamaya səbəb ola bilər.

## Payout hesabı necə seçilir?

Payout hesabının ölkəsi, valyutası və hesab sahibinin adı Shopify Payments məlumatları ilə uyğun olmalıdır. Şirkət üzərindən müraciətdə şəxsi hesab əvəzinə biznes hesabı tələb oluna bilər.

[Xarici bank hesabı seçimləri](/az/services/foreign-bank-accounts) ilə Shopify payout strukturunu birlikdə planlaşdırmaq daha düzgündür.

## Verifikasiya zamanı nə baş verir?

Platforma şəxsiyyət sənədi, ünvan təsdiqi, şirkət sənədləri və biznes fəaliyyəti haqqında əlavə məlumat istəyə bilər. Sorğular vaxtında və ziddiyyətsiz cavablandırılmalıdır.

## Hansı model sizə uyğundur?

Yeni başlayan və məhdud dövriyyə planlayan mağaza şirkətsiz modeli nəzərdən keçirə bilər. Komanda, reklam büdcəsi və əməliyyat həcmi artdıqca şirkət üzərindən biznes modeli daha uyğun ola bilər.

[Shopify Payments quraşdırılması paketlərinə baxın](/az/services/shopify-payments) və ya [uyğun model üçün müraciət edin](/az#consultation).`,
  },
  {
    locale: "az",
    title: "Xaricdə şirkət açmaq: ölkə, sənədlər və bank hesabı seçimi",
    slug: "xaricde-sirket-acmaq",
    excerpt: "Xarici şirkət qeydiyyatında ölkə seçimi, hüquqi ünvan, vergi öhdəlikləri, bank hesabı və ödəniş sistemləri üzrə əsas addımlar.",
    seo_title: "Xaricdə şirkət açmaq: mərhələlər və sənədlər",
    seo_description: "Xarici şirkət açmaq üçün ölkə seçimi, tələb olunan sənədlər, hüquqi ünvan, vergi, bank hesabı və ödəniş sistemləri barədə bələdçi.",
    category: "Xarici şirkət",
    content: `Xaricdə şirkət açmaq beynəlxalq müştərilərlə müqavilə bağlamaq, ödəniş sistemlərinə çıxış əldə etmək və biznesi qlobal bazara çıxarmaq üçün istifadə olunan addımlardan biridir. Ancaq yalnız sürətli qeydiyyata fokuslanmaq düzgün deyil. Ölkə, şirkət tipi, vergi öhdəlikləri və bank infrastrukturu birlikdə planlaşdırılmalıdır.

## Xarici şirkət kimə lazımdır?

- beynəlxalq e-commerce fəaliyyəti quranlara;
- proqram təminatı və rəqəmsal xidmət satanlara;
- xarici müştərilərlə korporativ müqavilə bağlayanlara;
- Shopify Payments, Stripe və digər provayderlər üçün uyğun struktur axtaranlara;
- xarici bank hesabına biznes adı ilə ehtiyacı olanlara.

Şirkət açmaq hər biznes üçün məcburi deyil. Gəlir modeli və hədəf bazar əvvəlcədən təhlil olunmalıdır.

## Ölkə seçərkən nələrə baxmaq lazımdır?

Qeydiyyat qiyməti tək meyar olmamalıdır. Aşağıdakılar müqayisə edilməlidir:

- şirkətin illik hesabat və yenilənmə tələbləri;
- vergi rezidentliyi və sahibkarın yaşadığı ölkədə öhdəlikləri;
- bank hesabı və payment provider imkanları;
- hüquqi ünvan və nümayəndə tələbi;
- fəaliyyət sahəsinə tətbiq olunan məhdudiyyətlər;
- müştərilərin və tərəfdaşların yerləşdiyi bazarlar.

ABŞ və Böyük Britaniya onlayn bizneslər üçün tez-tez nəzərdən keçirilir, lakin hər model üçün eyni dərəcədə uyğun deyil.

## Qeydiyyat üçün tələb olunan məlumatlar

Adətən təsisçinin şəxsiyyət sənədi, ünvanı, şirkət adı, fəaliyyət təsviri, pay bölgüsü və direktor məlumatları tələb olunur. Bəzi yurisdiksiyalarda əlavə uyğunluq yoxlaması aparılır.

Şirkət adı seçilərkən mövcud brendlərlə qarışıqlıq yaratmamasına və yerli adlandırma qaydalarına uyğunluğuna baxılır.

## Şirkət açıldıqdan sonra iş bitirmi?

Xeyr. Qeydiyyatdan sonra aşağıdakı məsələlər qalır:

- vergi və illik hesabat təqvimi;
- hüquqi ünvanın saxlanması;
- biznes bank hesabı;
- müqavilə və invoice məlumatları;
- ödəniş sistemlərinin quraşdırılması;
- məlumat dəyişikliklərinin reyestrdə yenilənməsi.

Bu öhdəliklər nəzərə alınmadıqda şirkət aktiv olsa belə bank və ödəniş proseslərində problem yarana bilər.

## Xarici şirkət və bank hesabı

Şirkətin olması bank hesabının avtomatik təsdiqlənməsi demək deyil. Bank və maliyyə platforması ayrıca fəaliyyət sahəsini, təsisçiləri, saytın keyfiyyətini və gəlir mənbələrini yoxlayır.

[Xarici bank hesablarının açılması](/az/services/foreign-bank-accounts) şirkət qeydiyyatı ilə paralel planlaşdırıldıqda sənədlər daha düzgün hazırlanır.

## Ödəniş sistemləri ilə əlaqə

Stripe, PayPal və Shopify Payments kimi sistemlər şirkətin qeydiyyat ölkəsini, biznes ünvanını, bank hesabını və məhsul kateqoriyasını yoxlaya bilər. Şirkəti yalnız bir platforma üçün formal şəkildə açmaq əvəzinə davamlı əməliyyat modeli qurmaq lazımdır.

## Nəticə

Xarici şirkət qeydiyyatı ölkə seçimindən daha geniş prosesdir. Qeydiyyat, hesabat, bank və ödəniş infrastrukturu vahid plan daxilində qurulmalıdır.

[Xarici şirkət açılması xidməti haqqında ətraflı oxuyun](/az/services/company-formation) və biznes modeliniz üçün [konsultasiya alın](/az#consultation).`,
  },
  {
    locale: "az",
    title: "Stripe və PayPal qoşulması: beynəlxalq ödəniş qəbulu bələdçisi",
    slug: "stripe-paypal-beynelxalq-odenis-qebulu",
    excerpt: "Stripe, PayPal və alternativ ödəniş sistemlərinin seçilməsi, şirkət və bank tələbləri, verifikasiya və checkout hazırlığı.",
    seo_title: "Stripe və PayPal qoşulması | Ödəniş qəbulu",
    seo_description: "Stripe və PayPal ilə beynəlxalq ödəniş qəbulu üçün şirkət, bank hesabı, sayt, verifikasiya və uyğunluq tələblərini öyrənin.",
    category: "Beynəlxalq ödənişlər",
    content: `Beynəlxalq müştəridən kartla ödəniş almaq üçün yalnız sayt hazırlamaq kifayət deyil. Payment provider, şirkət strukturu, bank hesabı, checkout və hüquqi səhifələr bir-biri ilə uyğun olmalıdır. Stripe və PayPal populyar seçimlərdir, lakin hər biznes üçün eyni həll deyil.

## Stripe və PayPal arasında əsas fərq

Stripe sayt və tətbiqlərə geniş texniki inteqrasiya imkanları təqdim edir. Kart ödənişi, abunə, invoice və müxtəlif checkout ssenariləri üçün istifadə olunur.

PayPal isə müştərinin tanıdığı ayrıca hesab və checkout təcrübəsi ilə seçilir. Bəzi bazarlarda alıcının PayPal balansı və ya bağlı kartı ilə ödəniş etməsinə imkan verir.

Seçim müştərilərin yerləşdiyi ölkələrə, məhsul modelinə, platformaya və payout ehtiyacına əsaslanmalıdır.

## Qoşulma üçün əsas tələblər

Provayderdən asılı olaraq bunlar tələb oluna bilər:

- dəstəklənən ölkədə real şirkət və ya fərdi sahibkarlıq;
- şirkət adına uyğun bank hesabı;
- təsisçi və direktorların şəxsiyyət yoxlaması;
- işlək sayt, məhsul və qiymət məlumatları;
- məxfilik, istifadə, çatdırılma və geri qaytarma səhifələri;
- fəaliyyət və gəlir mənbəyini təsdiqləyən sənədlər.

Məlumatların hamısı bir-biri ilə uyğun olmalıdır. Şirkət adı, domen, invoice və bank hesabında fərqli məlumatlar əlavə yoxlamaya səbəb ola bilər.

## Saytın checkout-a hazırlanması

Ödəniş sistemi qoşulmazdan əvvəl sayt müştəriyə kimdən və nə aldığını aydın göstərməlidir. Məhsul təsviri, qiymət, çatdırılma müddəti, geri qaytarma şərtləri və əlaqə məlumatları görünən olmalıdır.

Abunə modelində təkrarlanan ödənişin məbləği və ləğv qaydası ayrıca izah edilməlidir.

## Bank hesabı və payout

Ödənişdən sonra vəsait uyğun bank hesabına köçürülür. Bank hesabının valyutası və hesab sahibinin adı payment provider məlumatları ilə uyğun seçilməlidir.

[Biznes üçün xarici bank hesabı](/az/services/foreign-bank-accounts) payout strukturunun əsas hissəsidir. Şirkət tələb olunan modeldə [xarici şirkət qeydiyyatı](/az/services/company-formation) da əvvəlcədən planlaşdırılmalıdır.

## Risk və verifikasiya

Provayderlər yeni hesabı və sonrakı əməliyyatları davamlı yoxlaya bilər. Dövriyyənin sürətli artması, yüksək refund və chargeback faizi, qeyri-aydın məhsullar və sənədlərdə uyğunsuzluq əlavə yoxlama yarada bilər.

Heç bir xidmət provayder təsdiqinə zəmanət verə bilməz. Yekun qərar platformanın uyğunluq və risk komandası tərəfindən verilir.

## Alternativ ödəniş sistemləri

Stripe və PayPal uyğun olmadıqda biznes ölkəsinə və müştəri bazasına görə başqa gateway və lokal payment provider-lər nəzərdən keçirilə bilər. Əsas məqsəd yalnız hesab açmaq deyil, davamlı checkout və payout axını qurmaqdır.

## Nəticə

Beynəlxalq ödəniş qəbulu texniki inteqrasiya ilə hüquqi və maliyyə strukturunun birləşməsidir. Düzgün hazırlıq verifikasiya prosesini daha aydın və idarəolunan edir.

[Beynəlxalq ödəniş sistemlərinin qoşulması xidməti](/az/services/international-payments) haqqında məlumat alın və ya [biznesiniz üçün müraciət edin](/az#consultation).`,
  },
].map((post) => ({
  ...post,
  status: "published",
  published_at: new Date().toISOString(),
  scheduled_at: null,
}));

const response = await fetch(`${url}/rest/v1/posts?on_conflict=locale,slug`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify(posts),
});
if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
const saved = await response.json();
console.log(`Published ${saved.length} SEO posts.`);
for (const post of saved) console.log(`- /${post.locale}/blog/${post.slug}`);
