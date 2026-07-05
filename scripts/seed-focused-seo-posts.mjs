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

const posts = [
  {
    title: "Azərbaycanda Wise Personal hesabı necə açılır?",
    slug: "wise-personal-hesabi-acmaq",
    excerpt:
      "Wise Personal hesabının kimlər üçün uyğun olduğu, sənədlər, verifikasiya və şəxsi hesabdan düzgün istifadə haqqında praktik bələdçi.",
    seo_title: "Azərbaycanda Wise Personal hesabı necə açılır?",
    seo_description:
      "Wise Personal hesabı üçün tələb olunan sənədləri, verifikasiya mərhələlərini və şəxsi hesabdan düzgün istifadə qaydalarını öyrənin.",
    category: "Wise Personal",
    content: `Azərbaycanda Wise Personal hesabı açmaq istəyən istifadəçilər ilk növbədə cari ölkə uyğunluğunu və tələb olunan funksiyaların əlçatanlığını yoxlamalıdırlar. Wise Personal şəxsi beynəlxalq köçürmələri və müxtəlif valyutalarda fərdi maliyyə əməliyyatlarını idarə etmək üçün nəzərdə tutulur. Hesabın məqsədi şəxsi istifadədir; şirkət gəlirlərini və davamlı kommersiya ödənişlərini şəxsi hesab üzərindən aparmaq uyğun deyil.

## Wise Personal kimə uyğundur?

Bu hesab xaricdə yaşayan ailə üzvlərinə vəsait göndərən, şəxsi xərclərini müxtəlif valyutalarda idarə edən və beynəlxalq köçürmələr alan şəxslər üçün uyğun ola bilər. Müraciətdən əvvəl xidmətin yaşadığınız ölkədə mövcudluğu və tələb olunan funksiyaların dəstəklənməsi yoxlanmalıdır.

## Hansı sənədlər tələb oluna bilər?

Adətən etibarlı şəxsiyyət sənədi, yaşayış ünvanı, telefon nömrəsi və e-poçt tələb olunur. Platforma ünvan təsdiqi, vəsaitin mənbəyi və planlanan əməliyyatlar barədə əlavə məlumat da istəyə bilər. Sənədlərdəki ad və ünvan məlumatlarının müraciətdəki məlumatlarla eyni olması vacibdir.

## Verifikasiya prosesi

Şəxsiyyət yoxlaması zamanı sənədin aydın fotosu və üz təsdiqi tələb oluna bilər. Keyfiyyətsiz foto, vaxtı bitmiş sənəd və ziddiyyətli məlumat prosesi uzadır. Əlavə sorğu gəldikdə məlumatı tam və dürüst təqdim etmək lazımdır.

## Şəxsi hesabın düzgün istifadəsi

Wise Personal biznes hesabının əvəzi deyil. Müştərilərdən kommersiya ödənişləri almaq və şirkət əməliyyatlarını idarə etmək üçün ayrıca biznes strukturu tələb oluna bilər. Hesabın açılması və funksiyaların aktivləşməsi Wise-ın uyğunluq qiymətləndirməsindən asılıdır.

## Müraciətdən əvvəl yoxlama

- şəxsiyyət sənədiniz qüvvədə olmalıdır;
- ünvan məlumatı bütün sənədlərdə uyğun olmalıdır;
- hesabın istifadə məqsədi aydın olmalıdır;
- yalnız özünüzə aid real məlumatlardan istifadə edilməlidir.

[Wise Personal paketinin detalları və qiyməti](/az/services/foreign-bank-accounts) xidmət səhifəsində göstərilib. Uyğunluğunuzu əvvəlcədən yoxlamaq üçün [müraciət göndərin](/az#consultation).`,
  },
  {
    title: "Azərbaycandan Wise Business hesabı necə açılır?",
    slug: "wise-business-hesabi-acmaq",
    excerpt:
      "Wise Business hesabı üçün şirkət, korporativ sənədlər, fəaliyyət sübutu və verifikasiya prosesinə dair ayrıca bələdçi.",
    seo_title: "Azərbaycandan Wise Business hesabı necə açılır?",
    seo_description:
      "Wise Business hesabı üçün şirkət və sənəd tələblərini, verifikasiya prosesini və biznes hesabının hazırlanmasını öyrənin.",
    category: "Wise Business",
    content: `Azərbaycandan Wise Business hesabı açmaq istəyən sahibkarlar üçün əsas məsələ uyğun şirkət və təsdiqlənə bilən biznes strukturu qurmaqdır. Wise Business xarici müştərilərdən ödəniş alan və beynəlxalq əməliyyatlarını şirkət adı ilə idarə etmək istəyən bizneslər üçün nəzərdə tutulur. Bu hesab üçün aktiv, rəsmi qeydiyyatdan keçmiş şirkət və şirkətə aid real məlumatlar tələb olunur.

## Wise Business kimə uyğundur?

Rəqəmsal xidmət, e-commerce, agentlik, proqram təminatı və digər beynəlxalq fəaliyyət göstərən şirkətlər biznes hesabını nəzərdən keçirə bilər. Hesabın uyğunluğu şirkətin qeydiyyat ölkəsi, fəaliyyət sahəsi, təsisçiləri və gözlənilən əməliyyatlara əsasən qiymətləndirilir.

## Tələb olunan sənədlər

Müraciətdə şirkətin qeydiyyat sənədi, hüquqi ünvanı, direktor və təsisçi məlumatları, pay bölgüsü və fəaliyyət təsviri istənə bilər. Sayt, müqavilə, invoice və gəlir mənbəyini göstərən sənədlər biznesin real fəaliyyətini izah etməyə kömək edir.

## Sayt və biznes profili

İşlək sayt şirkətin nə satdığını, kimə xidmət göstərdiyini və necə əlaqə saxlanıldığını aydın göstərməlidir. Domen, şirkət adı, əlaqə məlumatları və hüquqi səhifələr bir-biri ilə uyğun olmalıdır. Natamam və ya ziddiyyətli təqdimat əlavə yoxlama yarada bilər.

## Verifikasiya və hesabın aktivləşməsi

Platforma şirkət və təsisçilər üzrə əlavə uyğunluq yoxlaması apara bilər. Böyük əməliyyatlar, yeni fəaliyyət modeli və ya qeyri-aydın ödəniş mənbələri üçün əlavə sənəd tələb oluna bilər. Heç bir vasitəçi hesabın təsdiqinə zəmanət verə bilməz.

## Hazırlıq siyahısı

- aktiv və rəsmi şirkət;
- qüvvədə olan korporativ sənədlər;
- şirkətin fəaliyyətini izah edən sayt;
- təsisçi və direktorların şəxsiyyət sənədləri;
- gözlənilən dövriyyə və ödəniş mənbələrinin izahı.

[Wise Business xidmət paketinə baxın](/az/services/foreign-bank-accounts). Şirkətiniz hələ yoxdursa, əvvəlcə [xarici şirkət açılması](/az/services/company-formation) prosesini planlaşdıra bilərsiniz.`,
  },
  {
    title: "Azərbaycanda Payoneer Business hesabı necə açılır?",
    slug: "payoneer-business-hesabi-acmaq",
    excerpt:
      "Payoneer Business hesabının istifadə sahələri, şirkət sənədləri, marketplace ödənişləri və biznes verifikasiyası haqqında məlumat.",
    seo_title: "Azərbaycanda Payoneer Business hesabı necə açılır?",
    seo_description:
      "Payoneer Business hesabı üçün şirkət sənədləri, marketplace və xidmət ödənişləri, verifikasiya və payout prosesini öyrənin.",
    category: "Payoneer Business",
    content: `Azərbaycanda Payoneer Business hesabı açmaq xarici marketplace və müştərilərdən şirkət adına ödəniş alan bizneslərin araşdırdığı mövzulardandır. Payoneer Business marketplace gəlirlərini, xidmət ixracından daxilolmaları və beynəlxalq şirkətlərdən biznes ödənişlərini idarə etmək üçün istifadə olunur. Hesab şirkət fəaliyyəti üçün açılır və müraciətdə real biznes məlumatları tələb olunur.

## Payoneer Business kimlər üçündür?

Marketplace satıcıları, agentliklər, freelancer komandaları, e-commerce şirkətləri və xarici tərəfdaşlardan ödəniş alan bizneslər bu hesabı nəzərdən keçirə bilər. Hesabın funksiyaları fəaliyyət növünə və qeydiyyat ölkəsinə görə fərqlənə bilər.

## Şirkət və sənəd tələbləri

Payoneer Business üçün aktiv şirkətin qeydiyyat sənədləri, hüquqi ünvan, təsisçi və direktor məlumatları tələb oluna bilər. Platforma əlavə olaraq sayt, marketplace profili, müqavilə, invoice və ödəniş əlaqəsini izah edən sənədlər istəyə bilər.

## Marketplace və xidmət ödənişləri

Müraciətdə gəlirin hansı platformadan və ya müştəridən daxil olacağı düzgün göstərilməlidir. Marketplace mağazasının adı, şirkət adı və hesab sahibinin məlumatları arasında uyğunsuzluq yoxlamanı çətinləşdirə bilər.

## Verifikasiya zamanı diqqət ediləcək məqamlar

Sənədlər oxunaqlı, aktual və bir-biri ilə uyğun olmalıdır. Biznes modeli qısa, konkret və real şəkildə izah edilməlidir. Gəlir mənbəyi dəyişdikdə platforma yeni sənədlər tələb edə bilər.

## Hesab açıldıqdan sonra

Hesabın aktivləşməsi bütün əməliyyatların avtomatik qəbul ediləcəyi demək deyil. Tranzaksiyalar risk və uyğunluq yoxlamasından keçə bilər. Hesab yalnız qeyd edilən biznes məqsədləri üçün istifadə edilməlidir.

## Hazırlıq siyahısı

- rəsmi qeydiyyatdan keçmiş şirkət;
- şirkət və təsisçi sənədləri;
- real fəaliyyət göstərən sayt və ya satış profili;
- ödəniş mənbəyini göstərən müqavilə və ya invoice;
- gözlənilən dövriyyə haqqında aydın məlumat.

[Payoneer Business paketinin tərkibinə baxın](/az/services/foreign-bank-accounts) və müraciətinizi uyğun sənədlərlə başlatmaq üçün [bizimlə əlaqə saxlayın](/az#consultation).`,
  },
  {
    title: "Shopify Payments Azərbaycanda: şirkətsiz quraşdırma",
    slug: "sirketsiz-shopify-payments-qurasdirilmasi",
    excerpt:
      "Kiçik dövriyyəli mağazalar üçün şirkətsiz Shopify Payments modeli, mağaza auditi, xarici bank hesabı və verifikasiya mərhələləri.",
    seo_title: "Shopify Payments Azərbaycanda: şirkətsiz model",
    seo_description:
      "Şirkətsiz Shopify Payments modelinin kimə uyğun olduğunu, mağaza auditi, xarici bank hesabı və verifikasiya mərhələlərini öyrənin.",
    category: "Shopify Payments",
    content: `Shopify Payments Azərbaycanda birbaşa dəstəklənmədiyi üçün mağaza sahibləri tez-tez şirkətsiz quraşdırma imkanını araşdırırlar. Bu model yalnız Shopify Payments-in dəstəkləndiyi ölkənin real uyğunluq tələbləri ödənildikdə nəzərdən keçirilə bilər. Şəxsi məlumatlar, mağaza kontenti və payout hesabı eyni, sənədlə təsdiqlənən struktur daxilində hazırlanmalıdır.

## Bu model kimə uyğundur?

Sapiens Pay şirkətsiz modeli təxminən aylıq 4–5 min dollar dövriyyə planlayan kiçik mağazalar üçün praktik başlanğıc variantı kimi qiymətləndirir. Bu rəqəm Shopify tərəfindən müəyyən edilmiş rəsmi limit deyil və platformanın qərarına zəmanət vermir.

## Mağaza auditi niyə vacibdir?

Aktivləşmədən əvvəl məhsullar, qiymətlər, domen, əlaqə məlumatları və hüquqi səhifələr yoxlanmalıdır. Çatdırılma, geri qaytarma, məxfilik və istifadə şərtləri müştəri üçün aydın görünməlidir. Qadağan olunan və ya yüksək riskli məhsullar əlavə məhdudiyyət yarada bilər.

## Xarici bank hesabı

Payout almaq üçün uyğun xarici bank hesabı qurulmalıdır. Hesab sahibinin adı və digər məlumatlar Shopify Payments profilindəki məlumatlarla uyğun olmalıdır. Şirkətsiz quraşdırma paketimizə xarici bank hesabının açılışı üzrə dəstək daxildir.

## Verifikasiya

Platforma şəxsiyyət sənədi, ünvan təsdiqi və mağaza fəaliyyəti haqqında əlavə məlumat istəyə bilər. Bütün məlumatlar real və sənədlə təsdiqlənə bilən olmalıdır. Son qərarı Shopify və onun maliyyə tərəfdaşları verir.

## Paketə daxil olan əsas işlər

- mağazanın ilkin uyğunluq auditi;
- siyasət və əlaqə səhifələrinin yoxlanması;
- ödəniş strukturunun quraşdırılması;
- uyğun xarici bank hesabı üçün dəstək;
- verifikasiya mərhələsində yönləndirmə.

[Şirkətsiz quraşdırma paketinin qiymətinə baxın](/az/services/shopify-payments) və mağazanızın uyğunluğunu müəyyən etmək üçün [müraciət edin](/az#consultation).`,
  },
  {
    title: "Shopify Payments şirkət üzərindən necə açılır?",
    slug: "sirket-uzerinden-shopify-payments",
    excerpt:
      "Şirkət üzərindən Shopify Payments aktivləşməsi, korporativ sənədlər, biznes bank hesabı və böyüyən mağazalar üçün düzgün struktur.",
    seo_title: "Shopify Payments şirkət üzərindən necə açılır?",
    seo_description:
      "Shopify Payments-i şirkət üzərindən qurmaq üçün korporativ sənədlər, biznes bank hesabı, mağaza auditi və verifikasiyanı öyrənin.",
    category: "Shopify Payments",
    content: `Şirkət üzərindən Shopify Payments quraşdırılması böyüyən mağazalar üçün daha strukturlaşdırılmış biznes modeli yaradır. Mağaza, şirkət, təsisçi və payout hesabı eyni hüquqi və maliyyə quruluşu daxilində hazırlanır.

## Biznes modeli kimə uyğundur?

Dövriyyəsini böyütməyi, komanda ilə işləməyi, reklam büdcəsini artırmağı və əməliyyatları şirkət adı ilə idarə etməyi planlayan mağazalar üçün biznes modeli daha uyğun ola bilər. Bu paket üçün aktiv, rəsmi qeydiyyatdan keçmiş şirkət tələb olunur.

## Korporativ sənədlər

Şirkətin qeydiyyat sənədi, hüquqi ünvanı, direktor və təsisçi məlumatları tələb oluna bilər. Shopify həmçinin biznesin fəaliyyətini, məhsul kateqoriyasını və şirkətlə mağaza arasındakı əlaqəni təsdiqləyən sənədlər istəyə bilər.

## Biznes bank hesabı və payout

Payout üçün şirkət adına uyğun biznes hesabı hazırlanmalıdır. Bank hesabındakı şirkət adı və ünvan Shopify Payments məlumatları ilə ziddiyyət təşkil etməməlidir. Xarici hesabın təsdiqi də ayrıca maliyyə platformasının qiymətləndirməsindən asılıdır.

## Mağazanın uyğunluq auditi

Məhsul təsvirləri, qiymətlər, çatdırılma və qaytarma şərtləri, əlaqə məlumatları və hüquqi səhifələr yoxlanılır. Müştəri mağazanın kimə məxsus olduğunu və alış şərtlərini asanlıqla anlamalıdır.

## Nələri əvvəlcədən hazırlamaq lazımdır?

- aktiv şirkət və aktual korporativ sənədlər;
- şirkətin fəaliyyətini göstərən mağaza;
- şirkət adına biznes bank hesabı;
- aydın məhsul və qaytarma siyasəti;
- təsisçi və direktorların şəxsiyyət sənədləri.

Şirkət strukturu böyük dövriyyəyə və ya hesab təsdiqinə avtomatik zəmanət vermir. [Biznes quraşdırma paketinin detalları](/az/services/shopify-payments) ilə tanış olun və uyğun proses üçün [müraciət göndərin](/az#consultation).`,
  },
  {
    title: "Stripe Azərbaycanda necə açılır və qoşulur?",
    slug: "stripe-hesabinin-qosulmasi",
    excerpt:
      "Stripe ilə kart ödənişi qəbul etmək üçün şirkət, biznes bank hesabı, sayt, checkout və verifikasiya tələbləri.",
    seo_title: "Stripe Azərbaycanda necə açılır və qoşulur?",
    seo_description:
      "Stripe qoşmaq üçün şirkət, bank hesabı, sayt və checkout tələblərini, verifikasiya və payout prosesini ayrıca öyrənin.",
    category: "Stripe",
    content: `Stripe Azərbaycanda birbaşa dəstəklənmədiyi üçün beynəlxalq ödəniş qəbul etmək istəyən sahibkarlar uyğun xarici şirkət strukturu ilə işləmə imkanını araşdırırlar. Stripe saytda kart ödənişləri, abunəliklər və fərqli checkout ssenariləri qurmaq üçün istifadə edilən ödəniş platformasıdır. Quraşdırma yalnız texniki inteqrasiyadan ibarət deyil; şirkət, bank hesabı və sayt məlumatları da uyğun olmalıdır.

## Stripe kimə uyğundur?

E-commerce mağazaları, SaaS layihələri, rəqəmsal xidmət şirkətləri və beynəlxalq müştərilərdən kartla ödəniş alan bizneslər Stripe-ı nəzərdən keçirə bilər. Xidmət yalnız dəstəklənən ölkə və uyğun biznes strukturu daxilində qurulmalıdır.

## Şirkət və bank hesabı

Müraciət zamanı şirkətin qeydiyyat məlumatları, hüquqi ünvanı, təsisçiləri və fəaliyyət sahəsi yoxlanıla bilər. Payout üçün şirkət məlumatlarına uyğun biznes bank hesabı tələb olunur.

## Sayt və checkout tələbləri

Saytda məhsul və ya xidmətin təsviri, qiyməti, əlaqə məlumatları, məxfilik, istifadə, çatdırılma və geri qaytarma şərtləri aydın olmalıdır. Abunə modelində təkrarlanan ödəniş və ləğv qaydası ayrıca göstərilməlidir.

## Verifikasiya və risk yoxlaması

Stripe şəxsiyyət, şirkət, sayt və əməliyyatları yoxlaya bilər. Dövriyyənin kəskin artması, yüksək chargeback faizi və qeyri-aydın məhsullar əlavə sənəd sorğusuna səbəb ola bilər. Hesabın təsdiqinə heç bir xidmət zəmanət verə bilməz.

## Quraşdırma mərhələləri

- biznes modelinin uyğunluq yoxlaması;
- şirkət və payout hesabının hazırlanması;
- saytın hüquqi və kommersiya auditi;
- hesab və checkout quraşdırılması;
- test ödənişi və əməliyyat axınının yoxlanması.

[Beynəlxalq ödəniş sistemlərinin qoşulması](/az/services/international-payments) xidmətinə baxın və Stripe üçün uyğun struktur barədə [konsultasiya alın](/az#consultation).`,
  },
  {
    title: "PayPal Business Azərbaycanda necə açılır?",
    slug: "paypal-business-qosulmasi",
    excerpt:
      "PayPal Business hesabı üçün şirkət, bank, sayt və verifikasiya tələbləri, payout, refund və mübahisələrin idarə edilməsi.",
    seo_title: "PayPal Business Azərbaycanda necə açılır?",
    seo_description:
      "PayPal Business hesabı üçün şirkət, bank və sayt tələblərini, verifikasiya, payout, refund və dispute prosesini öyrənin.",
    category: "PayPal",
    content: `PayPal Business Azərbaycanda ödəniş qəbulu üçün tam şəkildə dəstəklənmədiyinə görə sahibkarlar uyğun xarici biznes strukturlarını araşdırırlar. PayPal Business beynəlxalq müştərilərdən ödəniş almaq və PayPal checkout-u sayta əlavə etmək üçün istifadə olunan biznes hesabıdır. Quraşdırma zamanı şirkət, hesab sahibi, sayt və bank məlumatlarının uyğunluğu əsas şərtlərdəndir.

## PayPal Business kimə uyğundur?

Xarici bazarlara məhsul və xidmət satan, müştərilərinə PayPal ilə ödəniş imkanı vermək istəyən şirkətlər bu hesabı nəzərdən keçirə bilər. Funksiyalar və mövcudluq şirkətin qeydiyyat ölkəsinə görə dəyişir.

## Müraciət üçün tələb olunanlar

Şirkətin qeydiyyat sənədləri, hüquqi ünvanı, direktor və təsisçi məlumatları tələb oluna bilər. Platforma fəaliyyət göstərən sayt, məhsul və qiymət məlumatları, müqavilə və invoice kimi əlavə sübutlar da istəyə bilər.

## Saytın hazırlanması

Saytda biznesin adı, əlaqə məlumatları, məhsul təsvirləri, çatdırılma, geri qaytarma, məxfilik və istifadə şərtləri açıq göstərilməlidir. Bu məlumatlar PayPal profilindəki şirkət məlumatları ilə uyğun olmalıdır.

## Payout və bank hesabı

Vəsaitin çıxarılması üçün dəstəklənən, şirkətə uyğun bank hesabı seçilməlidir. Valyuta və hesab sahibi məlumatları əvvəlcədən yoxlanmalıdır. Payout imkanları bazara və hesabın statusuna görə fərqlənə bilər.

## Refund, dispute və rezervlər

PayPal alıcı mübahisələrini və geri ödənişləri ayrıca idarə edir. Gec çatdırılma, qeyri-aydın məhsul təsviri və yüksək şikayət sayı hesab üzrə məhdudiyyət və ya rezerv yarada bilər. Sifariş və çatdırılma sübutlarını sistemli saxlamaq vacibdir.

## Quraşdırma mərhələləri

- biznes və ölkə uyğunluğunun yoxlanması;
- şirkət və bank sənədlərinin hazırlanması;
- saytın uyğunluq auditi;
- hesab və checkout quraşdırılması;
- test və əməliyyat qaydalarının hazırlanması.

[Beynəlxalq ödəniş sistemləri xidmətinin detalları](/az/services/international-payments) ilə tanış olun və PayPal Business üçün [müraciət edin](/az#consultation).`,
  },
].map((post) => ({
  ...post,
  locale: "az",
  status: "published",
  published_at: new Date().toISOString(),
  scheduled_at: null,
}));

const mixedSlugs = [
  "azerbaycandan-xarici-bank-hesabi-acmaq",
  "shopify-payments-qurasdirilmasi",
  "stripe-paypal-beynelxalq-odenis-qebulu",
];

const companyPostResponse = await fetch(
  `${url}/rest/v1/posts?locale=eq.az&slug=eq.xaricde-sirket-acmaq`,
  {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      title: "Azərbaycandan xaricdə şirkət necə açılır?",
      excerpt:
        "Azərbaycandan xaricdə şirkət açmaq üçün ölkə seçimi, sənədlər, vergi öhdəlikləri, bank hesabı və ödəniş sistemləri üzrə praktik bələdçi.",
      seo_title: "Azərbaycandan xaricdə şirkət necə açılır?",
      seo_description:
        "Azərbaycandan xaricdə şirkət açmaq üçün ölkə seçimi, sənədlər, hüquqi ünvan, vergi, bank hesabı və ödəniş sistemlərini öyrənin.",
    }),
  },
);
if (!companyPostResponse.ok) {
  throw new Error(
    `Could not update company article: ${companyPostResponse.status} ${await companyPostResponse.text()}`,
  );
}

for (const slug of mixedSlugs) {
  const response = await fetch(
    `${url}/rest/v1/posts?locale=eq.az&slug=eq.${encodeURIComponent(slug)}`,
    { method: "DELETE", headers },
  );
  if (!response.ok) {
    throw new Error(`Could not delete ${slug}: ${response.status} ${await response.text()}`);
  }
}

const response = await fetch(`${url}/rest/v1/posts?on_conflict=locale,slug`, {
  method: "POST",
  headers: {
    ...headers,
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify(posts),
});

if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
const saved = await response.json();
console.log(`Published ${saved.length} focused SEO posts.`);
for (const post of saved) console.log(`- /${post.locale}/blog/${post.slug}`);
