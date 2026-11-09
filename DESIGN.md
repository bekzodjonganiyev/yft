# Yangiyer Flour Trading: redesign rejasi

Asos: `origin/update` (b07292f), ya'ni yangiyerflourtrading.uz'da hozir turgan kod.
Jarayon: `frontend-design` (reja → qayta ko'rib chiqish → kod), `vercel-react-best-practices`,
`web-design-guidelines` + `accessibility` (audit), `impeccable` (yakuniy pardoz).

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

## 3. Token tizimi

### Rang (5 ta)

| Nom | Hex | Rol |
|---|---|---|
| Silo Blue | `#0B3B55` | Asosiy brend rangi (hozirgi `#063F58`dan olingan, kechki osmon). Header matni, shelf foni, footer |
| Wheat Gold | `#EEAD0F` | Brend urg'usi (logotip). Faqat bosh CTA va faol holatlar uchun |
| Steel | `#E4E8EA` | Silos po'lati. Muqobil seksiya foni, chegaralar |
| Ink | `#14283A` | Asosiy matn (ko'kimtir qora, Silo Blue bilan bir oiladan) |
| Flour | `#FFFFFF` | Asosiy fon |

Qoplarning qizil va sariq ranglari palitraga kiritilmaydi, ular fotolarning o'zidan keladi.
Sayt foni sokin bo'lgani uchun qoplar aynan shu fonda ajralib turadi.
Kontrast (tekshirilgan): Ink/Flour 15.1:1, Silo Blue/Flour 11.9:1, Ink/Steel 12.2:1.
Wheat Gold ustidagi matn faqat Ink rangida (7.6:1). Silo Blue ustida Gold matn 6.0:1, ya'ni AA darajasidan o'tadi.

### Tipografiya

- **IBM Plex Sans** (lotin + kirill) va **IBM Plex Sans Arabic** (arab tili). Ikkalasi bitta dizayn tizimidan,
  shuning uchun 4 til bir xil ovozda ko'rinadi. Plex muhandislik va sanoat ruhida chizilgan shrift, tegirmon mavzusiga mos.
  Hozirgi saytda ham ishlatiladi, ya'ni brend uzluksizligi saqlanadi. Shriftlar `@fontsource` orqali o'zimizda
  joylashtiriladi (Google `@import` olib tashlanadi).
- O'lcham shkalasi (1.25): 14 / 16 / 20 / 25 / 31 / 39 / 61 px. Body 17px, line-height 1.6, satr uzunligi ≤ 68ch.
- Sarlavhalar: 600 weight, tracking −0.015em, sentence case. **ALL-CAPS ishlatilmaydi**
  (tugmalar va "XABAR YUBORISH" ham kichik harfga o'tadi).
- Raqamlar (1991, 50 kg, GOST 26574-85, telefonlar) `tabular-nums` bilan beriladi.

### Shakl

- Radius ierarxiyasi: tugma va input 6px, foto 2px (fotoga yumaloq burchak berilmaydi), qop rasmlari radiussiz.
- Soya yo'q. Ajratish fon rangi (Flour/Steel/Silo Blue) va bo'shliq orqali qilinadi.

## 4. Layout

Hamma narsa chapga tekislanadi (RTL'da o'ngga). Markazlashtirilgan matn faqat qop nomlarida bo'ladi.
Kontent kengligi 1200px, matn ustuni 68ch.

```
┌───────────────────────────────────────────────────────────────┐
│ [logo] Yangiyer Flour Trading   Mahsulot  Tegirmon  Aloqa  Uz▾ [+998 90 979 50 55] │  ← sticky, oq fon
├───────────────────────────────────────────────────────────────┤
│                                              ▐█▌  ▐████████▌ │
│  Birinchi navli bug'doy uni.                 ▐█▌  ▐ tegirmon ▌ │  ← HERO: photo_24 (kechki tegirmon)
│  50 kg qoplarda, ulgurji.                    ▐█▌  ▐  binosi  ▌ │     to'liq kenglikda. Osmon chap tomonda,
│  Yangiyer, 1991-yildan.                                        │     matn ham chapda (fotoning bo'sh qismida)
│  [ Narx so'rash ]  [ Qo'ng'iroq qilish ]                       │
├───────────────────────────────────────────────────────────────┤
│ ███████████████████ SILO BLUE ██████████████████████████████ │
│  Bizning brendlar                                             │  ← SHELF: yagona "jasur" element
│   ┌────┐  ┌────┐  ┌────┐  ┌────┐                               │     4 qop "javonda" yonma-yon, katta.
│   │SO' │  │MASH│  │ AL │  │SALA│                               │     Har birining ostida: nomi, nav, 50 kg.
│   │FRA │  │RAB │  │HAYT│  │ M  │                               │     Bosilganda forma shu brend bilan ochiladi
│   └────┘  └────┘  └────┘  └────┘                               │
│  SO'FRA     MASHRAB    AL HAYOT    SALAM                       │
│  Birinchi nav, 50 kg (har biri)                                │
├───────────────────────────────────────────────────────────────┤
│  Korxona haqida (2/3 matn)      │  Spec varaq (dl):            │  ← ABOUT: proza + ma'lumot jadvali
│  1991-yildan oilaviy korxona…   │  Tashkil topgan   1991       │     (kalit-qiymat ko'rinishidagi haqiqiy kontent)
│                                 │  Joylashuv  Yangiyer, Sirdaryo│
│                                 │  Mahsulot   Bug'doy uni, 1-nav│
│                                 │  Qadoq      50 kg qop         │
│                                 │  Standart   GOST 26574-85     │
├───────────────────────────────────────────────────────────────┤
│  Ishlab chiqarish (STEEL fon)                                  │  ← PROCESS: haqiqiy ketma-ketlik,
│  1 Bug'doy qabul   2 Laboratoriya   3 Tegirmon   4 Qadoqlash   │     shuning uchun raqamlash o'rinli.
│  [foto]            [foto]           [foto]       [foto]        │     Fotolar galereyadan olinadi
├───────────────────────────────────────────────────────────────┤
│  Tegirmondan fotolar  (8 ta, bir tekis bo'lmagan grid) Barchasi│  ← GALLERY: /photos'ga o'tadi, lightbox
├───────────────────────────────────────────────────────────────┤
│  Aloqa                                                         │  ← CONTACT
│  Telefon (UZ/KZ), email,        │  Forma: Ism, Telefon,        │
│  manzil, ish vaqti, xarita      │  Brend ▾, Hajm (qop), Xabar  │
│                                 │  [ So'rov yuborish ]         │
├───────────────────────────────────────────────────────────────┤
│ Footer: logo, manzil, telefonlar, til, © 2026                  │  ← Silo Blue
└───────────────────────────────────────────────────────────────┘
```

Mobil: hero fotosi `object-position: 70%` (bino ko'rinib turadi), matn pastda. Shelf gorizontal scroll-snap'ga o'tadi
(2.2 ta qop ko'rinadi, keyingisi chetdan chiqib turadi). Process vertikal ro'yxat bo'ladi.

## 5. Tamoyillar

1. **Haqiqiy narsa birinchi o'rinda.** Tegirmon binosi va qoplarning o'zi ko'rinadi. Dekorativ gradient,
   ikonka to'plami va abstrakt fon ishlatilmaydi.
2. **Jasorat faqat bitta joyda: brend javoni.** Qolgan hamma narsa sokin va tartibli.
3. **Bitta harakat lahzasi.** Qoplar ko'rinish maydoniga birinchi kirganda javonga ketma-ket "o'rnashadi"
   (bir marta, 600ms). `prefers-reduced-motion` yoqilgan bo'lsa, bu animatsiya o'chadi. Kartalarda hover-zoom yo'q.
4. **Ulgurji xaridor tilida.** "Narx so'rash", "Qo'ng'iroq qilish", "So'rov yuborish", "So'rov yuborildi".
   Sotuvchi bo'rttirma gaplar ("second to none") ishlatilmaydi.
5. **To'qilgan kontent yo'q.** Faqat tasdiqlangan faktlar ishlatiladi. Yangiliklar, vakansiyalar, FAQ va hamkorlar
   haqiqiy kontent kelguncha bosh sahifadan olinadi.

## 6. Brief bilan solishtirish (ko'rib chiqish)

Xuddi shunday "un tegirmoni landing'i" so'ralganda men odatda nima qilardim, shuni tekshirdim:

- *Default:* hero'da "30+ yil / 1991 / 4 brend" kabi katta raqamli stat-blok.
  **Almashtirildi:** faktlar About'dagi spec varaqqa ko'chirildi. Hero'da sarlavha, foto va CTA qoladi.
- *Default:* krem fon, serif sarlavha, "hunarmand novvoy" kayfiyati. Bu non do'koni uchun to'g'ri, lekin sanoat tegirmoniga mos emas.
  **Rad etildi:** oq fon, po'lat-ko'k palitra va Plex Sans tanlandi.
- *Default:* mahsulotlar uchun bir xil yumaloq kartalar va soya (SaaS-card kit).
  **Almashtirildi:** kartalar o'rniga qoplar to'q fonda "javonda" turadi.
- *Default:* har bir seksiya tepasida tracked ALL-CAPS eyebrow va "01/02/03" raqamlash.
  **Almashtirildi:** eyebrow yo'q. Raqamlash faqat Process'da qoldi, chunki u haqiqiy ketma-ketlik.
- *Default:* tugmalarga "→" qo'shish va kartalarda hover-scale. **Olib tashlandi.**

## 7. Texnik reja (Vite + React)

- `App`'dagi `h-screen overflow` scroll konteyneri olib tashlanadi, `window` scroll'i qaytadi.
- Olib tashlanadigan kutubxonalar: flowbite(-react), react-slick + slick-carousel, react-awesome-reveal, recharts, axios,
  @emailjs/browser, hamburger-react, react-lazy-load-image-component, i18next-http-backend va o'chgan API konteksti.
- Rasmlar: `vite-imagetools` bilan AVIF/WebP va `srcset`. Hero fotosi `preload` qilinadi, qolganlari `loading="lazy"`.
- i18n: `i18next` qoladi. `<html lang/dir>` til bilan sinxronlanadi, arab tili uchun RTL logical properties ishlatiladi
  (`ms-`/`me-`/`start`). Arabcha matnlar haqiqiy arab tiliga qayta tarjima qilinadi (ona tilida so'zlashuvchi tekshirishi kerak).
- Kontakt forma: so'rov `/api/inquiry` Vercel serverless funksiyasiga ketadi. Bot tokeni server env'ida turadi.
  Honeypot qo'shiladi, reCAPTCHA esa serverda tekshiriladi. Natija sahifada inline ko'rsatiladi (`alert` yo'q).
- GA bitta `gtag` bilan qoldiriladi, placeholder UA ulanishi olib tashlanadi.

## 8. Amalga oshirish eslatmalari

- **Oʻzbekcha apostrof:** IBM Plex'da `ʻ` (U+02BB) belgisi yoʻq, brauzer uni boshqa shriftdan oladi va "bug ʻ doy" kabi boʻshliq paydo boʻladi.
  Shuning uchun matnlarda `‘` (U+2018) va `’` (U+2019) ishlatiladi.
- **Input chegarasi:** `steel-400` (#B9C2C7) oq fonda faqat 1.8:1 beradi. Shuning uchun boshqaruv elementlarida
  `steel-600` (#74838D) ishlatiladi: Flour fonda 3.9:1, Steel fonda 3.2:1 (WCAG 1.4.11).
- **Eski URL'lar:** `/news`, `/vacancies`, `/details/*` bosh sahifaga yoʻnaltiriladi, ular 404 bermaydi.
- **Tekshiruv:** axe-core (WCAG 2.2 AA + best-practice) uz, ar (RTL) va /photos sahifalarida 0 ta buzilish koʻrsatdi.
  Production build'ning birinchi yuklanishi taxminan 260 KB (hero AVIF 15 KB, JS 91 KB gzip).

## 9. Deploy (Vercel)

1. Project → Settings → Environment Variables: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
   Eski token kodda ochiq qolgan, shuning uchun avval @BotFather'da `/revoke` qilib, yangisini kiriting.
2. Build: `npm run build`, output: `dist`. `/api/inquiry` funksiyasi `api/` papkasidan avtomatik olinadi.
3. Lokal ishga tushirish: `npm run dev`. Token berilmagan boʻlsa, forma dry-run rejimida ishlaydi va soʻrovni terminalga yozadi.
