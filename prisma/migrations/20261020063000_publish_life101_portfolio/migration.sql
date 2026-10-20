-- Publish LIFE 101 after Gabriel confirmed the website project is complete.
INSERT INTO "PortfolioProject" ("id", "title", "category", "description", "image", "projectUrl", "order", "published", "status", "createdAt", "updatedAt")
VALUES ('entrehub-life101-website', 'LIFE 101 — Website Development', 'Web Development', 'Website development for LIFE 101, a youth mentorship and community initiative. The completed website presents its programs, introduces the team and gives visitors clear ways to explore mentoring, partnerships and donations.', '/images/portfolio/life101-website.jpg', 'https://www.life-101.us/', 3, true, 'COMPLETED', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
 "title" = EXCLUDED."title", "category" = EXCLUDED."category",
 "description" = EXCLUDED."description", "image" = EXCLUDED."image",
 "projectUrl" = EXCLUDED."projectUrl", "order" = EXCLUDED."order",
 "published" = true, "status" = 'COMPLETED', "updatedAt" = NOW();
