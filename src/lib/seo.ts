export const siteUrl = 'https://www.entrehubng.com';
export const siteName = 'Entrehub Services';
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
