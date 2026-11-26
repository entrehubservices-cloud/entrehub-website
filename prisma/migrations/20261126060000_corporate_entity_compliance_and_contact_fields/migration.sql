-- Add optional B2B/enterprise fields to ContactMessage
ALTER TABLE "ContactMessage"
  ADD COLUMN IF NOT EXISTS "company" TEXT,
  ADD COLUMN IF NOT EXISTS "inquiryType" TEXT;

-- Fix service copy typos in production database
UPDATE "Service"
SET
  "description" = REPLACE("description", 'microsite and mobile apps', 'microsites and mobile apps'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "description" LIKE '%microsite and mobile apps%';

UPDATE "Service"
SET
  "description" = REPLACE("description", 'out of the box creative contents', 'out-of-the-box creative content'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "description" LIKE '%out of the box creative contents%';

-- Update approved blog author bio to reflect ENTREHUB SERVICES LTD
UPDATE "Author"
SET
  "bio" = 'Gabriel Adinga writes about websites, search visibility, digital systems and practical growth strategies for brands and organisations at ENTREHUB SERVICES LTD.',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "name" = 'Gabriel Adinga';
