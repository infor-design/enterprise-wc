// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export class IdsLocaleMixin {
  /** Set the language */
  language: string;

  /** Set the locale */
  locale: 'en-US' | string;

  /** Set the language async */
  setLanguage(language: string): Promise<string>;

  /** Set the language async */
  setLocale(locale: string): Promise<string>;
}
