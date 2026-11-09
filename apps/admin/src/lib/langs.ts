/** Content languages of the public site. The 4th one is Persian (fa), as on the version_2_1_0 site. */
export const LANGS = [
  { code: 'Uz', label: "O'zbekcha", rtl: false },
  { code: 'Ru', label: 'Русский', rtl: false },
  { code: 'En', label: 'English', rtl: false },
  { code: 'Fa', label: 'فارسی', rtl: true },
] as const

export type LangCode = (typeof LANGS)[number]['code']
export type Localized<P extends string> = Record<`${P}${LangCode}`, string>

export const emptyLocalized = <P extends string>(prefix: P): Localized<P> =>
  Object.fromEntries(
    LANGS.map((l) => [`${prefix}${l.code}`, ''])
  ) as Localized<P>

export const pickLocalized = <P extends string>(
  row: object,
  prefix: P
): Localized<P> =>
  Object.fromEntries(
    LANGS.map((l) => [
      `${prefix}${l.code}`,
      ((row as Record<string, unknown>)[`${prefix}${l.code}`] as
        string | null | undefined) ?? '',
    ])
  ) as Localized<P>
