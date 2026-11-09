// Copy comes from the master-branch frontend (src/assets/locales/*/translation.json),
// with the obvious mistakes fixed and the keys the new contact form needs added.

export type Locale = 'uz' | 'ru' | 'en' | 'ar';
export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'uz', label: 'Uz' },
  { code: 'ru', label: 'Ru' },
  { code: 'en', label: 'En' },
  { code: 'ar', label: 'Ar' },
];

const uz = {
  brand: { name: 'YANGIYER FLOUR', name2: 'TRADING' },
  nav: {
    about: 'Biz haqimizda',
    products: 'Mahsulotlar',
    gallery: 'Galereya',
    partners: 'Hamkorlar',
    contact: "Bog'lanish",
    language: 'Til',
    menu: 'Menyu',
  },
  top: { call: "Qo'ng'iroq qiling", email: 'Elektron pochta', hours: 'Ish vaqti' },
  about: {
    text: "“Yangiyer Flour Trading” MChJ mustaqil, oilaviy kompaniya hisoblanadi. 1991 yildan beri faoliyat yuritadi va Markaziy Osiyoning markazida joylashgan. Kompaniya oliy navdan ikkinchi va uchinchi navgacha eng sifatli bug'doy unini ishlab chiqarish hamda raqobatbardosh narxlarda hech kimdan kam bo'lmagan xizmat ko'rsatish uchun qurilgan. Ulgurji savdo va ishlab chiqarish sohasida 30 yildan ortiq tajribaga egamiz. Xodimlarimiz o'z tajriba va bilimlarini mijozlarga mahsulotni har kuni o'z vaqtida yetkazib berish uchun ishlatadilar.",
    watch: "Videoni ko'rish",
    close: 'Yopish',
  },
  products: { title: 'Yangiyer flour', title2: 'trading brendlari', order: 'Buyurtma berish' },
  gallery: { title: 'Galereya', prev: 'Oldingi', next: 'Keyingi', close: 'Yopish' },
  partners: { title: 'Hamkorlar' },
  contact: {
    title: "Biz bilan bog'laning",
    name: 'Ism',
    phone: 'Telefon raqam',
    email: 'Elektron pochta',
    message: 'Xabaringiz',
    file: 'Fayl biriktirish (ixtiyoriy)',
    send: 'XABAR YUBORISH',
    sending: 'YUBORILMOQDA…',
    success: "Rahmat! Murojaatingiz qabul qilindi, tez orada siz bilan bog'lanamiz.",
    error: "Xabarni yuborib bo'lmadi. Iltimos, qayta urinib ko'ring yoki bizga qo'ng'iroq qiling.",
    again: 'Yana xabar yuborish',
  },
  footer: {
    address: 'Manzil: O‘zbekiston Respublikasi, Sirdaryo viloyati, Yangiyer shahri, sanoat rayoni',
    hours: 'Dush–Jum: 9:00 – 18:00',
    rights: 'Barcha huquqlar himoyalangan.',
  },
};

export type Dictionary = typeof uz;

const ru: Dictionary = {
  brand: uz.brand,
  nav: {
    about: 'О нас',
    products: 'Продукты',
    gallery: 'Галерея',
    partners: 'Партнёры',
    contact: 'Контакты',
    language: 'Язык',
    menu: 'Меню',
  },
  top: { call: 'Позвоните нам', email: 'Почта', hours: 'Время работы' },
  about: {
    text: 'ООО «Yangiyer Flour Trading» — независимая семейная компания. Работает с 1991 года и находится в самом сердце Центральной Азии. Предприятие создано для производства пшеничной муки самого высокого качества — от высшего до второго и третьего сорта — и предлагает непревзойдённый сервис по конкурентоспособным ценам. Более 30 лет опыта в оптовой торговле и производстве. Наши сотрудники используют свой опыт и знания, чтобы ежедневно и вовремя доставлять продукцию клиентам.',
    watch: 'Смотреть видео',
    close: 'Закрыть',
  },
  products: { title: 'Yangiyer flour', title2: 'trading бренды', order: 'Заказать' },
  gallery: { title: 'Галерея', prev: 'Предыдущее', next: 'Следующее', close: 'Закрыть' },
  partners: { title: 'Партнёры' },
  contact: {
    title: 'Свяжитесь с нами',
    name: 'Имя',
    phone: 'Номер телефона',
    email: 'Электронная почта',
    message: 'Ваше сообщение',
    file: 'Прикрепить файл (необязательно)',
    send: 'ОТПРАВИТЬ СООБЩЕНИЕ',
    sending: 'ОТПРАВКА…',
    success: 'Спасибо! Ваше обращение принято, мы скоро свяжемся с вами.',
    error: 'Не удалось отправить сообщение. Попробуйте ещё раз или позвоните нам.',
    again: 'Отправить ещё',
  },
  footer: {
    address: 'Адрес: Республика Узбекистан, Сырдарьинская область, город Янгиер, промзона',
    hours: 'Пн–Пт: 9:00 – 18:00',
    rights: 'Все права защищены.',
  },
};

const en: Dictionary = {
  brand: uz.brand,
  nav: {
    about: 'About us',
    products: 'Products',
    gallery: 'Gallery',
    partners: 'Partners',
    contact: 'Contact us',
    language: 'Language',
    menu: 'Menu',
  },
  top: { call: 'Call us', email: 'Email us', hours: 'Working hours' },
  about: {
    text: 'LLC Yangiyer Flour Trading is an independent, family-owned company operating since 1991 and based in the heart of Central Asia. The mill was purpose-built to produce the best quality wheat flour — from top grade to second and third grade — and to offer a service second to none at very competitive prices. With over 30 years of experience in the wholesale and production market, our staff use their knowledge to help customers receive their deliveries on time, every day.',
    watch: 'Watch video',
    close: 'Close',
  },
  products: { title: 'Yangiyer flour', title2: 'trading brands', order: 'Order' },
  gallery: { title: 'Gallery', prev: 'Previous', next: 'Next', close: 'Close' },
  partners: { title: 'Partners' },
  contact: {
    title: 'Contact us',
    name: 'Name',
    phone: 'Phone number',
    email: 'Email',
    message: 'Your message',
    file: 'Attach a file (optional)',
    send: 'SEND MESSAGE',
    sending: 'SENDING…',
    success: 'Thank you! Your message has been received — we will contact you shortly.',
    error: 'Could not send your message. Please try again or give us a call.',
    again: 'Send another message',
  },
  footer: {
    address: 'Address: Republic of Uzbekistan, Sirdaryo region, Yangiyer city, industrial area',
    hours: 'Mon–Fri: 9 am – 6 pm',
    rights: 'All rights reserved.',
  },
};

const ar: Dictionary = {
  brand: uz.brand,
  nav: {
    about: 'معلومات عنا',
    products: 'منتجات',
    gallery: 'معرض',
    partners: 'شركاء',
    contact: 'اتصل بنا',
    language: 'لغة',
    menu: 'القائمة',
  },
  top: { call: 'اتصل بنا', email: 'البريد الإلكتروني', hours: 'ساعات العمل' },
  about: {
    text: 'شركة يانجيير فلور تريدنج هي شركة عائلية مستقلة تعمل منذ عام 1991 ومقرها في قلب آسيا الوسطى. أُنشئت لإنتاج دقيق قمح عالي الجودة من الدرجة الأولى إلى الدرجتين الثانية والثالثة، وتقديم خدمة لا مثيل لها بأسعار تنافسية. مع أكثر من 30 عامًا من الخبرة في البيع بالجملة والإنتاج، يستخدم موظفونا خبراتهم لمساعدة العملاء على استلام طلباتهم في الوقت المحدد يوميًا.',
    watch: 'شاهد الفيديو',
    close: 'إغلاق',
  },
  products: { title: 'Yangiyer flour', title2: 'trading علامات', order: 'اطلب الآن' },
  gallery: { title: 'معرض', prev: 'السابق', next: 'التالي', close: 'إغلاق' },
  partners: { title: 'شركاء' },
  contact: {
    title: 'اتصل بنا',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    message: 'رسالتك',
    file: 'إرفاق ملف (اختياري)',
    send: 'أرسل رسالة',
    sending: 'جارٍ الإرسال…',
    success: 'شكرًا لك! تم استلام رسالتك وسنتواصل معك قريبًا.',
    error: 'تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى أو الاتصال بنا.',
    again: 'إرسال رسالة أخرى',
  },
  footer: {
    address: 'العنوان: جمهورية أوزبكستان، منطقة سيرداريو، مدينة يانجيير، المنطقة الصناعية',
    hours: 'الاثنين–الجمعة: 9:00 – 18:00',
    rights: 'جميع الحقوق محفوظة.',
  },
};

export const dictionaries: Record<Locale, Dictionary> = { uz, ru, en, ar };

/** Pick the localized field from a backend row: pick(row, 'title', 'ru') → row.titleRu */
export const pickLocalized = (row: Record<string, unknown>, field: string, locale: Locale): string => {
  const suffix = locale.charAt(0).toUpperCase() + locale.slice(1);
  const value = row[`${field}${suffix}`] || row[`${field}Uz`];
  return typeof value === 'string' ? value : '';
};
