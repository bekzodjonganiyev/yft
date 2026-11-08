export type Locale = 'uz' | 'ru' | 'en' | 'ar';

export interface Translations {
  nav: {
    home: string;
    about: string;
    products: string;
    calculator: string;
    gallery: string;
    partners: string;
    contact: string;
    quoteBtn: string;
    adminLink: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    ctaCatalog: string;
    ctaQuote: string;
    statsYears: string;
    statsYearsDesc: string;
    statsCapacity: string;
    statsCapacityDesc: string;
    statsGrain: string;
    statsGrainDesc: string;
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    story: string;
    story2: string;
    watchVideo: string;
    closeVideo: string;
    milestone1Year: string;
    milestone1Title: string;
    milestone1Desc: string;
    milestone2Year: string;
    milestone2Title: string;
    milestone2Desc: string;
    milestone3Year: string;
    milestone3Title: string;
    milestone3Desc: string;
    milestone4Year: string;
    milestone4Title: string;
    milestone4Desc: string;
  };
  products: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterPremium: string;
    filterFirst: string;
    filterSecond: string;
    filterBran: string;
    glutenLabel: string;
    ashLabel: string;
    moistureLabel: string;
    packagingLabel: string;
    usesLabel: string;
    orderBtn: string;
  };
  calculator: {
    badge: string;
    title: string;
    subtitle: string;
    prompt: string;
    industryBakery: string;
    industryPastry: string;
    industryPasta: string;
    industryHome: string;
    recommended: string;
    idealChoice: string;
  };
  gallery: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterProduction: string;
    filterLab: string;
    filterFactory: string;
    closeModal: string;
  };
  partners: {
    badge: string;
    title: string;
    subtitle: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    formTitle: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    emailPlaceholder: string;
    productSelectPlaceholder: string;
    quantityPlaceholder: string;
    messagePlaceholder: string;
    submitBtn: string;
    submitting: string;
    successMessage: string;
    directContactTitle: string;
    addressLabel: string;
    addressVal: string;
    phoneLabel: string;
    phoneVal: string;
    emailLabel: string;
    emailVal: string;
    hoursLabel: string;
    hoursVal: string;
  };
  footer: {
    aboutText: string;
    quickLinks: string;
    contacts: string;
    rights: string;
  };
}

export const translations: Record<Locale, Translations> = {
  uz: {
    nav: {
      home: 'Bosh sahifa',
      about: 'Biz haqimizda',
      products: 'Mahsulotlar',
      calculator: 'Un tanlash',
      gallery: 'Galereya',
      partners: 'Hamkorlar',
      contact: 'Bog\'lanish',
      quoteBtn: 'Narx so\'rovi',
      adminLink: 'Admin panel',
    },
    hero: {
      badge: '1991-yildan buyon ishonchli don va un ishlab chiqaruvchi',
      titleLine1: 'Yangiyer Flour Trading',
      titleLine2: 'Oliy Sifatli Bug\'doy Uni',
      description: 'Markaziy Osiyoning markazida 30 yildan ortiq vaqt mobaynida sara bug\'doy navlaridan jahon andozalariga mos, tabiiy va kleykovinaga boy un mahsulotlarini ishlab chiqarib kelmoqdamiz.',
      ctaCatalog: 'Mahsulotlar katalogi',
      ctaQuote: 'Ulgurji taklif olish',
      statsYears: '33+ yil',
      statsYearsDesc: 'Bozorda ishonchli tajriba',
      statsCapacity: '300 tonna/kun',
      statsCapacityDesc: 'Tegirmon maydalash quvvati',
      statsGrain: '100% tabiiy',
      statsGrainDesc: 'Tozalangan saralangan don',
    },
    about: {
      badge: 'Kompaniya tarixi va qadriyatlari',
      title: 'Tarix, zamonaviy texnologiya va sifat uyg\'unligi',
      subtitle: 'LLP “Yangiyer Flour Trading” — oilaviy an\'analar va zamonaviy Shveytsariya tegirmon texnologiyalarini birlashtirgan mustaqil sanoat korxonasi.',
      story: 'Kompaniyamiz 1991-yilda O‘zbekiston Respublikasi, Sirdaryo viloyatining Yangiyer shahrida tashkil etilgan. Bosh masadimiz — xalqimiz dasturxoniga eng to‘yimli, oq va kleykovinaga boy bug‘doy unini yetkazib berish hamda qandolatchilik va novvoychilik sexlariga doimiy bir maromdagi yuqori sifat kafolatini taqdim etishdir.',
      story2: 'Bugungi kunda zavodimiz to‘liq avtomatlashtirilgan ko‘p bosqichli tozalash, namlash va maydalash agregatlari bilan jihozlangan. Har bir partiya o‘z akkreditatsiyadan o‘tgan zamonaviy laboratoriyamizda qat\'iy sinovdan o‘tkaziladi.',
      watchVideo: 'Korxona videosini tomosha qilish',
      closeVideo: 'Yopish',
      milestone1Year: '1991',
      milestone1Title: 'Korxona tashkil etilishi',
      milestone1Desc: 'Sirdaryo viloyatida dastlabki tegirmon liniyasi ishga tushirildi.',
      milestone2Year: '2005',
      milestone2Title: 'Ishlab chiqarishni kengaytirish',
      milestone2Desc: 'Elevator va yirik don saqlash siloslari bunyod etildi.',
      milestone3Year: '2018',
      milestone3Title: 'Zamonaviy texnologik yangilanish',
      milestone3Desc: 'Yevropa standartidagi avtomatlashtirilgan tegirmon uskunalari o‘rnatildi.',
      milestone4Year: '2024+',
      milestone4Title: 'Mintaqaviy eksport yetakchisi',
      milestone4Desc: 'O‘zbekiston bo‘ylab va qo‘shni davlatlarga barqaror un yetkazib berish tizimi.',
    },
    products: {
      badge: 'Mahsulotlar assortimenti',
      title: 'Har bir pishiriq turi uchun maxsus un navlari',
      subtitle: 'Tandir nonlaridan tortib, nozik qandolat va makaron mahsulotlarigacha — barcha talablarga javob beradigan barqaror sifat.',
      filterAll: 'Barchasi',
      filterPremium: 'Oliy Nav (Premium)',
      filterFirst: '1-Nav (Birinchi Nav)',
      filterSecond: '2-Nav (Ikkinchi Nav)',
      filterBran: 'Bug\'doy Kepagi',
      glutenLabel: 'Kleykovina (Gluten):',
      ashLabel: 'Kul miqdori (Ash):',
      moistureLabel: 'Namlik (Moisture):',
      packagingLabel: 'Qadoqlash:',
      usesLabel: 'Tavsiya etilgan qo\'llanilishi:',
      orderBtn: 'Buyurtma va Narx so\'rovi',
    },
    calculator: {
      badge: 'Interaktiv Yo\'riqnoma',
      title: 'Sizning faoliyatingiz uchun qaysi un navi mos keladi?',
      subtitle: 'Quyidagi sohalardan birini tanlang va tegishli kleykovina hamda texnik ko\'rsatkichlarga ega unni aniqlang.',
      prompt: 'Siz qanday mahsulot ishlab chiqarasiz?',
      industryBakery: 'Non va Tandir non sexlari',
      industryPastry: 'Qandolat va Shirinliklar',
      industryPasta: 'Makaron va Xamir mahsulotlari',
      industryHome: 'Uy ro\'zg\'or va Umumiy ovqatlanish',
      recommended: 'Tavsiya etilayotgan mahsulot:',
      idealChoice: 'Ushbu nav xamirning yopishqoqligi, ko\'tarilishi va tayyor mahsulotning yumshoq chiqishi uchun ideal ko\'rsatkichlarga ega.',
    },
    gallery: {
      badge: 'Foto lavhalar',
      title: 'Ishlab chiqarish jarayoni va tegirmon kompleksi',
      subtitle: 'Yangiyer korxonasining zamonaviy texnologiyalari, laboratoriyasi va tayyor mahsulot omborlari.',
      filterAll: 'Barchasi',
      filterProduction: 'Tegirmon sexlari',
      filterLab: 'Laboratoriya',
      filterFactory: 'Ombor va Yuklash',
      closeModal: 'Yopish',
    },
    partners: {
      badge: 'Ishonchli Hamkorlik',
      title: 'Bizga ishonch bildirgan yirik kompaniyalar',
      subtitle: 'O‘zbekiston va Markaziy Osiyo bozorida o‘nlab yillik barqaror hamkorlik.',
    },
    contact: {
      badge: 'Bog\'lanish va Ulgurji Buyurtma',
      title: 'Tijorat taklifi yoki buyurtma berish uchun aloqaga chiqing',
      subtitle: 'Mutaxassislarimiz 30 daqiqa ichida narxlar va yetkazib berish shartlari bo‘yicha to‘liq ma\'lumot berishadi.',
      formTitle: 'Onlayn murojaat qoldirish',
      namePlaceholder: 'To‘liq ismingiz / Tashkilot nomi *',
      phonePlaceholder: 'Telefon raqamingiz (+998) *',
      emailPlaceholder: 'Elektron pochta manzilingiz',
      productSelectPlaceholder: 'Qiziqtirayotgan un navi',
      quantityPlaceholder: 'Kutilayotgan hajm (masalan: 10 tonna yoki 200 qop)',
      messagePlaceholder: 'Buyurtma yoki savolingiz bo‘yicha qo‘shimcha ma\'lumot *',
      submitBtn: 'Xabarni Yuborish',
      submitting: 'Yuborilmoqda...',
      successMessage: 'Murojaatingiz muvaffaqiyatli qabul qilindi! Tez orada mutaxassislarimiz siz bilan bog‘lanishadi.',
      directContactTitle: 'To‘g‘ridan-to‘g‘ri aloqa',
      addressLabel: 'Bosh korxona manzili:',
      addressVal: 'O‘zbekiston Respublikasi, Sirdaryo viloyati, Yangiyer shahri, Sanoat rayoni',
      phoneLabel: 'Bog‘lanish telefonlari:',
      phoneVal: '+998 71 875 64 56 / +998 90 123 45 67',
      emailLabel: 'Elektron pochta:',
      emailVal: 'Yangiyerflour@gmail.com',
      hoursLabel: 'Ish tartibi:',
      hoursVal: 'Dushanba - Shanba: 08:30 - 18:00 (Yakshanba: dam olish)',
    },
    footer: {
      aboutText: 'LLP “Yangiyer Flour Trading” — 1991-yildan buyon yuqori sifatli bug‘doy unini ishlab chiqaruvchi ishonchli milliy brend.',
      quickLinks: 'Tezkor havolalar',
      contacts: 'Aloqa ma\'lumotlari',
      rights: 'Barcha huquqlar himoyalangan.',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'О компании',
      products: 'Продукция',
      calculator: 'Подбор муки',
      gallery: 'Галерея',
      partners: 'Партнеры',
      contact: 'Контакты',
      quoteBtn: 'Запрос цен',
      adminLink: 'Панель админа',
    },
    hero: {
      badge: 'Надежный производитель зерна и муки с 1991 года',
      titleLine1: 'Yangiyer Flour Trading',
      titleLine2: 'Пшеничная Мука Высшего Качества',
      description: 'Более 30 лет в сердце Центральной Азии мы производим натуральную, богатую клейковиной пшеничную муку из отборных сортов зерна по мировым стандартам.',
      ctaCatalog: 'Каталог продукции',
      ctaQuote: 'Оптовое предложение',
      statsYears: '33+ года',
      statsYearsDesc: 'Безупречной репутации на рынке',
      statsCapacity: '300 тонн/день',
      statsCapacityDesc: 'Мощность мукомольного помола',
      statsGrain: '100% зерно',
      statsGrainDesc: 'Строгий входной контроль качества',
    },
    about: {
      badge: 'История и принципы',
      title: 'Гармония традиций, технологий и бескомпромиссного качества',
      subtitle: 'СП ООО «Yangiyer Flour Trading» — семейное предприятие с современными швейцарскими мукомольными линиями.',
      story: 'Предприятие основано в 1991 году в городе Янгиер Сырдарьинской области. Наша цель — поставлять потребителям самую питательную, белоснежную муку с идеальной клейковиной, гарантируя стабильность хлебопекарным и кондитерским комбинатам.',
      story2: 'Завод оснащен полностью автоматизированными комплексами очистки, гидротермической обработки и помола. Каждая партия муки сертифицируется в собственной аккредитованной лаборатории.',
      watchVideo: 'Смотреть видео о заводе',
      closeVideo: 'Закрыть',
      milestone1Year: '1991',
      milestone1Title: 'Основание завода',
      milestone1Desc: 'Запуск первой мельничной линии в Сырдарьинской области.',
      milestone2Year: '2005',
      milestone2Title: 'Масштабирование',
      milestone2Desc: 'Строительство современного элеватора и зернохранилищ.',
      milestone3Year: '2018',
      milestone3Title: 'Модернизация оборудования',
      milestone3Desc: 'Внедрение европейских автоматизированных мельничных комплексов.',
      milestone4Year: '2024+',
      milestone4Title: 'Региональный экспорт',
      milestone4Desc: 'Надежные поставки по всему Узбекистану и в страны СНГ.',
    },
    products: {
      badge: 'Ассортимент продукции',
      title: 'Специализированные сорта муки для любых задач',
      subtitle: 'От традиционных тандырных лепешек до изысканных кондитерских шедевров и макаронных изделий.',
      filterAll: 'Все',
      filterPremium: 'Высший сорт (Премиум)',
      filterFirst: 'Первый сорт',
      filterSecond: 'Второй сорт',
      filterBran: 'Отруби пшеничные',
      glutenLabel: 'Клейковина (Gluten):',
      ashLabel: 'Зольность (Ash):',
      moistureLabel: 'Влажность (Moisture):',
      packagingLabel: 'Фасовка:',
      usesLabel: 'Рекомендуемое применение:',
      orderBtn: 'Заказать / Узнать цену',
    },
    calculator: {
      badge: 'Интерактивный помощник',
      title: 'Какой сорт муки лучше подходит для вашего бизнеса?',
      subtitle: 'Выберите направление вашего производства для получения точных технических рекомендаций.',
      prompt: 'Какую продукцию вы производите?',
      industryBakery: 'Пекарни и тандырные лепешки',
      industryPastry: 'Кондитерские изделия и торты',
      industryPasta: 'Макаронные изделия и полуфабрикаты',
      industryHome: 'HoReCa и домашняя кулинария',
      recommended: 'Рекомендуемый сорт:',
      idealChoice: 'Обеспечивает идеальный подъем теста, эластичность мякиша и великолепную хрустящую корочку.',
    },
    gallery: {
      badge: 'Фотогалерея',
      title: 'Производственный комплекс и технологии помола',
      subtitle: 'Фотографии наших цехов, лаборатории контроля качества и складских логистических зон.',
      filterAll: 'Все',
      filterProduction: 'Мельничный цех',
      filterLab: 'Лаборатория',
      filterFactory: 'Склад и логистика',
      closeModal: 'Закрыть',
    },
    partners: {
      badge: 'Надежное партнерство',
      title: 'Компании, которые выбирают нашу продукцию',
      subtitle: 'Многолетнее взаимовыгодное сотрудничество на рынке Центральной Азии.',
    },
    contact: {
      badge: 'Контакты и Оптовые Заказы',
      title: 'Свяжитесь с нами для получения коммерческого предложения',
      subtitle: 'Наши специалисты свяжутся с вами в течение 30 минут с расчетом стоимости и условий поставки.',
      formTitle: 'Отправить онлайн-заявку',
      namePlaceholder: 'Ваше имя / Название компании *',
      phonePlaceholder: 'Номер телефона (+998) *',
      emailPlaceholder: 'Электронная почта',
      productSelectPlaceholder: 'Интересующий сорт муки',
      quantityPlaceholder: 'Планируемый объем (например: 20 тонн)',
      messagePlaceholder: 'Детали заявки или ваши вопросы *',
      submitBtn: 'Отправить заявку',
      submitting: 'Отправка...',
      successMessage: 'Заявка успешно отправлена! Менеджер свяжется с вами в ближайшее время.',
      directContactTitle: 'Прямые контакты',
      addressLabel: 'Адрес головного завода:',
      addressVal: 'Республика Узбекистан, Сырдарьинская область, г. Янгиер, Промышленная зона',
      phoneLabel: 'Телефоны отдела продаж:',
      phoneVal: '+998 71 875 64 56 / +998 90 123 45 67',
      emailLabel: 'Электронная почта:',
      emailVal: 'Yangiyerflour@gmail.com',
      hoursLabel: 'График работы:',
      hoursVal: 'Понедельник - Суббота: 08:30 - 18:00',
    },
    footer: {
      aboutText: 'СП ООО «Yangiyer Flour Trading» — надежный национальный производитель высококачественной пшеничной муки с 1991 года.',
      quickLinks: 'Разделы сайта',
      contacts: 'Контактные данные',
      rights: 'Все права защищены.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      products: 'Products',
      calculator: 'Flour Guide',
      gallery: 'Gallery',
      partners: 'Partners',
      contact: 'Contact',
      quoteBtn: 'Get a Quote',
      adminLink: 'Admin Portal',
    },
    hero: {
      badge: 'Trusted Grain & Flour Producer Since 1991',
      titleLine1: 'Yangiyer Flour Trading',
      titleLine2: 'Premium Quality Wheat Flour',
      description: 'For over 30 years in the heart of Central Asia, we have milled premium, gluten-rich wheat flour from selected grain varieties in full compliance with international standards.',
      ctaCatalog: 'Product Catalog',
      ctaQuote: 'Request Wholesale Quote',
      statsYears: '33+ Years',
      statsYearsDesc: 'Proven Market Excellence',
      statsCapacity: '300 Tons/Day',
      statsCapacityDesc: 'Milling Capacity',
      statsGrain: '100% Grain',
      statsGrainDesc: 'Certified Natural Wheat',
    },
    about: {
      badge: 'Heritage & Vision',
      title: 'Milling Heritage Meets Modern Precision',
      subtitle: 'LLP “Yangiyer Flour Trading” is an independent enterprise blending family values with modern Swiss milling technology.',
      story: 'Founded in 1991 in Yangiyer, Sirdaryo region, our mission is to deliver pure, nutrient-dense, white wheat flour with superior gluten performance to industrial bakeries and pastry manufacturers.',
      story2: 'Our milling complex features fully automated grain cleaning, dampening, and milling stages. Every batch undergoes strict testing in our on-site certified laboratory.',
      watchVideo: 'Watch Factory Video Tour',
      closeVideo: 'Close',
      milestone1Year: '1991',
      milestone1Title: 'Company Founded',
      milestone1Desc: 'First commercial milling line launched in Sirdaryo.',
      milestone2Year: '2005',
      milestone2Title: 'Storage Scale-Up',
      milestone2Desc: 'State-of-the-art grain silos and elevator commissioned.',
      milestone3Year: '2018',
      milestone3Title: 'Technology Overhaul',
      milestone3Desc: 'Automated European milling machinery installed.',
      milestone4Year: '2024+',
      milestone4Title: 'Regional Export Hub',
      milestone4Desc: 'Seamless supply chains across Central Asia and beyond.',
    },
    products: {
      badge: 'Our Product Range',
      title: 'Tailored Flour Grades for Every Culinary Requirement',
      subtitle: 'From artisan hearth breads and tandoori flatbreads to delicate pastries and pasta production.',
      filterAll: 'All Products',
      filterPremium: 'Premium Grade',
      filterFirst: 'First Grade',
      filterSecond: 'Second Grade',
      filterBran: 'Wheat Bran',
      glutenLabel: 'Gluten Content:',
      ashLabel: 'Ash Content:',
      moistureLabel: 'Moisture:',
      packagingLabel: 'Packaging:',
      usesLabel: 'Recommended Applications:',
      orderBtn: 'Order / Request Quote',
    },
    calculator: {
      badge: 'Interactive Recommender',
      title: 'Which Flour Grade Best Fits Your Business?',
      subtitle: 'Select your production type below to identify the exact flour specifications for your recipes.',
      prompt: 'What kind of goods do you produce?',
      industryBakery: 'Bakeries & Traditional Flatbreads',
      industryPastry: 'Fine Confectionery & Pastry',
      industryPasta: 'Pasta & Noodles Manufacturing',
      industryHome: 'Food Service & Everyday Kitchen',
      recommended: 'Recommended Flour Grade:',
      idealChoice: 'Provides optimal dough elasticity, stable fermentation, and a golden, appetizing crust.',
    },
    gallery: {
      badge: 'Factory Visuals',
      title: 'Inside Our Modern Milling Complex',
      subtitle: 'Take a look inside our high-capacity roller mills, quality control laboratory, and shipping facilities.',
      filterAll: 'All Photos',
      filterProduction: 'Milling Lines',
      filterLab: 'Laboratory',
      filterFactory: 'Warehouse & Shipping',
      closeModal: 'Close',
    },
    partners: {
      badge: 'Trusted Collaborations',
      title: 'Industry Leaders Who Rely on Our Flour',
      subtitle: 'Decades of dependable supply to wholesale distributors and bakery chains.',
    },
    contact: {
      badge: 'Get in Touch',
      title: 'Request a Quote or Partnership Inquiry',
      subtitle: 'Our commercial team will respond within 30 minutes with pricing and delivery terms.',
      formTitle: 'Submit Online Inquiry',
      namePlaceholder: 'Full Name / Company Name *',
      phonePlaceholder: 'Phone Number (+998) *',
      emailPlaceholder: 'Email Address',
      productSelectPlaceholder: 'Flour grade of interest',
      quantityPlaceholder: 'Expected volume (e.g. 20 metric tons)',
      messagePlaceholder: 'Order details or inquiries *',
      submitBtn: 'Send Inquiry',
      submitting: 'Sending...',
      successMessage: 'Your inquiry has been received! Our sales representative will contact you shortly.',
      directContactTitle: 'Direct Office Contacts',
      addressLabel: 'Main Factory Address:',
      addressVal: 'Yangiyer Industrial District, Sirdaryo Region, Republic of Uzbekistan',
      phoneLabel: 'Sales & Support:',
      phoneVal: '+998 71 875 64 56 / +998 90 123 45 67',
      emailLabel: 'Official Email:',
      emailVal: 'Yangiyerflour@gmail.com',
      hoursLabel: 'Operating Hours:',
      hoursVal: 'Monday - Saturday: 08:30 - 18:00',
    },
    footer: {
      aboutText: 'LLP “Yangiyer Flour Trading” has been a premier wheat flour milling brand in Central Asia since 1991.',
      quickLinks: 'Navigation',
      contacts: 'Contact Info',
      rights: 'All rights reserved.',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      products: 'منتجاتنا',
      calculator: 'دليل الدقيق',
      gallery: 'معرض الصور',
      partners: 'شركاؤنا',
      contact: 'اتصل بنا',
      quoteBtn: 'طلب عرض أسعار',
      adminLink: 'لوحة التحكم',
    },
    hero: {
      badge: 'منتج موثوق للحبوب والدقيق منذ عام 1991',
      titleLine1: 'يانغير لتجارة الدقيق',
      titleLine2: 'دقيق قمح عالي الجودة',
      description: 'لأكثر من 30 عاماً في قلب آسيا الوسطى، ننتج أجود أنواع دقيق القمح الغني بالغلوتين الطبيعي وفقاً لأعلى المعايير الدولية.',
      ctaCatalog: 'كتالوج المنتجات',
      ctaQuote: 'طلب أسعار الجملة',
      statsYears: '+33 عاماً',
      statsYearsDesc: 'من الخبرة والتميز في السوق',
      statsCapacity: '300 طن/يوم',
      statsCapacityDesc: 'طاقة المطاحن الإنتاجية',
      statsGrain: '%100 طبيعي',
      statsGrainDesc: 'قمح نقي مختار بعناية',
    },
    about: {
      badge: 'تاريخنا وقيمنا',
      title: 'أصالة المطاحن مع أحدث التقنيات السويسرية',
      subtitle: 'شركة يانغير لتجارة الدقيق مؤسسة صناعية تجمع بين التقاليد الراسخة وأحدث خطوط الطحن العالمية.',
      story: 'تأسست شركتنا عام 1991 في مدينة يانغير بمحافظة سيرداريا. هدفنا الأساسي هو تزويد المخابز والمصانع بأفضل أنواع دقيق القمح المتماسك والغني بالعناصر الغذائية.',
      story2: 'تم تجهيز مطاحننا بأحدث معدات التنظيف والمعالجة والطحن الآلية بالكامل، مع فحص دوري في مختبراتنا المعتمدة.',
      watchVideo: 'شاهد فيديو المصنع',
      closeVideo: 'إغلاق',
      milestone1Year: '1991',
      milestone1Title: 'تأسيس الشركة',
      milestone1Desc: 'بدء تشغيل أول خط مطاحن في منطقة سيرداريا.',
      milestone2Year: '2005',
      milestone2Title: 'توسيع التخزين',
      milestone2Desc: 'بناء صوامع حديثة لتخزين وتبريد الحبوب.',
      milestone3Year: '2018',
      milestone3Title: 'التحديث التكنولوجي',
      milestone3Desc: 'تركيب أحدث معدات الطحن الأوروبية المؤتمتة.',
      milestone4Year: '+2024',
      milestone4Title: 'ريادة التصدير الإقليمي',
      milestone4Desc: 'توريد مستدام عبر دول آسيا الوسطى وخارجها.',
    },
    products: {
      badge: 'تشكيلة المنتجات',
      title: 'أصناف دقيق مخصصة لجميع احتياجات المخابز والحلويات',
      subtitle: 'من الخبز التقليدي إلى المخبوزات الفاخرة والمعكرونة بجودة استثنائية.',
      filterAll: 'الكل',
      filterPremium: 'الدرجة الممتازة',
      filterFirst: 'الدرجة الأولى',
      filterSecond: 'الدرجة الثانية',
      filterBran: 'نخالة القمح',
      glutenLabel: 'نسبة الغلوتين:',
      ashLabel: 'نسبة الرماد:',
      moistureLabel: 'الرطوبة:',
      packagingLabel: 'التعبئة والتغليف:',
      usesLabel: 'الاستخدامات الموصى بها:',
      orderBtn: 'طلب كميات / استفسار عن الأسعار',
    },
    calculator: {
      badge: 'دليل تفاعلي',
      title: 'أي نوع من الدقيق يناسب احتياجات نشاطك التجاري؟',
      subtitle: 'حدد نوع منتجاتك للحصول على المواصفات الدقيقة للدقيق المثالي.',
      prompt: 'ما هي المنتجات التي تقوم بتصنيعها؟',
      industryBakery: 'المخابز والخبز التقليدي',
      industryPastry: 'الحلويات والكعك الفاخر',
      industryPasta: 'المعكرونة والعجائن',
      industryHome: 'المطاعم والاستخدام المنزلي',
      recommended: 'النوع الموصى به:',
      idealChoice: 'يمنح العجين مرونة ممتازة وانتفاخاً مثالياً وقواماً شهياً.',
    },
    gallery: {
      badge: 'معرض الصور',
      title: 'جولة داخل مجمع مطاحن يانغير الحديث',
      subtitle: 'صور توضح خطوط الطحن المتقدمة والمختبر ومستودعات التوزيع.',
      filterAll: 'الكل',
      filterProduction: 'عنابر الطحن',
      filterLab: 'مختبر الجودة',
      filterFactory: 'المستودعات والشحن',
      closeModal: 'إغلاق',
    },
    partners: {
      badge: 'شراكات موثوقة',
      title: 'كبرى الشركات التي تعتمد على منتجاتنا',
      subtitle: 'عقود من التوريد المنتظم والموثوق في أسواق المنطقة.',
    },
    contact: {
      badge: 'اتصل بنا والطلبات بالجملة',
      title: 'تواصل معنا للحصول على عرض أسعار أو بدء الشراكة',
      subtitle: 'سيقوم فريق المبيعات بالرد عليكم خلال 30 دقيقة بكافة التفاصيل.',
      formTitle: 'إرسال طلب إلكتروني',
      namePlaceholder: 'الاسم الكامل / اسم الشركة *',
      phonePlaceholder: 'رقم الهاتف (+998) *',
      emailPlaceholder: 'البريد الإلكتروني',
      productSelectPlaceholder: 'نوع الدقيق المطلوب',
      quantityPlaceholder: 'الكمية المتوقعة (مثلاً: 20 طن)',
      messagePlaceholder: 'تفاصيل الطلب أو الاستفسار *',
      submitBtn: 'إرسال الطلب',
      submitting: 'جارِ الإرسال...',
      successMessage: 'تم استلام طلبكم بنجاح! سيتصل بكم ممثل المبيعات قريباً.',
      directContactTitle: 'معلومات الاتصال المباشر',
      addressLabel: 'عنوان المصنع الرئيسي:',
      addressVal: 'جمهورية أوزبكستان، محافظة سيرداريا، مدينة يانغير، المنطقة الصناعية',
      phoneLabel: 'أرقام قسم المبيعات:',
      phoneVal: '+998 71 875 64 56 / +998 90 123 45 67',
      emailLabel: 'البريد الإلكتروني:',
      emailVal: 'Yangiyerflour@gmail.com',
      hoursLabel: 'ساعات العمل:',
      hoursVal: 'من الإثنين إلى السبت: 08:30 - 18:00',
    },
    footer: {
      aboutText: 'شركة يانغير لتجارة الدقيق — علامة تجارية رائدة في صناعة دقيق القمح الفاخر منذ 1991.',
      quickLinks: 'روابط سريعة',
      contacts: 'بيانات التواصل',
      rights: 'جميع الحقوق محفوظة.',
    },
  },
};
