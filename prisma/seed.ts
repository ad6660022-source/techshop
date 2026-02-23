import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin123!",
    10
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@techshop.ru" },
    update: {},
    create: {
      name: "Администратор",
      email: process.env.ADMIN_EMAIL || "admin@techshop.ru",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "smartphones" },
      update: {},
      create: {
        name: "Смартфоны",
        slug: "smartphones",
        description: "Современные смартфоны от ведущих производителей",
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        icon: "📱",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "laptops" },
      update: {},
      create: {
        name: "Ноутбуки",
        slug: "laptops",
        description: "Ноутбуки для работы, учёбы и игр",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        icon: "💻",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "headphones" },
      update: {},
      create: {
        name: "Наушники",
        slug: "headphones",
        description: "Наушники и гарнитуры для музыки и звонков",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        icon: "🎧",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Аксессуары",
        slug: "accessories",
        description: "Зарядки, чехлы, кабели и другие аксессуары",
        image:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        icon: "🔌",
        sortOrder: 4,
      },
    }),
  ]);

  const [smartphones, laptops, headphones, accessories] = categories;
  console.log(`✅ ${categories.length} categories created`);

  // Helper to create product with images and specs
  async function createProduct(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    oldPrice?: number;
    stock: number;
    brand: string;
    categoryId: string;
    isFeatured?: boolean;
    isNew?: boolean;
    images: { url: string; alt: string }[];
    specs: { group: string; name: string; value: string }[];
  }) {
    return prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        oldPrice: data.oldPrice,
        stock: data.stock,
        brand: data.brand,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured ?? false,
        isNew: data.isNew ?? false,
        images: {
          create: data.images.map((img, idx) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: idx,
          })),
        },
        specs: {
          create: data.specs.map((s) => ({
            group: s.group,
            name: s.name,
            value: s.value,
          })),
        },
      },
    });
  }

  // ===== SMARTPHONES =====
  await createProduct({
    name: "Apple iPhone 15 Pro 256GB",
    slug: "apple-iphone-15-pro-256gb",
    description:
      "Флагманский смартфон Apple с чипом A17 Pro, камерой 48 МП и корпусом из титана. Поддержка USB-C и Action Button.",
    price: 99990,
    oldPrice: 114990,
    stock: 15,
    brand: "Apple",
    categoryId: smartphones.id,
    isFeatured: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
        alt: "iPhone 15 Pro",
      },
      {
        url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800",
        alt: "iPhone 15 Pro вид сзади",
      },
    ],
    specs: [
      { group: "Основные", name: "Процессор", value: "Apple A17 Pro" },
      { group: "Основные", name: "Память", value: "256 ГБ" },
      { group: "Основные", name: "ОЗУ", value: "8 ГБ" },
      { group: "Дисплей", name: "Экран", value: "6.1\" OLED Super Retina XDR" },
      { group: "Дисплей", name: "Разрешение", value: "2556 × 1179" },
      { group: "Камера", name: "Основная камера", value: "48 МП + 12 МП + 12 МП" },
      { group: "Камера", name: "Фронтальная", value: "12 МП" },
      { group: "Батарея", name: "Аккумулятор", value: "3274 мАч" },
      { group: "Связь", name: "5G", value: "Да" },
      { group: "Корпус", name: "Материал", value: "Титан Grade 5" },
    ],
  });

  await createProduct({
    name: "Samsung Galaxy S24 Ultra 256GB",
    slug: "samsung-galaxy-s24-ultra-256gb",
    description:
      "Топовый Android-флагман с S Pen, камерой 200 МП и мощным процессором Snapdragon 8 Gen 3.",
    price: 109990,
    oldPrice: 124990,
    stock: 10,
    brand: "Samsung",
    categoryId: smartphones.id,
    isFeatured: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
        alt: "Samsung Galaxy S24 Ultra",
      },
    ],
    specs: [
      { group: "Основные", name: "Процессор", value: "Snapdragon 8 Gen 3" },
      { group: "Основные", name: "Память", value: "256 ГБ" },
      { group: "Основные", name: "ОЗУ", value: "12 ГБ" },
      { group: "Дисплей", name: "Экран", value: "6.8\" Dynamic AMOLED 2X" },
      { group: "Дисплей", name: "Частота обновления", value: "120 Гц" },
      { group: "Камера", name: "Основная камера", value: "200 МП + 12 МП + 10 МП + 50 МП" },
      { group: "Батарея", name: "Аккумулятор", value: "5000 мАч" },
      { group: "Особенности", name: "S Pen", value: "Встроенный" },
    ],
  });

  await createProduct({
    name: "Xiaomi 14 12GB/256GB",
    slug: "xiaomi-14-12gb-256gb",
    description:
      "Компактный флагман Xiaomi с камерой Leica, Snapdragon 8 Gen 3 и быстрой зарядкой 90W.",
    price: 64990,
    oldPrice: 74990,
    stock: 20,
    brand: "Xiaomi",
    categoryId: smartphones.id,
    isNew: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800",
        alt: "Xiaomi 14",
      },
    ],
    specs: [
      { group: "Основные", name: "Процессор", value: "Snapdragon 8 Gen 3" },
      { group: "Основные", name: "Память", value: "256 ГБ" },
      { group: "Основные", name: "ОЗУ", value: "12 ГБ" },
      { group: "Дисплей", name: "Экран", value: "6.36\" AMOLED 120 Гц" },
      { group: "Камера", name: "Камера", value: "50 МП Leica (тройная)" },
      { group: "Батарея", name: "Аккумулятор", value: "4610 мАч" },
      { group: "Зарядка", name: "Проводная зарядка", value: "90W" },
    ],
  });

  // ===== LAPTOPS =====
  await createProduct({
    name: "Apple MacBook Air 13\" M3 256GB",
    slug: "apple-macbook-air-13-m3-256gb",
    description:
      "Ультратонкий ноутбук с чипом M3, до 18 часов работы от батареи и дисплеем Liquid Retina.",
    price: 119990,
    oldPrice: 134990,
    stock: 8,
    brand: "Apple",
    categoryId: laptops.id,
    isFeatured: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        alt: "MacBook Air M3",
      },
    ],
    specs: [
      { group: "Основные", name: "Процессор", value: "Apple M3 (8 ядер)" },
      { group: "Основные", name: "Память SSD", value: "256 ГБ" },
      { group: "Основные", name: "ОЗУ", value: "8 ГБ" },
      { group: "Дисплей", name: "Экран", value: "13.6\" Liquid Retina" },
      { group: "Дисплей", name: "Разрешение", value: "2560 × 1664" },
      { group: "Батарея", name: "Время работы", value: "до 18 часов" },
      { group: "Габариты", name: "Вес", value: "1.24 кг" },
      { group: "ОС", name: "Операционная система", value: "macOS Sonoma" },
    ],
  });

  await createProduct({
    name: "ASUS ZenBook 14 OLED",
    slug: "asus-zenbook-14-oled",
    description:
      "Стильный ноутбук с OLED-дисплеем 2.8K, процессором Intel Core Ultra 7 и компактными размерами.",
    price: 89990,
    oldPrice: 99990,
    stock: 12,
    brand: "ASUS",
    categoryId: laptops.id,
    images: [
      {
        url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800",
        alt: "ASUS ZenBook 14 OLED",
      },
    ],
    specs: [
      { group: "Основные", name: "Процессор", value: "Intel Core Ultra 7 155H" },
      { group: "Основные", name: "Память SSD", value: "512 ГБ NVMe" },
      { group: "Основные", name: "ОЗУ", value: "16 ГБ LPDDR5" },
      { group: "Дисплей", name: "Экран", value: "14\" OLED 2.8K 120 Гц" },
      { group: "Батарея", name: "Аккумулятор", value: "75 Вт·ч" },
      { group: "Габариты", name: "Вес", value: "1.2 кг" },
    ],
  });

  await createProduct({
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    slug: "lenovo-thinkpad-x1-carbon-gen-12",
    description:
      "Бизнес-ноутбук с легчайшим корпусом из углеродного волокна, ThinkShield и стойкостью по MIL-STD-810H.",
    price: 149990,
    stock: 5,
    brand: "Lenovo",
    categoryId: laptops.id,
    isNew: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
        alt: "Lenovo ThinkPad X1 Carbon",
      },
    ],
    specs: [
      { group: "Основные", name: "Процессор", value: "Intel Core Ultra 7 165U" },
      { group: "Основные", name: "Память SSD", value: "512 ГБ NVMe" },
      { group: "Основные", name: "ОЗУ", value: "16 ГБ LPDDR5x" },
      { group: "Дисплей", name: "Экран", value: "14\" IPS 2.8K 60 Гц" },
      { group: "Безопасность", name: "Сенсор отпечатков", value: "Встроенный" },
      { group: "Безопасность", name: "ИК-камера", value: "Windows Hello" },
      { group: "Батарея", name: "Аккумулятор", value: "57 Вт·ч" },
      { group: "Габариты", name: "Вес", value: "1.12 кг" },
    ],
  });

  // ===== HEADPHONES =====
  await createProduct({
    name: "Apple AirPods Pro 2-го поколения",
    slug: "apple-airpods-pro-2",
    description:
      "Беспроводные наушники с активным шумоподавлением, пространственным звуком и чипом H2.",
    price: 24990,
    oldPrice: 29990,
    stock: 30,
    brand: "Apple",
    categoryId: headphones.id,
    isFeatured: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800",
        alt: "AirPods Pro 2",
      },
    ],
    specs: [
      { group: "Звук", name: "Тип", value: "TWS (полностью беспроводные)" },
      { group: "Звук", name: "Шумоподавление", value: "Активное (ANC)" },
      { group: "Звук", name: "Пространственный звук", value: "Есть" },
      { group: "Батарея", name: "Время работы", value: "до 6 ч (до 30 ч с кейсом)" },
      { group: "Связь", name: "Bluetooth", value: "5.3" },
      { group: "Совместимость", name: "Устройства", value: "iPhone, iPad, Mac" },
    ],
  });

  await createProduct({
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description:
      "Накладные наушники с лучшим в классе шумоподавлением, 30 часами работы и поддержкой LDAC.",
    price: 29990,
    oldPrice: 39990,
    stock: 18,
    brand: "Sony",
    categoryId: headphones.id,
    isFeatured: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1546435770-a3e736f3a9dc?w=800",
        alt: "Sony WH-1000XM5",
      },
    ],
    specs: [
      { group: "Звук", name: "Тип", value: "Накладные беспроводные" },
      { group: "Звук", name: "Шумоподавление", value: "Активное (лучшее в классе)" },
      { group: "Звук", name: "Кодеки", value: "LDAC, AAC, SBC" },
      { group: "Батарея", name: "Время работы", value: "до 30 ч" },
      { group: "Батарея", name: "Быстрая зарядка", value: "3 мин = 3 ч работы" },
      { group: "Связь", name: "Bluetooth", value: "5.2" },
    ],
  });

  await createProduct({
    name: "JBL Tune 770NC",
    slug: "jbl-tune-770nc",
    description:
      "Беспроводные накладные наушники JBL с адаптивным шумоподавлением и до 70 часов музыки.",
    price: 8990,
    oldPrice: 12990,
    stock: 25,
    brand: "JBL",
    categoryId: headphones.id,
    isNew: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
        alt: "JBL Tune 770NC",
      },
    ],
    specs: [
      { group: "Звук", name: "Тип", value: "Накладные беспроводные" },
      { group: "Звук", name: "Шумоподавление", value: "Адаптивное ANC" },
      { group: "Батарея", name: "Время работы", value: "до 70 ч (без ANC)" },
      { group: "Связь", name: "Bluetooth", value: "5.3" },
      { group: "Управление", name: "Google Assistant/Siri", value: "Да" },
    ],
  });

  // ===== ACCESSORIES =====
  await createProduct({
    name: "Apple MagSafe Зарядное устройство 15W",
    slug: "apple-magsafe-charger-15w",
    description:
      "Оригинальная беспроводная зарядка MagSafe для iPhone 12-15, мощность 15W с магнитным выравниванием.",
    price: 4990,
    oldPrice: 5990,
    stock: 50,
    brand: "Apple",
    categoryId: accessories.id,
    images: [
      {
        url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800",
        alt: "MagSafe зарядка",
      },
    ],
    specs: [
      { group: "Зарядка", name: "Мощность", value: "15W" },
      { group: "Зарядка", name: "Стандарт", value: "MagSafe (беспроводная)" },
      { group: "Совместимость", name: "iPhone", value: "iPhone 12 и новее" },
      { group: "Кабель", name: "Разъём", value: "USB-C" },
    ],
  });

  await createProduct({
    name: "Чехол Spigen Ultra Hybrid для iPhone 15 Pro",
    slug: "spigen-ultra-hybrid-iphone-15-pro",
    description:
      "Прозрачный защитный чехол с усиленными углами и поддержкой MagSafe. Не желтеет со временем.",
    price: 2490,
    stock: 40,
    brand: "Spigen",
    categoryId: accessories.id,
    images: [
      {
        url: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800",
        alt: "Чехол Spigen для iPhone",
      },
    ],
    specs: [
      { group: "Совместимость", name: "Модель", value: "iPhone 15 Pro" },
      { group: "Материал", name: "Материал", value: "Поликарбонат + TPU" },
      { group: "Особенности", name: "MagSafe", value: "Поддерживается" },
      { group: "Особенности", name: "Защита углов", value: "Air Cushion Technology" },
    ],
  });

  await createProduct({
    name: "USB-C кабель Anker 240W 2м",
    slug: "anker-usb-c-cable-240w-2m",
    description:
      "Нейлоновый кабель USB-C с поддержкой зарядки 240W и передачи данных USB 2.0. Длина 2 метра.",
    price: 1290,
    oldPrice: 1590,
    stock: 100,
    brand: "Anker",
    categoryId: accessories.id,
    isNew: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        alt: "USB-C кабель Anker",
      },
    ],
    specs: [
      { group: "Зарядка", name: "Максимальная мощность", value: "240W" },
      { group: "Данные", name: "Скорость передачи", value: "USB 2.0 (480 Мбит/с)" },
      { group: "Разъёмы", name: "Тип", value: "USB-C – USB-C" },
      { group: "Физические", name: "Длина", value: "2 м" },
      { group: "Физические", name: "Материал оплётки", value: "Нейлон" },
    ],
  });

  // Create promo codes
  await prisma.promoCode.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "Скидка 10% для новых покупателей",
      type: "PERCENTAGE",
      value: 10,
      minOrder: 5000,
      isActive: true,
    },
  });

  await prisma.promoCode.upsert({
    where: { code: "SAVE500" },
    update: {},
    create: {
      code: "SAVE500",
      description: "Скидка 500 руб. на заказ от 10000 руб.",
      type: "FIXED",
      value: 500,
      minOrder: 10000,
      isActive: true,
    },
  });

  console.log(`✅ Products seeded successfully`);
  console.log(`✅ Promo codes: WELCOME10 (-10%), SAVE500 (-500 руб.)`);
  console.log(`\n🎉 Seed complete!`);
  console.log(`\n📧 Admin login: ${process.env.ADMIN_EMAIL || "admin@techshop.ru"}`);
  console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || "Admin123!"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
