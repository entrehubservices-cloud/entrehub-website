export const siteUrl = 'https://www.entrehubng.com';
export const siteName = 'ENTREHUB SERVICES LTD';
export const brandWordmark = 'ENTREHUB';
export const companyRcNumber = '10030133';
export const companyTaxId = '2621823441002';
export const companyEmail = 'info@entrehubng.com';
export const companyPhone = '+2348129721560';
export const companyPhoneDisplay = '+234 812 972 1560';
export const companyOperatingAddress = 'M4 Tonjos Plaza, Kachia Road, Kaduna, Nigeria';
export const companyRegisteredAddress =
  '12 Peace Villa, Off Fasugba Close, Eastern Bypass, Maraban Rido, Chikun LGA, Kaduna State, Nigeria';

export const companySocialUrls = {
  linkedin: 'https://www.linkedin.com/company/entrehub-services/',
  facebook: 'https://www.facebook.com/profile.php?id=61555757332109',
  instagram: 'https://www.instagram.com/entre_hubservices',
} as const;

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
