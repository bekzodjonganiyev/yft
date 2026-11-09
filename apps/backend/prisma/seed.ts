import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin User
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yft.uz' },
    update: {},
    create: {
      name: 'YFT Administrator',
      email: 'admin@yft.uz',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`👤 Admin user ready: ${admin.email}`);

  // 2. Seed Products
  const products = [
    {
      titleUz: 'Oliy Navli Bug\'doy Uni (Premium)',
      titleRu: 'Мука Пшеничная Высший Сорт (Премиум)',
      titleEn: 'Premium Grade Wheat Flour',
      titleFa: 'آرد گندم درجه ممتاز',
      descUz: 'Eng sara qattiq va yumshoq bug\'doy navlaridan ishlab chiqarilgan oliy sifatli un. Non va pishiriqlar uchun ideal.',
      descRu: 'Высококачественная мука тонкого помола из отборных сортов пшеницы. Идеальна для пышной сдобной выпечки и кондитерских изделий.',
      descEn: 'Top-grade finely milled wheat flour from selected grain varieties. Perfect for fine pastry, cakes, and artisan bakery.',
      descFa: 'آرد گندم مرغوب و نرم از بهترین ارقام گندم؛ مناسب برای شیرینی‌پزی و نان‌های ممتاز.',
      category: 'FLOUR_PREMIUM',
      packaging: '50 kg, 25 kg, 10 kg, 5 kg',
      gluten: '28 - 30%',
      ash: '0.55%',
      moisture: '14.0%',
      imageUrl: '', // filled by `pnpm assets:import`
      isFeatured: true,
      order: 1,
    },
    {
      titleUz: '1-Navli Bug\'doy Uni (Birinchi Nav)',
      titleRu: 'Мука Пшеничная Первый Сорт',
      titleEn: 'First Grade Wheat Flour',
      titleFa: 'آرد گندم درجه یک',
      descUz: 'Kundalik non, tandir nonlari va qandolat mahsulotlari uchun eng talabgir, tarkibida kleykovina miqdori boy bo\'lgan un.',
      descRu: 'Самый востребованный сорт муки с высоким содержанием клейковины. Оптимально для традиционных лепешек и формового хлеба.',
      descEn: 'The most popular flour grade with optimal gluten content. Best for traditional flatbreads, baguettes, and sandwich bread.',
      descFa: 'پرطرفدارترین نوع آرد با گلوتن مناسب؛ ایده‌آل برای نان سنتی و نانوایی روزانه.',
      category: 'FLOUR_FIRST',
      packaging: '50 kg, 25 kg',
      gluten: '30 - 32%',
      ash: '0.75%',
      moisture: '14.5%',
      imageUrl: '', // filled by `pnpm assets:import`
      isFeatured: true,
      order: 2,
    },
    {
      titleUz: '2-Navli Bug\'doy Uni (Ikkinchi Nav)',
      titleRu: 'Мука Пшеничная Второй Сорт',
      titleEn: 'Second Grade Wheat Flour',
      titleFa: 'آرد گندم درجه دو',
      descUz: 'Foydali mikroelementlar va mineral moddalarga boy, quyuq xushbo\'y nonlar va parhezbop pishiriqlar uchun.',
      descRu: 'Богата клетчаткой, минеральными веществами и витаминами группы B. Отлично подходит для подового и диетического хлеба.',
      descEn: 'Rich in wheat fiber and natural minerals. Recommended for rustic hearth breads and healthy whole-grain dietary baking.',
      descFa: 'سرشار از فیبر و مواد معدنی طبیعی؛ مناسب برای نان‌های سبوس‌دار و رژیمی.',
      category: 'FLOUR_SECOND',
      packaging: '50 kg',
      gluten: '25 - 27%',
      ash: '1.25%',
      moisture: '14.5%',
      imageUrl: '', // filled by `pnpm assets:import`
      isFeatured: true,
      order: 3,
    },
    {
      titleUz: 'Bug\'doy Kepagi (Ozuqabop)',
      titleRu: 'Отруби Пшеничные Кормовые',
      titleEn: 'Wheat Bran (Fodder & Food Grade)',
      titleFa: 'سبوس گندم',
      descUz: 'Chorvachilik va parrandachilik xo\'jaliklari hamda sog\'lom oziq-ovqat sanoati uchun tozalangan bug\'doy kepagi.',
      descRu: 'Очищенные пшеничные отруби высокого качества для комбикормовой промышленности и здорового питания.',
      descEn: 'Cleaned quality wheat bran for compound feed manufacturing and dietary fiber food applications.',
      descFa: 'سبوس گندم تمیز و باکیفیت برای تولید خوراک دام و مواد غذایی پرفیبر.',
      category: 'BRAN',
      packaging: '25 kg, 20 kg',
      gluten: '-',
      ash: '5.0%',
      moisture: '13.5%',
      imageUrl: '', // filled by `pnpm assets:import`
      isFeatured: false,
      order: 4,
    },
  ];

  for (const prod of products) {
    const existing = await prisma.product.findFirst({ where: { titleUz: prod.titleUz } });
    if (!existing) {
      await prisma.product.create({ data: prod });
    }
  }
  console.log(`🌾 Seeded ${products.length} products`);

  // 3. Gallery photos are not seeded with stock images any more —
  //    run `pnpm --filter @yft/backend assets:import -- --source <master checkout>` to import the real ones.

  // 4. Seed Partners — no logos: the old backend.tkti.uz files are gone (502, never archived).
  //    The site shows the partner name until a logo is uploaded in the admin.
  const partners = [
    { name: 'O\'zdonmahsulot AK', logoUrl: '', websiteUrl: '#' },
    { name: 'Agro Industrial Holding', logoUrl: '', websiteUrl: '#' },
    { name: 'Central Asia Grain Export', logoUrl: '', websiteUrl: '#' },
    { name: 'Bukhara Bakery Group', logoUrl: '', websiteUrl: '#' },
    { name: 'Tashkent Mill Logistics', logoUrl: '', websiteUrl: '#' },
  ];

  for (const p of partners) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.partner.create({ data: p });
    }
  }
  console.log(`🤝 Seeded ${partners.length} partners`);

  // 5. Motto cards under the hero (facts from the company's site description)
  const mottos = [
    {
      titleUz: '1991-yildan beri', titleRu: 'С 1991 года', titleEn: 'Since 1991', titleFa: 'از سال ۱۹۹۱',
      bodyUz: 'Mustaqil oilaviy kompaniya, Markaziy Osiyoning markazida joylashgan.',
      bodyRu: 'Независимая семейная компания в самом сердце Центральной Азии.',
      bodyEn: 'An independent, family-owned company in the heart of Central Asia.',
      bodyFa: 'یک شرکت مستقل و خانوادگی در قلب آسیای مرکزی.',
    },
    {
      titleUz: '30 yildan ortiq tajriba', titleRu: 'Более 30 лет опыта', titleEn: '30+ years of experience', titleFa: 'بیش از ۳۰ سال تجربه',
      bodyUz: 'Ulgurji savdo va un ishlab chiqarish bozorida.',
      bodyRu: 'В оптовой торговле и производстве муки.',
      bodyEn: 'In the wholesale and flour production market.',
      bodyFa: 'در بازار عمده‌فروشی و تولید آرد.',
    },
    {
      titleUz: 'WFP hamkori', titleRu: 'Партнёр WFP', titleEn: 'WFP partner', titleFa: 'همکار WFP',
      bodyUz: 'Jahon oziq-ovqat dasturi (WFP) hamkori.',
      bodyRu: 'Партнёр Всемирной продовольственной программы (WFP).',
      bodyEn: 'Partner of the World Food Programme (WFP).',
      bodyFa: 'همکار برنامه جهانی غذا (WFP).',
    },
  ];
  if ((await prisma.infoItem.count({ where: { kind: 'MOTTO' } })) === 0) {
    await prisma.infoItem.createMany({ data: mottos.map((m, i) => ({ ...m, kind: 'MOTTO' as const, order: i + 1 })) });
  }
  console.log('💬 Motto cards ready');

  // 6. Seed Settings
  const settings = [
    { key: 'company_name', value: 'Yangiyer Flour Trading' },
    { key: 'phone', value: '+998 90 979 50 55' },
    { key: 'email', value: 'Yangiyerflour@gmail.com' },
    { key: 'address_uz', value: 'O‘zbekiston Respublikasi, Sirdaryo viloyati, Yangiyer shahri, sanoat rayoni' },
    { key: 'working_hours', value: 'Dushanba - Juma: 09:00 - 18:00' },
    { key: 'website', value: 'https://yangiyerflourtrading.uz' },
    { key: 'about_video_url', value: 'https://www.youtube.com/embed/G0zm9TybxpU' },
    { key: 'map_embed_url', value: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1181.1895909939317!2d69.21878063797728!3d41.2875452257138!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8be0fdfbfecd%3A0x6c5afd84eb8438a6!2sLLC%20%22YANGIYER%20FLOUR%20TRADING%22!5e0!3m2!1suz!2s!4v1684500868007!5m2!1suz!2s' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {}, // never overwrite values edited in the admin panel
      create: s,
    });
  }
  console.log('⚙️ Settings seeded');

  console.log('✅ Database seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
