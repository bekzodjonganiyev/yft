// Copy comes from the version_2_1_0 frontend (src/assets/locales/*/translation.json).
// The 4th language there is Persian (shown as "Fa"), not Arabic.

export type Locale = 'uz' | 'ru' | 'en' | 'fa';
export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'uz', label: 'Uz' },
  { code: 'ru', label: 'Ru' },
  { code: 'en', label: 'En' },
  { code: 'fa', label: 'Fa' },
];
export const isRtl = (locale: Locale) => locale === 'fa';

const uz = {
  brand: { name: 'YANGIYER FLOUR', name2: 'TRADING' },
  nav: {
    about: 'Biz haqimizda',
    products: 'Mahsulotlar',
    partners: 'Hamkorlar',
    contact: "Bog'lanish",
    language: 'Til',
    menu: 'Menyu',
    home: 'Bosh sahifa',
  },
  sections: {
    gallery: 'Fotogaleriya',
    news: 'Yangiliklar',
    products: 'Bizning mahsulotlarimiz',
    vacancies: 'Vakansiyalar',
    faq: "Tez-tez so'raladigan savollar",
    partners: 'Hamkorlarimiz',
    all: 'Barchasi',
    empty: "Hozircha ma'lumot yo'q.",
    back: 'Orqaga',
  },
  about: {
    title: 'Biz haqimizda',
    text: "“Yangiyer Flour Trading” MChJ mustaqil, oilaviy kompaniya hisoblanadi. 1991 yildan beri faoliyat yuritadi. Markaziy Osiyoning markazida joylashgan. “Yangiyer Flour Trading” MChJ birinchi navli undan ikkinchi va uchinchi navgacha eng sifatli bug'doy unini ishlab chiqarish va raqobatbardosh narxlarda hech kimdan kam bo'lmagan xizmat ko'rsatish uchun qurilgan. Ulgurji va ishlab chiqarish bozori sohasida 30 yildan ortiq tajribaga ega. Bizning xodimlarimiz o'zlarining tajriba va bilimlarini mijozlarga har kuni mahsulotni o'z vaqtida yetkazib berish uchun ishlatadilar.",
    watch: "Videoni ko'rish",
    close: 'Yopish',
  },
  gallery: { prev: 'Oldingi', next: 'Keyingi', close: 'Yopish' },
  contact: {
    title: "Bog'lanish",
    name: 'Ism',
    phone: 'Telefon raqam',
    email: 'Elektron pochta',
    message: 'Xabaringiz',
    send: 'XABAR YUBORISH',
    sending: 'YUBORILMOQDA…',
    success: "Rahmat! Xabaringiz yuborildi, tez orada siz bilan bog'lanamiz.",
    error: "Xabarni yuborib bo'lmadi. Iltimos, qayta urinib ko'ring yoki bizga qo'ng'iroq qiling.",
    again: 'Yana xabar yuborish',
  },
  footer: { rights: 'Barcha huquqlar himoyalangan.' },
};

export type Dictionary = typeof uz;

const ru: Dictionary = {
  brand: uz.brand,
  nav: {
    about: 'О нас',
    products: 'Продукты',
    partners: 'Партнёры',
    contact: 'Контакты',
    language: 'Язык',
    menu: 'Меню',
    home: 'Главная',
  },
  sections: {
    gallery: 'Фотогалерея',
    news: 'Новости',
    products: 'Наши продукты',
    vacancies: 'Вакансии',
    faq: 'Часто задаваемые вопросы',
    partners: 'Наши партнёры',
    all: 'Все',
    empty: 'Пока здесь ничего нет.',
    back: 'Назад',
  },
  about: {
    title: 'О нас',
    text: 'ООО «Yangiyer Flour Trading» — независимая семейная компания. Работает с 1991 года. Базируется в самом сердце Центральной Азии. Предприятие создано для производства пшеничной муки самого высокого качества — от первого до второго и третьего сорта — и предлагает непревзойдённый сервис по конкурентоспособным ценам. Более 30 лет опыта в оптовой торговле и производстве. Наши сотрудники используют свой опыт и знания, чтобы ежедневно и вовремя доставлять продукцию клиентам.',
    watch: 'Смотреть видео',
    close: 'Закрыть',
  },
  gallery: { prev: 'Предыдущее', next: 'Следующее', close: 'Закрыть' },
  contact: {
    title: 'Контакты',
    name: 'Имя',
    phone: 'Номер телефона',
    email: 'Электронная почта',
    message: 'Ваше сообщение',
    send: 'ОТПРАВИТЬ СООБЩЕНИЕ',
    sending: 'ОТПРАВКА…',
    success: 'Спасибо! Сообщение отправлено, мы скоро с вами свяжемся.',
    error: 'Не удалось отправить сообщение. Попробуйте ещё раз или позвоните нам.',
    again: 'Отправить ещё',
  },
  footer: { rights: 'Все права защищены.' },
};

const en: Dictionary = {
  brand: uz.brand,
  nav: {
    about: 'About us',
    products: 'Products',
    partners: 'Partners',
    contact: 'Contact us',
    language: 'Language',
    menu: 'Menu',
    home: 'Home',
  },
  sections: {
    gallery: 'Photo gallery',
    news: 'News',
    products: 'Our products',
    vacancies: 'Vacancies',
    faq: 'Frequently asked questions',
    partners: 'Our partners',
    all: 'All',
    empty: 'Nothing here yet.',
    back: 'Back',
  },
  about: {
    title: 'About us',
    text: 'LLC Yangiyer Flour Trading is an independent, family-owned company operating since 1991 and based in the heart of Central Asia. It was purpose-built to produce the best quality wheat flour — from first grade to second and third grade — and to offer a service second to none at very competitive prices. With over 30 years of experience in the wholesale and production market, our staff use their experience and knowledge to help customers receive their deliveries on time, every day.',
    watch: 'Watch video',
    close: 'Close',
  },
  gallery: { prev: 'Previous', next: 'Next', close: 'Close' },
  contact: {
    title: 'Contact us',
    name: 'Name',
    phone: 'Phone number',
    email: 'Email',
    message: 'Your message',
    send: 'SEND MESSAGE',
    sending: 'SENDING…',
    success: 'Thank you! Your message has been sent — we will contact you shortly.',
    error: 'Could not send your message. Please try again or give us a call.',
    again: 'Send another message',
  },
  footer: { rights: 'All rights reserved.' },
};

const fa: Dictionary = {
  brand: uz.brand,
  nav: {
    about: 'درباره ما',
    products: 'محصولات',
    partners: 'شرکا',
    contact: 'با ما تماس بگیرید',
    language: 'زبان',
    menu: 'منو',
    home: 'صفحه اصلی',
  },
  sections: {
    gallery: 'گالری عکس',
    news: 'اخبار',
    products: 'محصولات ما',
    vacancies: 'فرصت‌های شغلی',
    faq: 'سوالات متداول',
    partners: 'شرکای ما',
    all: 'همه',
    empty: 'هنوز موردی وجود ندارد.',
    back: 'بازگشت',
  },
  about: {
    title: 'درباره ما',
    text: 'شرکت Yangiyer Flour Trading یک شرکت مستقل و خانوادگی است که از سال ۱۹۹۱ فعالیت می‌کند و در قلب آسیای مرکزی مستقر است. این شرکت با هدف تولید آرد گندم با بهترین کیفیت، از آرد درجه یک تا درجه دو و سه، و ارائه خدماتی بی‌نظیر با قیمت‌های رقابتی ساخته شده است. با بیش از ۳۰ سال تجربه در بازار عمده‌فروشی و تولید، کارکنان ما از تجربه و دانش خود برای تحویل به‌موقع محصولات به مشتریان در هر روز استفاده می‌کنند.',
    watch: 'تماشای ویدیو',
    close: 'بستن',
  },
  gallery: { prev: 'قبلی', next: 'بعدی', close: 'بستن' },
  contact: {
    title: 'با ما تماس بگیرید',
    name: 'نام',
    phone: 'شماره تلفن',
    email: 'پست الکترونیک',
    message: 'پیام شما',
    send: 'پیام فرستادن',
    sending: 'در حال ارسال…',
    success: 'سپاس! پیام شما ارسال شد، به‌زودی با شما تماس می‌گیریم.',
    error: 'ارسال پیام ممکن نشد. لطفاً دوباره تلاش کنید یا با ما تماس بگیرید.',
    again: 'ارسال پیام دیگر',
  },
  footer: { rights: 'تمامی حقوق محفوظ است.' },
};

export const dictionaries: Record<Locale, Dictionary> = { uz, ru, en, fa };

/** Localized field from a backend row: pickLocalized(row, 'title', 'ru') → row.titleRu (falls back to Uz). */
export const pickLocalized = (row: object, field: string, locale: Locale): string => {
  const r = row as Record<string, unknown>;
  const suffix = locale.charAt(0).toUpperCase() + locale.slice(1);
  const value = r[`${field}${suffix}`] || r[`${field}Uz`];
  return typeof value === 'string' ? value : '';
};

export const formatDate = (iso: string, locale: Locale) => {
  const tag = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB', fa: 'fa-IR' }[locale];
  try {
    return new Intl.DateTimeFormat(tag, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
};
