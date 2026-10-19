-- Keep existing sample projects recoverable but remove them from public view.
ALTER TABLE "PortfolioProject"
ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "projectUrl" TEXT;
ALTER TABLE "PortfolioProject" ADD CONSTRAINT "portfolio_status" CHECK ("status" IN ('DRAFT', 'IN_PROGRESS', 'COMPLETED'));
ALTER TABLE "PortfolioProject" ADD CONSTRAINT "portfolio_publish_completed" CHECK (NOT "published" OR "status" = 'COMPLETED');
