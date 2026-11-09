/**
 * Imports the images of the previous frontend (branch `version_2_1_0`) into backend storage.
 *
 * Every image goes through media.service → validated, deduplicated by hash, saved in UPLOAD_DIR,
 * recorded in the `media` table, and then linked to the right content row:
 *   - logo            → setting `asset.logo`
 *   - wheat photos    → hero `banners` and gallery `photos`
 *   - about video bg  → setting `asset.about_bg` (remote; falls back to a local photo)
 *
 * The old site loaded everything else (banners, news, vacancies, products, partners, gallery) from
 * https://coral-app-bsinx.ondigitalocean.app, which no longer exists, so that content cannot be recovered.
 * The placeholder partner logos in that branch (hamkor.png, images.jpg, 1.jpg — Nike / "logoipsum")
 * are intentionally NOT imported.
 *
 * The script is idempotent: running it again does not create duplicates.
 *
 * Usage (from repo root):
 *   git worktree add ../yft-version_2_1_0 version_2_1_0     # once
 *   pnpm --filter @yft/backend assets:import -- --source ../../../yft-version_2_1_0
 *   flags: --skip-remote, --localize-db (copy any other http(s) image URL in the DB), --force
 */
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../src/config/prisma';
import { releaseMedia, storeBuffer, storeRemote } from '../src/services/media.service';
import type { Media } from '@prisma/client';

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const SOURCE = option('source');
const SKIP_REMOTE = flag('skip-remote');
const LOCALIZE_DB = flag('localize-db');
const FORCE = flag('force');

type Target =
  | { type: 'setting'; key: string }
  | {
      type: 'photo';
      category: string;
      titles: { uz: string; ru: string; en: string; fa: string };
    }
  | { type: 'banner'; order: number }
  | { type: 'product'; order: number }
  | { type: 'partner'; name: string };

interface Entry {
  /** path relative to the legacy checkout, or an absolute http(s) URL */
  from: string;
  to: Target[];
  /** local file to use when the remote one cannot be downloaded */
  fallback?: string;
}

const IMG = 'src/assets/images';
const wheat = (uz: string, ru: string, en: string, fa: string): Target => ({
  type: 'photo',
  category: 'field',
  titles: { uz, ru, en, fa },
});

const MANIFEST: Entry[] = [
  { from: `${IMG}/logo.png`, to: [{ type: 'setting', key: 'asset.logo' }] },
  {
    from: `${IMG}/bg.jpg`,
    to: [
      { type: 'banner', order: 1 },
      wheat('Pishgan bug‘doy boshoqlari', 'Спелые колосья пшеницы', 'Ripe wheat ears', 'خوشه‌های رسیده گندم'),
    ],
  },
  {
    from: `${IMG}/bg1.jpg`,
    to: [{ type: 'banner', order: 2 }, wheat('Bug‘doy dalasi', 'Пшеничное поле', 'Wheat field', 'مزرعه گندم')],
  },
  {
    from: `${IMG}/bg2.jpg`,
    to: [{ type: 'banner', order: 3 }, wheat('Hosil mavsumi', 'Сезон урожая', 'Harvest season', 'فصل برداشت')],
  },
  { from: `${IMG}/bugdoy.jpg`, to: [wheat('Sara bug‘doy', 'Отборная пшеница', 'Selected wheat', 'گندم مرغوب')] },
  {
    // AboutUs.jsx background behind the video play button
    from: 'https://backend.tkti.uz/uploads/file-1682455807124.png',
    to: [{ type: 'setting', key: 'asset.about_bg' }],
    fallback: `${IMG}/bugdoy.jpg`,
  },
];

const isRemote = (s: string) => /^https?:\/\//i.test(s);

const stats = { stored: 0, linked: 0, skipped: 0, failed: 0 };

async function loadLocal(rel: string): Promise<Media> {
  if (!SOURCE) throw new Error('--source is required for local files');
  const abs = path.resolve(SOURCE, rel);
  const buffer = await fs.readFile(abs);
  return storeBuffer(buffer, { originalName: path.basename(rel), source: `legacy:${rel}` });
}

async function resolveEntry(entry: Entry): Promise<Media | null> {
  try {
    if (!isRemote(entry.from)) return await loadLocal(entry.from);
    if (SKIP_REMOTE) throw new Error('remote download skipped (--skip-remote)');
    return await storeRemote(entry.from);
  } catch (err: any) {
    if (entry.fallback) {
      console.warn(`  ! ${entry.from}: ${err.message} → using fallback ${entry.fallback}`);
      const media = await loadLocal(entry.fallback).catch(() => null);
      if (media) fallbackUrls.add(media.url);
      return media;
    }
    console.warn(`  ! ${entry.from}: ${err.message}`);
    stats.failed++;
    return null;
  }
}

/** URLs of local fallback images — a later successful remote download may replace them. */
const fallbackUrls = new Set<string>();

async function link(media: Media, target: Target) {
  switch (target.type) {
    case 'setting': {
      const current = await prisma.setting.findUnique({ where: { key: target.key } });
      const replaceable = current?.value && fallbackUrls.has(current.value) && !media.source?.startsWith('legacy:');
      if (current?.value === media.url || (current?.value && !FORCE && !replaceable)) {
        stats.skipped++;
        return;
      }
      await prisma.setting.upsert({
        where: { key: target.key },
        update: { value: media.url },
        create: { key: target.key, value: media.url, description: 'Imported from the version_2_1_0 frontend' },
      });
      if (current && current.value !== media.url) await releaseMedia(current.value);
      break;
    }
    case 'banner': {
      if (await prisma.banner.findFirst({ where: { imageUrl: media.url } })) {
        stats.skipped++;
        return;
      }
      await prisma.banner.create({ data: { imageUrl: media.url, order: target.order } });
      break;
    }
    case 'photo': {
      const exists = await prisma.photo.findFirst({ where: { photoUrl: media.url } });
      if (exists) {
        stats.skipped++;
        return;
      }
      await prisma.photo.create({
        data: {
          photoUrl: media.url,
          titleUz: target.titles.uz,
          titleRu: target.titles.ru,
          titleEn: target.titles.en,
          titleFa: target.titles.fa,
          category: target.category,
          width: media.width ?? 1080,
          height: media.height ?? 720,
        },
      });
      break;
    }
    case 'product': {
      const product = await prisma.product.findFirst({ where: { order: target.order } });
      if (!product) {
        console.warn(`  ! no product with order=${target.order}, image kept in media library only`);
        stats.skipped++;
        return;
      }
      const hasLocal = product.imageUrl.startsWith('/uploads/') && (await prisma.media.findUnique({ where: { url: product.imageUrl } }));
      if (hasLocal && !FORCE) {
        stats.skipped++;
        return;
      }
      await prisma.product.update({ where: { id: product.id }, data: { imageUrl: media.url } });
      await releaseMedia(product.imageUrl);
      break;
    }
    case 'partner': {
      // Match a partner that still points to the old remote logo, otherwise create one.
      const byOldLogo = media.source ? await prisma.partner.findFirst({ where: { logoUrl: media.source } }) : null;
      const byNewLogo = await prisma.partner.findFirst({ where: { logoUrl: media.url } });
      if (byNewLogo) {
        stats.skipped++;
        return;
      }
      if (byOldLogo) {
        await prisma.partner.update({ where: { id: byOldLogo.id }, data: { logoUrl: media.url } });
      } else {
        const count = await prisma.partner.count();
        await prisma.partner.create({ data: { name: target.name, logoUrl: media.url, order: count + 1 } });
      }
      break;
    }
  }
  stats.linked++;
}

/** Copy any remaining http(s) image referenced in the DB into local storage. */
async function localizeDatabase() {
  console.log('\n→ Localizing remaining remote image URLs in the database');
  const tryStore = async (url: string) => {
    try {
      return await storeRemote(url);
    } catch (err: any) {
      console.warn(`  ! ${url}: ${err.message}`);
      stats.failed++;
      return null;
    }
  };

  for (const p of await prisma.product.findMany({ where: { imageUrl: { startsWith: 'http' } } })) {
    const m = await tryStore(p.imageUrl);
    if (m) {
      await prisma.product.update({ where: { id: p.id }, data: { imageUrl: m.url } });
      stats.linked++;
    }
  }
  for (const p of await prisma.photo.findMany({ where: { photoUrl: { startsWith: 'http' } } })) {
    const m = await tryStore(p.photoUrl);
    if (m) {
      await prisma.photo.update({
        where: { id: p.id },
        data: { photoUrl: m.url, width: m.width ?? p.width, height: m.height ?? p.height },
      });
      stats.linked++;
    }
  }
  for (const p of await prisma.partner.findMany({ where: { logoUrl: { startsWith: 'http' } } })) {
    const m = await tryStore(p.logoUrl);
    if (m) {
      await prisma.partner.update({ where: { id: p.id }, data: { logoUrl: m.url } });
      stats.linked++;
    }
  }
  for (const s of await prisma.setting.findMany({ where: { key: { startsWith: 'asset.' }, value: { startsWith: 'http' } } })) {
    const m = await tryStore(s.value);
    if (m) {
      await prisma.setting.update({ where: { id: s.id }, data: { value: m.url } });
      stats.linked++;
    }
  }
}

async function main() {
  if (!SOURCE) {
    console.error('Usage: assets:import -- --source <path-to-version_2_1_0-checkout> [--skip-remote] [--localize-db] [--force]');
    process.exit(1);
  }
  await fs.access(path.resolve(SOURCE, IMG)).catch(() => {
    throw new Error(`${path.resolve(SOURCE, IMG)} not found — is --source the version_2_1_0 checkout?`);
  });

  console.log(`→ Importing legacy frontend images from ${path.resolve(SOURCE)}`);
  const before = await prisma.media.count();

  for (const entry of MANIFEST) {
    if (entry.fallback) {
      const fb = await prisma.media.findFirst({ where: { source: `legacy:${entry.fallback}` } });
      if (fb) fallbackUrls.add(fb.url);
    }
    const media = await resolveEntry(entry);
    if (!media) continue;
    console.log(`  ✓ ${entry.from} → ${media.url} (${media.width ?? '?'}×${media.height ?? '?'})`);
    for (const target of entry.to) await link(media, target);
  }

  if (LOCALIZE_DB && !SKIP_REMOTE) await localizeDatabase();

  stats.stored = (await prisma.media.count()) - before;
  console.log(
    `\nDone. new files: ${stats.stored}, links made: ${stats.linked}, already up to date: ${stats.skipped}, failed: ${stats.failed}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
