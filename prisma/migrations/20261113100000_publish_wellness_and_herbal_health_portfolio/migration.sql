-- Publish two completed websites requested for the portfolio on 12 November 2026.
-- Cards use the brand names only. No client names, fees, results or testimonials are published.
INSERT INTO "PortfolioProject" ("id", "title", "category", "description", "image", "projectUrl", "order", "published", "status", "createdAt", "updatedAt") VALUES
('entrehub-natural-wellness-center-website', 'Natural Wellness Center — Website Development', 'E-commerce Development', 'Website development for Natural Wellness Center, a wellness centre and product shop in Florence, South Carolina. The site combines a filterable product catalogue and cart with appointment booking and contact options.', '/images/portfolio/natural-wellness-center-website.jpg', 'https://www.altnaturalwellness.net/', 4, true, 'COMPLETED', NOW(), NOW()),
('entrehub-herbal-health-seminar-website', 'Herbal Health Seminar Series — Website Development', 'Web Development', 'Website development for Herbal Health Seminar Series, which runs educational herbal wellness workshops in different cities. Visitors can search upcoming seminars by city and date, then book tickets online.', '/images/portfolio/herbal-health-seminar-website.jpg', 'https://www.herbal-health.online/', 5, true, 'COMPLETED', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
 "title" = EXCLUDED."title", "category" = EXCLUDED."category",
 "description" = EXCLUDED."description", "image" = EXCLUDED."image",
 "projectUrl" = EXCLUDED."projectUrl", "order" = EXCLUDED."order",
 "published" = true, "status" = 'COMPLETED', "updatedAt" = NOW();
