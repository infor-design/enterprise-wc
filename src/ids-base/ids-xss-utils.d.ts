/** Takes a string containing HTML and Text and removes all HTML tags */
export function stripTags(html: string): string;

/** Takes a string containing HTML and Text and removes all HTML tags except for those specified */
export function stripHTML(html: string, allowed: string): string;
