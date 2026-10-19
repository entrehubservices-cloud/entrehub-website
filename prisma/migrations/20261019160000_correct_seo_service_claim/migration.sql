-- Replace the specific unsupported promise without overwriting unrelated service edits.
UPDATE "Service" SET "description" = 'We improve your website’s technical foundations, content and search visibility so the right people can find your business. SEO is ongoing work, and results take time.', "updatedAt" = NOW()
WHERE "title" = 'Search Engine Optimization'
AND "description" = 'We can effectively communicate with Google to help your website appears on top within minutes.';
