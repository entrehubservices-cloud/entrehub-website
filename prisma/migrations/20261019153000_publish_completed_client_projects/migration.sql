-- Publish the two completed projects confirmed by Gabriel Adinga on 19 October 2026.
-- No client emails, fees, invented performance results or testimonials are published.
INSERT INTO "PortfolioProject" ("id", "title", "category", "description", "image", "projectUrl", "order", "published", "status", "createdAt", "updatedAt") VALUES
('entrehub-akea-website', 'Akea’s Heart Counseling Services — Website Development', 'Web Development', 'Website development for Akea’s Heart Counseling Services, a counseling practice serving individuals, couples and families. The completed website brings the practice’s services, team information and contact options together in one place.', '/images/portfolio/akea-website.jpg', 'https://www.akeasheartandcounseling.com/', 1, true, 'COMPLETED', NOW(), NOW()),
('entrehub-farmket-platform', 'Farmket — Agricultural E-commerce Platform', 'E-commerce Development', 'Development of Farmket, an agricultural e-commerce platform for Seedo Agro-Allied Limited. The completed platform gives the business a digital storefront for its farm marketplace.', '/images/portfolio/farmket-platform.jpg', 'https://farmket.ng/', 2, true, 'COMPLETED', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
 "title" = EXCLUDED."title", "category" = EXCLUDED."category",
 "description" = EXCLUDED."description", "image" = EXCLUDED."image",
 "projectUrl" = EXCLUDED."projectUrl", "order" = EXCLUDED."order",
 "published" = true, "status" = 'COMPLETED', "updatedAt" = NOW();
