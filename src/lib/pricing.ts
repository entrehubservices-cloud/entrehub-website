export type PricingItem = {
  name: string;
  amount?: number;
  range?: [number, number];
  unit?: string;
  description: string;
};

export type PricingCategory = {
  id: string;
  title: string;
  intro: string;
  items: PricingItem[];
  note?: string;
};

export const pricingCategories: PricingCategory[] = [
  {
    id: "social-media-management",
    title: "Social media management",
    intro: "Consistent content, more visibility and practical support for your social channels.",
    items: [
      { name: "Starter Plan", amount: 172, unit: "per month", description: "12 posts per month, graphics and captions, monthly content planning, profile optimisation and a performance report." },
      { name: "Growth Plan", amount: 318.5, unit: "per month", description: "16–20 posts per month, graphics, carousels and short videos, content strategy, reel editing, visibility optimisation, working-hours engagement management and monthly analytics." },
      { name: "Premium Plan", amount: 588, unit: "per month", description: "20–25 posts per month, advanced content strategy, short-form video production, working-hours community management, paid ads oversight and detailed reporting. Ad spend is separate." },
    ],
    note: "Engagement and community management are handled during working hours.",
  },
  {
    id: "brand-development",
    title: "Brand development",
    intro: "A clear, professional identity for your business.",
    items: [
      { name: "Logo Design", amount: 123, description: "A unique, professional logo for your brand." },
      { name: "Complete Brand Identity Package", amount: 417, description: "Logo, brand colours, fonts, social media kit and guidelines." },
      { name: "Brand Strategy Session", amount: 196, description: "One-to-one session to define your positioning and messaging." },
    ],
  },
  {
    id: "content-creation",
    title: "Content creation",
    intro: "Standalone creative work for your brand.",
    items: [
      { name: "Graphic Design", amount: 13, unit: "per post", description: "Custom design using your brand style." },
      { name: "Carousel Design", amount: 29, description: "Engaging multi-slide graphics." },
      { name: "Short-form Reel Editing", amount: 39, description: "Edit and optimise short videos." },
      { name: "Brand Content Shoot", amount: 147, unit: "per session", description: "On-location or virtual content shoot." },
      { name: "Copywriting", amount: 74, unit: "per campaign", description: "Well-written copy for your brand." },
    ],
  },
  {
    id: "website-development",
    title: "Website development",
    intro: "Modern, fast and manageable websites shaped around your requirements.",
    items: [
      { name: "Business / NGO Website", range: [735, 1050], description: "A professional website for your organisation or business." },
      { name: "E-commerce Website", range: [882, 1715], description: "An online store for your products or services." },
      { name: "Landing Page", amount: 221, description: "A focused page for a campaign, event or product." },
    ],
  },
  {
    id: "paid-advertising",
    title: "Paid advertising",
    intro: "Campaign setup and ongoing management for Meta or Google Ads.",
    items: [
      { name: "Campaign Setup", amount: 147, description: "Set up and launch your ad campaign." },
      { name: "Monthly Management", amount: 280, unit: "per month", description: "Ongoing campaign management and optimisation." },
    ],
    note: "The advertising budget paid to Meta or Google is not included in these fees.",
  },
  {
    id: "lead-generation",
    title: "Lead generation and outreach systems",
    intro: "Turn interest into a more organised path to real opportunities.",
    items: [
      { name: "Email Marketing Setup", amount: 245, description: "Set up and automate email campaigns." },
      { name: "Sales Funnel Setup", amount: 588, description: "A system to attract, nurture and convert leads." },
      { name: "Apollo.io B2B Lead System Setup", amount: 490, description: "Set up a system to find and reach relevant business contacts." },
      { name: "CRM & Automation Setup", amount: 392, description: "Organise leads and automate follow-ups." },
    ],
  },
];
