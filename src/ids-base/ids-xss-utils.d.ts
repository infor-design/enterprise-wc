/** Takes a string containing HTML and Text and removes any reference to console methods */
export function sanitizeConsoleMethods(html: string): string;

/** Takes a string containing HTML and Text and removes any functions or script tags */
export function sanitizeHTML(html: string): string;

/** Takes a string containing HTML and Text and removes all HTML tags */
export function stripTags(html: string): string;

/** Takes a string containing HTML and Text and removes all HTML tags except for those specified */
export function stripHTML(html: string, allowed: string): string;
