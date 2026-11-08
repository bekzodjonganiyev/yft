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
      titleAr: 'دقيق القمح الممتاز عالي الجودة',
      descUz: 'Eng sara qattiq va yumshoq bug\'doy navlaridan ishlab chiqarilgan oliy sifatli un. Non va pishiriqlar uchun ideal.',
      descRu: 'Высококачественная мука тонкого помола из отборных сортов пшеницы. Идеальна для пышной сдобной выпечки и кондитерских изделий.',
      descEn: 'Top-grade finely milled wheat flour from selected grain varieties. Perfect for fine pastry, cakes, and artisan bakery.',
      descAr: 'دقيق قمح عالي الجودة ومطحون بدقة من أصناف القمح المختارة. مثالي للحلويات والمخبوزات الفاخرة.',
      category: 'FLOUR_PREMIUM',
      packaging: '50 kg, 25 kg, 10 kg, 5 kg',
      gluten: '28 - 30%',
      ash: '0.55%',
      moisture: '14.0%',
      imageUrl: '/uploads/flour-premium.png',
      isFeatured: true,
      order: 1,
    },
    {
      titleUz: '1-Navli Bug\'doy Uni (Birinchi Nav)',
      titleRu: 'Мука Пшеничная Первый Сорт',
      titleEn: 'First Grade Wheat Flour',
      titleAr: 'دقيق القمح الدرجة الأولى',
      descUz: 'Kundalik non, tandir nonlari va qandolat mahsulotlari uchun eng talabgir, tarkibida kleykovina miqdori boy bo\'lgan un.',
      descRu: 'Самый востребованный сорт муки с высоким содержанием клейковины. Оптимально для традиционных лепешек и формового хлеба.',
      descEn: 'The most popular flour grade with optimal gluten content. Best for traditional flatbreads, baguettes, and sandwich bread.',
      descAr: 'دقيق القمح الأكثر طلباً مع محتوى غلوتين مثالي، مناسب جداً للخبز التقليدي والمخبوزات اليومية.',
      category: 'FLOUR_FIRST',
      packaging: '50 kg, 25 kg',
      gluten: '30 - 32%',
      ash: '0.75%',
      moisture: '14.5%',
      imageUrl: '/uploads/flour-first.png',
      isFeatured: true,
      order: 2,
    },
    {
      titleUz: '2-Navli Bug\'doy Uni (Ikkinchi Nav)',
      titleRu: 'Мука Пшеничная Второй Сорт',
      titleEn: 'Second Grade Wheat Flour',
      titleAr: 'دقيق القمح الدرجة الثانية',
      descUz: 'Foydali mikroelementlar va mineral moddalarga boy, quyuq xushbo\'y nonlar va parhezbop pishiriqlar uchun.',
      descRu: 'Богата клетчаткой, минеральными веществами и витаминами группы B. Отлично подходит для подового и диетического хлеба.',
      descEn: 'Rich in wheat fiber and natural minerals. Recommended for rustic hearth breads and healthy whole-grain dietary baking.',
      descAr: 'غني بالألياف والمعادن الطبيعية، موصى به للخبز الصحي والمخبوزات الغنية بالحبوب الكاملة.',
      category: 'FLOUR_SECOND',
      packaging: '50 kg',
      gluten: '25 - 27%',
      ash: '1.25%',
      moisture: '14.5%',
      imageUrl: '/uploads/flour-second.png',
      isFeatured: true,
      order: 3,
    },
    {
      titleUz: 'Bug\'doy Kepagi (Ozuqabop)',
      titleRu: 'Отруби Пшеничные Кормовые',
      titleEn: 'Wheat Bran (Fodder & Food Grade)',
      titleAr: 'نخالة القمح الغذائية والعلفية',
      descUz: 'Chorvachilik va parrandachilik xo\'jaliklari hamda sog\'lom oziq-ovqat sanoati uchun tozalangan bug\'doy kepagi.',
      descRu: 'Очищенные пшеничные отруби высокого качества для комбикормовой промышленности и здорового питания.',
      descEn: 'Cleaned quality wheat bran for compound feed manufacturing and dietary fiber food applications.',
      descAr: 'نخالة قمح نظيفة وعالية الجودة لصناعة الأعلاف والأغذية الصحية الغنية بالألياف.',
      category: 'BRAN',
      packaging: '25 kg, 20 kg',
      gluten: '-',
      ash: '5.0%',
      moisture: '13.5%',
      imageUrl: '/uploads/flour-bran.png',
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

  // 3. Seed Initial Gallery Photos
  const initialPhotos = [
    {
      photoUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Yangiyer zamonaviy tegirmon kompleksi',
      titleRu: 'Современный мельничный комплекс Янгиер',
      titleEn: 'Yangiyer modern milling complex',
      titleAr: 'مجمع مطاحن يانغير الحديث',
      category: 'production',
      width: 1200,
      height: 800,
    },
    {
      photoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Bug\'doy donlarini saralash va tozalash sexi',
      titleRu: 'Цех очистки и калибровки зерна',
      titleEn: 'Grain cleaning and sorting workshop',
      titleAr: 'ورشة تنظيف وفرز حبوب القمح',
      category: 'production',
      width: 1200,
      height: 800,
    },
    {
      photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Tayyor un mahsulotlari logistika ombori',
      titleRu: 'Склад готовой продукции и логистики',
      titleEn: 'Finished product storage and logistics hub',
      titleAr: 'مستودع تخزين المنتجات والخدمات اللوجستية',
      category: 'factory',
      width: 1200,
      height: 800,
    },
    {
      photoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Sifat nazorati va zamonaviy laboratoriya',
      titleRu: 'Контроль качества и лаборатория',
      titleEn: 'Quality control laboratory',
      titleAr: 'مختبر مراقبة الجودة والتحليل',
      category: 'laboratory',
      width: 1200,
      height: 800,
    },
  ];

  for (const ph of initialPhotos) {
    const existing = await prisma.photo.findFirst({ where: { photoUrl: ph.photoUrl } });
    if (!existing) {
      await prisma.photo.create({ data: ph });
    }
  }
  console.log(`📸 Seeded ${initialPhotos.length} gallery photos`);

  // 4. Seed Partners
  const partners = [
    { name: 'O\'zdonmahsulot AK', logoUrl: 'https://backend.tkti.uz/uploads/file-1680953905268.jpg', websiteUrl: '#' },
    { name: 'Agro Industrial Holding', logoUrl: 'https://backend.tkti.uz/uploads/file-1680953888366.jpg', websiteUrl: '#' },
    { name: 'Central Asia Grain Export', logoUrl: 'https://backend.tkti.uz/uploads/file-1680953777534.jpg', websiteUrl: '#' },
    { name: 'Bukhara Bakery Group', logoUrl: 'https://backend.tkti.uz/uploads/file-1680953754646.jpg', websiteUrl: '#' },
    { name: 'Tashkent Mill Logistics', logoUrl: 'https://backend.tkti.uz/uploads/file-1680953713364.jpg', websiteUrl: '#' },
  ];

  for (const p of partners) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.partner.create({ data: p });
    }
  }
  console.log(`🤝 Seeded ${partners.length} partners`);

  // 5. Seed Settings
  const settings = [
    { key: 'company_name', value: 'Yangiyer Flour Trading' },
    { key: 'phone', value: '+998 71 875 64 56' },
    { key: 'email', value: 'Yangiyerflour@gmail.com' },
    { key: 'address_uz', value: 'O‘zbekiston Respublikasi, Sirdaryo viloyati, Yangiyer shahri, sanoat rayoni' },
    { key: 'working_hours', value: 'Dushanba - Juma: 09:00 - 18:00' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
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
