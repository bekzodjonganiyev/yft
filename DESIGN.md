# Yangiyer Flour Trading: redesign rejasi

Asos: `origin/update` (b07292f), yaʼni yangiyerflourtrading.uz’da hozir turgan kod. Stack: Next.js 16 (§7).
Jarayon (v3): `impeccable`, `design-taste-frontend`, `emil-design-eng`; audit: `accessibility`, `web-design-guidelines`.

## 1. Brief

- **Mavzu:** Sirdaryo viloyati, Yangiyer shahridagi un tegirmoni. 1991-yildan beri ishlaydigan oilaviy korxona.
  Birinchi navli bug'doy unini 50 kg qoplarda chiqaradi. To'rtta brendi bor: SO'FRA, MASHRAB, AL HAYOT, SALAM.
  Qoplarda Qozog'iston bug'doyi, GOST 26574-85 va UZ, KZ, RU bozorlari ko'rsatilgan.
- **Auditoriya:** ulgurji xaridorlar va distribyutorlar (O'zbekiston, Qozog'iston, Rossiya), novvoyxonalar,
  shuningdek arab tilida o'qiydigan eksport hamkorlari.
- **Sahifaning asosiy vazifasi:** xaridor 10 soniya ichida uchta narsani bilib olsin: nima sotiladi
  (birinchi nav un, 50 kg, 4 brend), kim sotadi (1991-yildan beri ishlayotgan haqiqiy tegirmon) va qanday buyurtma beriladi
  (telefon yoki forma). Sahifaning bosh harakati: **narx so'rash**.

## 2. Hozirgi saytdagi muammolar (tahlil)

| Joy | Muammo |
|---|---|
| Hero | 3 slaydli carousel, uchalasida ham bir xil sarlavha. Matn foto ustida 50% shaffoflikda, CTA yo'q |
| Mahsulotlar | Qop rasmlari carousel ichida, nomi yo'q (`alt="Product 1"`), ma'lumot ham yo'q |
| "O'rganmoqchi bo'lgan mavzu" | Yangiliklar shablon matni bilan to'ldirilgan ("First News Title") |
| FAQ | Mavzuga aloqasi yo'q placeholder ("volunteering or donating") |
| Vakansiyalar, Hamkorlar | O'chgan API'ga bog'liq, shuning uchun bo'sh sarlavha bo'lib turibdi |
| Kontakt forma | **Telegram bot tokeni brauzer kodida ochiq turibdi.** Label'lar yo'q, `type="number"` telefon, `alert()` + sahifani qayta yuklash |
| Tillar | Arabcha matnlar aslida fors tilida. Til menyusida arab tili "Fr" deb yozilgan. RTL qo'llab-quvvatlanmaydi |
| Navigatsiya | Butun ilova `h-screen overflow` div ichida aylantiriladi, shuning uchun anchor havolalar va brauzer scroll'i buziladi |
| Unumdorlik | flowbite, slick, react-awesome-reveal, recharts, axios kabi og'ir kutubxonalar. 4.7 MB JPG/PNG, Google Fonts `@import` orqali yuklanadi, GA ikki marta va placeholder ID bilan ulangan |
| A11y | Focus holati ko'rinmaydi, tugmalar `div`/`li` bilan qilingan, `alt` matnlar ma'nosiz |

## 3. Vizual tizim (v3: impeccable, design-taste-frontend, emil-design-eng)

**G'oya.** Sayt sanoat yetkazib beruvchisiga xos ko'rinishga ega bo'lishi kerak. Sarlavhalar qoplar va vagonlardagi kabi keng
geometrik harflarda, ranglar kechki smenaning navy fonida bug'doy oltini. Qoplarning o'zi mahsulot qahramoni sifatida
katta ko'rsatiladi, ishlab chiqarish esa scroll bilan ochiladigan foto-hikoya bo'ladi. Rad etilgan shablonlar:
krem fon va serif shrift ("hunarmand novvoy" uslubi), bir xil kartalar to'plami, hero'dagi raqamlar bloki.

### Rang: committed strategiya, brend ranglari saqlangan

| Token | Hex | Rol |
|---|---|---|
| `navy` | `#063F58` | Brend navy'si. Brendlar bo'limi foni |
| `navy-900` / `navy-950` | `#042A3B` / `#021B27` | Hero, narx so'rash, footer |
| `gold` | `#EEAD0F` | Logotipning oltini. Faqat bosh tugma, faol holat va to'q fondagi havolalar uchun |
| `gold-ink` | `#8A5F00` | Och fondagi oltin matn (statement'dagi ajratilgan ibora, 5.6:1) |
| `paper` / `flour` | `#FFFFFF` / `#F4F6F7` | Och seksiyalar navbatma-navbat |
| `ink` / `muted` | `#0B1E28` / `#52646E` | Matn (oq fonda 6.2:1) |
| `line` / `line-strong` | `#D9DFE2` / `#74838D` | Chiziqlar / boshqaruv elementlari chegarasi (3.9:1) |

Seksiyalar foni ketma-ketligi: qoramtir (hero) → oq (statement) → navy (brendlar) → och kulrang (ishlab chiqarish) →
oq (korxona) → och kulrang (fotolar) → qoramtir (narx so'rash) → navy-900 (footer).

### Tipografiya

- **IBM Plex Sans** (600/700): sarlavhalar. Butun sayt bitta oilada — sarlavha va matn og‘irlik bilan farqlanadi, shrift bilan emas.
- **IBM Plex Sans** (400/500): asosiy matn. **IBM Plex Sans Arabic**: arabcha harflar — o‘sha oilaning arab versiyasi, og‘irliklari mos.
- Shkala: display `clamp(2.25rem … 4.375rem)`, h2 `clamp(2rem … 3.5rem)`, statement `clamp(1.75rem … 4rem)`, lead 18–22px, body 17px.
- Sarlavha ikki gapdan iborat bo'lsa, ikkinchisi ochroq tonda beriladi. Bitta so'zni boshqa rangga bo'yash va ALL-CAPS ishlatilmaydi.
- IBM Plex olib tashlandi, chunki impeccable uni "o'ylamasdan tanlangan default" deb hisoblaydi.

### Shakl

Boshqaruv elementlari 10px, kartalar va forma 16px, fotolar 14px radiusda. Soya faqat popover va qopda ishlatiladi
(qopniki uning ostidagi "yer"ni bildiradi).

## 4. Sahifa tuzilishi

| # | Seksiya | Nima ko'rsatadi | Harakat |
|---|---|---|---|
| 1 | Hero | Kechki tegirmon fotosi, sarlavha, 2 ta tugma. Header foto ustida shaffof, scroll'da muzlatilgan "glass" panelga aylanadi | Sahifa ochilganda bir marta: so'zlar niqobdan ko'tariladi, matn va tugmalar ketma-ket chiqadi, foto 1.06 dan joyiga o'rnashadi. Orqada 3 ta xira rang dog'i sekin suzadi va sichqoncha tomon engil og'adi (faqat mouse) |
| 2 | Statement | Sahifa tayanadigan bitta gap | **Scroll moment 1 (word-highlight):** so'zlar scroll bilan kulrangdan qora rangga o'tadi, ajratilgan ibora oltin rangga |
| 3 | Brendlar | 4 ta qop, qop burchagida spec-karta (nav, bug'doy, vazifa, 50 kg, GOST), CTA | Tanlagichda qop blur bilan crossfade qilib almashadi; sahna (qop + karta) sichqoncha tomon 6° gacha og'adi, karta qopdan balandroq qatlamda (translateZ) |
| 4 | Ishlab chiqarish | 4 bob: laboratoriya, tegirmon, qadoqlash, yuklash; har bobda 2 ta ko'rsatkich chipi (GOST chegaralari, qop, vagon) | **Scroll moment 2 (photo-chapters):** seksiya pin qilinadi, har bir keyingi foto pastdan ochiladi (`clip-path`) va 1.08 dan joyiga o'rnashadi; panel bob raqami, sarlavha va progress chizig'ini ko'rsatadi |
| 5 | Raqamlarda | To'q "tablo": 6 ta raqam (1991, 30+, 4 brend, 50 kg, 1–3 nav, 2 davlat) va Yangiyer vaqti (jonli soat) | Tablo ekranga kirganda raqamlar vokzal taxtasidek bittalab ag'darilib chiqadi (`flap`), serverda raqamlar oddiy ko'rinadi |
| 6 | Korxona | Korxona videosi (poster: xodimlar fotosi, bosilganda YouTube pleyer yuklanadi), matn, 6 ta fakt | Play tugmasi hover'da 1.05, bosilganda .95 |
| 7 | Fotolar | 8 ta fotodan mozaika (4×3 / 2×6), lightbox | Hover'da foto 1.03 ga zoom bo'ladi |
| 8 | Savol-javob | 5 ta savol (`<details name>`, bittasi ochiq), yonida yopishqoq "tez aloqa" kartasi: qo'ng'iroq, Telegram, email, har birida nusxalash tugmasi | Javob `::details-content` orqali siljib ochiladi, "+" 45° buriladi; nusxalashda pastda toast chiqadi |
| 9 | Narx so'rash | Kontaktlar katta shriftda va forma; forma ostida so'rov xulosasi: brend, hajm (qop → tonna), tashish (20 t mashina / 68 t vagon) | Select popover, stepper, xatolar maydon ostida, xulosa qiymatlari yozilganda yangilanadi, natijaga o'tishda blur bilan almashinuv |
| 10 | Footer | Katta wordmark, 4 ustun, huquqiy qator | Havolalar tagiga chiziq chiziladi |

**Dok va tema.** Pastki o'ng burchakda ikki dumaloq tugma: "sahifa boshiga" (hero o'tib ketgach chiqadi) va tungi/kunduzgi rejim. Tema `<html data-theme>` da, `localStorage`da eslab qolinadi, birinchi marta OS sozlamasidan olinadi va `<head>`dagi inline skript bilan birinchi chizishdan oldin qo'yiladi. Tungi rejimda `paper`/`flour` ikki chuqurlikdagi navy, `ink` oqish, brend navy seksiyalari o'zgarmaydi; och fondagi navy matn och ko'k tusga o'tadi. Almashinuv View Transitions bo'lgan brauzerda tugmadan o'sib chiquvchi doira bilan ochiladi.

**Motion qoidalari (taste + Emil):**
- scroll faqat ikki moment ichida ishlaydi, boshqa hech bir karta yoki seksiya scroll'da "paydo bo'lmaydi";
- scroll ushlanmaydi va boshqarilmaydi, faqat `position: sticky` va passiv `rAF` ishlatiladi;
- ease-out egri chizig'i `cubic-bezier(.23,1,.32,1)`, UI animatsiyalari 300ms dan qisqa;
- tugma bosilganda `scale(.97)` + 1px pastga tushadi; hover effektlari faqat `(hover:hover) and (pointer:fine)` qurilmalarida;
- `prefers-reduced-motion` yoqilganda hech narsa harakatlanmaydi: statement darhol to'liq qora rangda, boblar yonma-yon turadi.
- Server HTML har doim yakuniy, o'qiladigan holatda chiqadi; momentlar faqat hydration'dan keyin yoqiladi.
- Photo-chapters faqat ekran balandligi 600px dan katta bo'lganda ishlaydi.

**Komponentlar:**
- `Select`: WAI-ARIA select-only combobox. ↑/↓, Home/End, type-ahead, Enter/Space, Esc va Tab ishlaydi, tashqariga bosilganda yopiladi. Popover tugma joylashgan tomondan `scale(.97)` dan 160ms'da ochiladi, joy bo'lmasa yuqoriga ochiladi. Shakl formasiga yashirin input orqali qiymat beradi. Header'dagi til tanlash ham shu komponentda.
- `QuantityField`: raqam kiritiladi yoki 10 talab −/+ qilinadi (0–100 000).
- Forma: label'lar ko'rinadi, xatolar faqat yuborishda tekshiriladi va maydon ostida chiqadi. Birinchi xato maydoniga focus o'tadi, holat qatorida xatolar soni yoziladi. Muvaffaqiyat faqat server javobidan keyin ko'rsatiladi.
- Brend tanlash URL orqali: `?brand=salam#contact`.
- `Figures`: `IntersectionObserver` (35%) bir marta ishga tushadi; soat `Intl.DateTimeFormat` bilan `Asia/Tashkent` vaqtini ko'rsatadi, faqat hydration'dan keyin.
- `Faq`: native `<details name="faq">` — bir vaqtda bittasi ochiq, JS kerak emas; `interpolate-size: allow-keywords` qo'llab-quvvatlanmagan brauzerda darhol ochiladi.
- `Toaster`: `window` hodisasi orqali (`toast()`), `role="status"`, 2.6 s.
- `Dock`: tema holati `useSyncExternalStore` bilan `<html data-theme>` dan o'qiladi; serverda tugma yashirin (tanlov noma'lum).
- Lenis ishlatilmadi: ikki scroll moment native scroll'ga tayanadi, smooth-scroll kutubxonasi ularni buzadi va 10 KB qo'shadi.

## 5. Tekshiruv

- **Accessibility:** axe (WCAG 2.2 AA + best-practice) `/uz`, `/ar`, `/ru/photos` sahifalarida production build'da 0 ta buzilish.
- **Kontrast:** hisoblab tekshirilgan. Statement'dagi yoritilmagan so'zlar 3.4:1, ya'ni katta matn uchun AA.
- **Brauzerda sinalgan:**
  - 1440 va 375 kenglikda, RTL ham;
  - Select klaviatura bilan;
  - stepper;
  - formaning xato va muvaffaqiyat holatlari (dry-run).
- **Hajm (`/uz`, gzip):** HTML 21 KB, CSS 11 KB, JS 191 KB.

## 6. Texnik stack (Next.js 16)

| Qatlam | Tanlov |
|---|---|
| Framework | **Next.js 16.4** (App Router, Turbopack), **React 19.3** |
| Til | **TypeScript 6.0** (strict) |
| Stil | **Tailwind CSS 4.3**: tokenlar `src/app/globals.css` ichidagi `@theme` blokida, JS konfiguratsiyasi yoʻq |
| Shrift | `next/font/google`: IBM Plex Sans + IBM Plex Sans Arabic, self-host qilinadi |
| Rasm | `next/image` (AVIF → WebP, blur placeholder); hero `loading="eager"` + `fetchPriority="high"` |
| Lint | ESLint 9 flat config (`eslint-config-next/core-web-vitals` + `typescript`). Next 16'da `next lint` yoʻq |

**Routing va i18n**

- Har bir sahifa `/[locale]` ostida joylashgan (`/uz`, `/ru`, `/en`, `/ar`, `/…/photos`).
  Hammasi `generateStaticParams` orqali statik HTML sifatida build qilinadi, `dynamicParams = false`.
- `src/proxy.ts` (Next 16'da `middleware` oʻrniga keladi) tilsiz manzilni yoʻnaltiradi.
  Til tanlash tartibi: `NEXT_LOCALE` cookie → `Accept-Language` → `uz`.
- Tarjimalar `src/i18n/locales/*.json` fayllarida turadi va faqat serverda yuklanadi (`getDictionary`, `next/root-params`).
  Client komponentlarga faqat ular kerak qiladigan qatorlar prop sifatida beriladi.
- `<html lang dir>` serverda qoʻyiladi, shuning uchun RTL'da sahifa "sakramaydi".
- SEO: har bir tilga alohida `title`/`description`, `hreflang` (+ `x-default`), canonical, Open Graph, `sitemap.xml`, `robots.txt`.
- Eski `/news`, `/vacancies`, `/details/*` manzillari `next.config.ts` orqali 308 bilan `/`'ga yoʻnaltiriladi.

**Server va client komponentlar**

- Server (brauzerga JS yubormaydi): Hero, Brands, About, Process, GalleryPreview, Contact, Footer, sahifalar.
- Client (faqat interaktiv qismlar): Header (mobil menyu), LanguageSelect, BrandShelf (javon animatsiyasi),
  ContactForm, PhotoGrid. Lightbox esa faqat foto ochilganda yuklanadi.
- Brend tanlash URL orqali ishlaydi: `/uz?brand=salam#contact`. Bu havolani nusxalab yuborish mumkin, forma brend tanlangan holda ochiladi.

**Kontakt forma**

- `POST /api/inquiry` (`src/app/api/inquiry/route.ts`) soʻrovni Telegram'ga yuboradi. Token faqat server env'ida turadi.
- Spamdan himoya: honeypot, 2.5 soniyalik minimal toʻldirish vaqti va IP boʻyicha cheklov (10 daqiqada 5 ta).
- Natija va xato sahifaning oʻzida koʻrsatiladi (`alert` yoʻq), xato xabarida zaxira telefon raqami beriladi.

## 7. Amalga oshirish eslatmalari

- **Oʻzbekcha apostrof:** IBM Plex'da `ʻ` (U+02BB) belgisi yoʻq, brauzer uni boshqa shriftdan oladi va "bug ʻ doy" kabi boʻshliq paydo boʻladi.
  Shuning uchun matnlarda `‘` (U+2018) va `’` (U+2019) ishlatiladi.
- **OG rasmi:** `app/opengraph-image.jpg`. `[locale]/layout` oʻzining `openGraph` obyektini beradi va u meros
  kelgan rasmni ustidan yozib yuboradi, shuning uchun rasm u yerda ham aniq koʻrsatilgan.

## 8. Ishga tushirish va deploy

```bash
npm install
npm run dev        # http://localhost:3000; token boʻlmasa, forma soʻrovni terminalga yozadi (dry-run)
npm run build && npm start
npm run lint && npm run typecheck
```

Vercel: framework preset **Next.js**, qoʻshimcha sozlama talab qilinmaydi.
Environment Variables boʻlimiga `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` kiritiladi.
Eski token git tarixida qolgan, shuning uchun avval @BotFather'da `/revoke` qilib, yangisini oling.
