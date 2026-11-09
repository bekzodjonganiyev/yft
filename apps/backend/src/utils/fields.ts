/** Localized field helpers shared by the content controllers. */
export const LANGS = ['Uz', 'Ru', 'En', 'Fa'] as const;

/** Pick `<prefix>Uz/Ru/En/Fa` strings from a request body. Only keys that were sent are returned. */
export const pickLocalized = (body: Record<string, unknown>, prefix: string): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const lang of LANGS) {
    const value = body[`${prefix}${lang}`];
    if (typeof value === 'string') out[`${prefix}${lang}`] = value.trim();
  }
  return out;
};

export const toBool = (value: unknown): boolean | undefined =>
  value === undefined ? undefined : value === true || value === 'true' || value === '1' || value === 'on';
