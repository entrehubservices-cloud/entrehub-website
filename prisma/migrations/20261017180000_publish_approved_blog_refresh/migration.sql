BEGIN;
ALTER TABLE "BlogPost" ADD COLUMN "editorialUpdatedAt" TIMESTAMP(3), ADD COLUMN "coverImageAlt" TEXT;
DO $$ BEGIN IF (SELECT count(*) FROM "BlogPost" WHERE slug IN ('the-future-of-digital-marketing-in-2024','seo-best-practices-for-small-businesses','social-media-marketing-strategies-that-work','content-marketing-creating-value-for-your-audience','email-marketing-automation-for-better-roi','analytics-and-data-driven-marketing-decisions')) <> 6 THEN RAISE EXCEPTION 'Expected six approved posts; publication cancelled'; END IF; END $$;
INSERT INTO "Author" (id,name,email,bio,"createdAt","updatedAt") VALUES ('gabriel-adinga-editorial','Gabriel Adinga','entrehubservices@gmail.com','Gabriel Adinga writes about websites, search visibility and practical digital marketing for personal brands and small businesses at Entrehub Services in Kaduna, Nigeria.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name,bio=EXCLUDED.bio,"updatedAt"=CURRENT_TIMESTAMP;
UPDATE "BlogPost" SET title='A Practical Digital Marketing Plan for Service Businesses (2026)',slug='digital-marketing-plan-service-businesses',excerpt='Build a focused marketing plan around one offer, a clear website, useful content and reliable follow-up. Includes a planning sheet for service businesses.',content='<p>A useful marketing plan should tell you what to do next Monday. If it only lists platforms, it leaves the difficult decisions with you.</p>
<p>For a small service business, start with one offer, one audience and one route to an enquiry. A consultant selling a paid discovery session needs a different plan from a designer selling a fixed website package. “Get more visibility” does not explain what either business should publish or measure.</p>
<h2>Write the offer before choosing the channel</h2>
<p>Complete this sentence: “We help [specific customer] achieve [useful outcome] through [defined service].” Then write down what is included, what is excluded and what the next conversation should establish.</p>
<p>For example, a personal-brand photographer might offer a half-day shoot with an agreed number of edited images. The marketing should explain the planning, usage rights and delivery process. A stream of attractive photographs alone leaves those buying questions unanswered.</p>
<p>This is an example, not an Entrehub client result. Use the same exercise for your own service before paying to attract more visitors.</p>
<h2>Give each part of the journey a job</h2>
<p>Use a social channel to introduce the work and answer questions. Give interested visitors a clear website page where they can understand the service. Choose one obvious next action: request a quote, describe a project or book a conversation.</p>
<p>A WhatsApp conversation may be convenient for some customers; a form or email may suit others. Test the complete journey on a phone. Make sure a real person knows who should reply and when. If overseas clients matter, state your time zone and explain how remote meetings work.</p>
<p>Avoid launching five channels with no capacity to maintain them. Choose the one you can use consistently and review it against enquiries rather than posting volume.</p>
<h2>Use this planning sheet</h2>
<table>
<thead>
<tr>
<th>Decision</th>
<th>Write your answer</th>
</tr>
</thead>
<tbody>
<tr>
<td>Offer</td>
<td>What exactly can someone buy?</td>
</tr>
<tr>
<td>Customer</td>
<td>Who needs it, and what triggers the need?</td>
</tr>
<tr>
<td>Buying question</td>
<td>What must they understand before contacting you?</td>
</tr>
<tr>
<td>Main destination</td>
<td>Which page answers that question?</td>
</tr>
<tr>
<td>Discovery channel</td>
<td>Where will you introduce the offer?</td>
</tr>
<tr>
<td>Next action</td>
<td>What should the interested person do?</td>
</tr>
<tr>
<td>Follow-up owner</td>
<td>Who replies, and within what working hours?</td>
</tr>
<tr>
<td>Success measure</td>
<td>Which enquiry or sale will count?</td>
</tr>
</tbody>
</table>
<p>If two answers contradict each other, fix the plan before increasing activity. A premium consulting offer with a vague “DM for everything” journey may need a clearer qualification step. A simple local service should not require a long application.</p>
<h2>Run a small, complete cycle</h2>
<p>For the next month, publish a few pieces addressing your chosen buying question. Link them to the same useful destination. Keep a record of enquiries, follow-up and outcomes. At the end, ask where people stopped: did few people arrive, did they leave without asking, or did enquiries fail to become suitable projects?</p>
<p>Those are different problems. More posting will not repair an unanswered form.</p>
<p>Search also needs useful, accessible pages. Google''s <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide">SEO Starter Guide</a> explains the foundations. For AI Overviews and AI Mode, Google says there is no separate special optimisation requirement; ordinary search eligibility and sound SEO still apply. Read its <a href="https://developers.google.com/search/docs/appearance/ai-features">AI search guidance</a> before buying an “AI visibility” shortcut.</p>
<p>Use the <a href="https://www.entrehubng.com/blog/analytics-and-data-driven-marketing-decisions">enquiry measurement worksheet</a> to review the cycle. If the website or marketing journey needs work, explore <a href="https://www.entrehubng.com/#services">Entrehub''s services</a> and describe the priority you want help with.</p>
',"coverImage"='/images/blog/digital-marketing-plan-service-businesses.webp',"coverImageAlt"='Planning cards, notebook and phone arranged on a business desk.',"readTime"='3 min read',"authorId"=(SELECT id FROM "Author" WHERE email='entrehubservices@gmail.com'),published=true,"publishedAt"=CURRENT_TIMESTAMP,"editorialUpdatedAt"=CURRENT_TIMESTAMP,"updatedAt"=CURRENT_TIMESTAMP WHERE slug='the-future-of-digital-marketing-in-2024';
DELETE FROM "_BlogPostTags" WHERE "A"=(SELECT id FROM "BlogPost" WHERE slug='digital-marketing-plan-service-businesses');
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-marketing-strategy','Marketing Strategy','marketing-strategy',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='digital-marketing-plan-service-businesses' AND t.name='Marketing Strategy' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-service-businesses','Service Businesses','service-businesses',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='digital-marketing-plan-service-businesses' AND t.name='Service Businesses' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-websites','Websites','websites',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='digital-marketing-plan-service-businesses' AND t.name='Websites' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-lead-generation','Lead Generation','lead-generation',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='digital-marketing-plan-service-businesses' AND t.name='Lead Generation' ON CONFLICT DO NOTHING;
UPDATE "BlogPost" SET title='SEO for Small Businesses: What to Fix First',slug='seo-best-practices-for-small-businesses',excerpt='A practical SEO checklist for small businesses: check indexing, improve service pages, strengthen local details and measure enquiries without ranking promises.',content='<p>Before commissioning another month of blog posts, check whether a customer can find a useful page about the service you actually sell.</p>
<p>A website can have polished branding and still make that difficult. The service might exist only inside a graphic. The title might say “Home”. The page may explain the company''s ambition while leaving the work, location and enquiry process unclear.</p>
<p>Start with those gaps. A manageable SEO plan connects search visibility with a page that helps someone decide.</p>
<h2>Check access before changing the copy</h2>
<p>Verify ownership in Google Search Console and Bing Webmaster Tools. Submit the sitemap, inspect an important service page and check whether it is eligible for indexing. A submitted sitemap is a discovery aid, not proof that every page is indexed.</p>
<p>If a page should be private, keep it private. Do not unblock admin pages or draft articles simply to make every URL visible. Ask the developer to investigate unexpected redirects, missing pages and accidental indexing restrictions.</p>
<p>Next, search your own site as a visitor would. Can someone reach the service information through ordinary navigation? A page with no meaningful internal links is harder for a customer to discover.</p>
<h2>Give a service page a real purpose</h2>
<p>Choose one service and write down the questions a serious buyer asks: who is it for, what does the work include, what must the customer provide and what happens next?</p>
<p>Answer those questions in readable text. Use a descriptive title and heading. Add authentic examples where permission exists. A small company does not need invented awards or inflated statistics to explain its process well.</p>
<p>When services differ substantially, consider separate useful pages. Do not create dozens of nearly identical pages with a different city name pasted into each one. If a new page offers no additional help, it may not deserve its own URL.</p>
<h2>A first-pass audit you can copy</h2>
<table>
<thead>
<tr>
<th>Check</th>
<th>What good looks like</th>
<th>Your next action</th>
</tr>
</thead>
<tbody>
<tr>
<td>Indexing</td>
<td>Important public pages can be crawled and indexed</td>
<td>Inspect the service page</td>
</tr>
<tr>
<td>Page focus</td>
<td>One clear service or buying question</td>
<td>Remove competing messages</td>
</tr>
<tr>
<td>Title</td>
<td>Describes the page''s actual subject</td>
<td>Rewrite vague titles</td>
</tr>
<tr>
<td>Description</td>
<td>Gives a useful reason to visit</td>
<td>Replace generic promotion</td>
</tr>
<tr>
<td>Internal links</td>
<td>Relevant pages connect naturally</td>
<td>Link from related articles</td>
</tr>
<tr>
<td>Contact details</td>
<td>The business is easy to identify and reach</td>
<td>Check name, address and telephone</td>
</tr>
<tr>
<td>Evidence</td>
<td>Examples and claims can be substantiated</td>
<td>Remove or verify unsupported claims</td>
</tr>
<tr>
<td>Enquiries</td>
<td>Contact actions work on a phone</td>
<td>Complete a real test enquiry</td>
</tr>
</tbody>
</table>
<p>These are priorities for an initial review, not a ranking score or a guarantee.</p>
<h2>Be accurate about local presence</h2>
<p>An eligible Google Business Profile should reflect how the business actually operates. Keep hours and contact details current. An international customer base does not mean you have an office in every country you serve.</p>
<p>Google describes local results through relevance, distance and prominence in its <a href="https://support.google.com/business/answer/7091">local ranking guidance</a>. Publishing more posts cannot change the physical distance between your office and a searcher. Accurate information and a useful website are better foundations than imaginary locations.</p>
<h2>Review progress against the work completed</h2>
<p>Write down what changed and when. In Search Console, compare the queries and pages receiving impressions and clicks. Then connect those visits with enquiries using the <a href="https://www.entrehubng.com/blog/analytics-and-data-driven-marketing-decisions">measurement worksheet</a>.</p>
<p>If visibility grows but suitable enquiries do not, review the offer and page. If nobody can find the page, investigate discovery and relevance. Resist changing everything at once; you will struggle to understand which work helped.</p>
<p>For the technical starting point, use Google''s <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide">SEO Starter Guide</a>. For help reviewing your own site, see <a href="https://www.entrehubng.com/#services">Entrehub''s website and SEO services</a>.</p>
',"coverImage"='/images/blog/seo-best-practices-for-small-businesses.webp',"coverImageAlt"='A paper checklist and magnifying glass beside a laptop.',"readTime"='3 min read',"authorId"=(SELECT id FROM "Author" WHERE email='entrehubservices@gmail.com'),published=true,"publishedAt"=CURRENT_TIMESTAMP,"editorialUpdatedAt"=CURRENT_TIMESTAMP,"updatedAt"=CURRENT_TIMESTAMP WHERE slug='seo-best-practices-for-small-businesses';
DELETE FROM "_BlogPostTags" WHERE "A"=(SELECT id FROM "BlogPost" WHERE slug='seo-best-practices-for-small-businesses');
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-seo','SEO','seo',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='seo-best-practices-for-small-businesses' AND t.name='SEO' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-small-business','Small Business','small-business',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='seo-best-practices-for-small-businesses' AND t.name='Small Business' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-local-seo','Local SEO','local-seo',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='seo-best-practices-for-small-businesses' AND t.name='Local SEO' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-website-content','Website Content','website-content',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='seo-best-practices-for-small-businesses' AND t.name='Website Content' ON CONFLICT DO NOTHING;
UPDATE "BlogPost" SET title='Social Media Management: What Your Retainer Should Include',slug='social-media-marketing-strategies-that-work',excerpt='Compare social media management proposals using a clear checklist for content, approvals, replies and reporting. Know what your monthly retainer includes.',content='<p>“Twenty posts a month” sounds specific until you ask what counts as a post.</p>
<p>Does one video published on three platforms count once or three times? Who records it? Are captions included? If a potential customer sends a message on Saturday evening, is somebody expected to answer?</p>
<p>A useful social media proposal resolves those questions before the first invoice. Post count matters, but the delivery arrangements matter just as much.</p>
<h2>Start with the business purpose</h2>
<p>Choose the job social media should do. A consultant may need to explain their approach and attract suitable discovery calls. A product business may need demonstrations, availability updates and a clear buying route. A personal brand may need stronger recognition around one area of expertise.</p>
<p>The account should not have to chase every trend to meet that purpose. Ask what the proposed content will help a customer understand or do.</p>
<p>Use the <a href="https://www.entrehubng.com/blog/content-marketing-creating-value-for-your-audience">content brief template</a> to connect each piece to a real question. This makes approval more useful than a debate about which design looks nicest.</p>
<h2>Compare proposals using the same definitions</h2>
<table>
<thead>
<tr>
<th>Item</th>
<th>Question to settle</th>
</tr>
</thead>
<tbody>
<tr>
<td>Platforms</td>
<td>Which accounts are included?</td>
</tr>
<tr>
<td>Core content</td>
<td>How many original pieces, in which formats?</td>
</tr>
<tr>
<td>Adaptations</td>
<td>What changes when one piece is used elsewhere?</td>
</tr>
<tr>
<td>Production</td>
<td>Who supplies footage, photographs and subject expertise?</td>
</tr>
<tr>
<td>Approval</td>
<td>Who signs off, and by what deadline?</td>
</tr>
<tr>
<td>Revisions</td>
<td>How many review rounds are included?</td>
</tr>
<tr>
<td>Replies</td>
<td>Which comments or messages are handled, and during what hours?</td>
</tr>
<tr>
<td>Escalation</td>
<td>Who deals with complaints, private information or sensitive questions?</td>
</tr>
<tr>
<td>Reporting</td>
<td>Which business measures will be reviewed?</td>
</tr>
<tr>
<td>Exclusions</td>
<td>What requires a separate scope or fee?</td>
</tr>
</tbody>
</table>
<p>This is a proposal comparison aid, not a legal contract. The agreed scope still needs clear commercial terms.</p>
<h2>Separate original work from distribution</h2>
<p>Here is a hypothetical scope: eight original videos and four original graphics, adapted for two agreed platforms. That is twelve core pieces. It is not automatically twenty-four separate creative concepts.</p>
<p>A report should show original production and distribution separately. A platform-specific caption or crop can be useful work, but it should not obscure how much original material was created.</p>
<p>For a founder who will appear on camera, agree the recording method early. A short guided batch session may be realistic; daily polished filming may not be. The schedule should reflect the person''s actual availability.</p>
<h2>Make approvals workable</h2>
<p>Agree a single place for feedback and one decision-maker. Give feedback against the brief: accuracy, clarity, audience and the intended next step. “Make it pop” offers little direction.</p>
<p>Decide what happens when approval is late. A paused post is often preferable to publishing unapproved claims. Sensitive work, including counselling or health-related communication, needs appropriate professional review and a clear escalation route.</p>
<p>Keep account ownership with the business and give contributors only the access they need. Agree handover arrangements so an ongoing relationship does not leave the business dependent on one person''s login.</p>
<h2>Ask for a report you can act on</h2>
<p>Reach and engagement can help explain distribution, but also review suitable enquiries, response handling and completed sales where tracking allows it. Use the <a href="https://www.entrehubng.com/blog/analytics-and-data-driven-marketing-decisions">marketing measurement guide</a> to avoid confusing activity with commercial progress.</p>
<p>A good monthly conversation ends with a decision: repeat a useful format, improve the offer page, adjust the recording process or clarify the call to action.</p>
<p>If you are comparing support options, explore <a href="https://www.entrehubng.com/#services">Entrehub''s social media and content services</a>. Bring the proposal checklist so the discussion covers responsibilities as well as deliverables.</p>
',"coverImage"='/images/blog/social-media-marketing-strategies-that-work.webp',"coverImageAlt"='Hands recording a product demonstration with a phone on a tripod.',"readTime"='3 min read',"authorId"=(SELECT id FROM "Author" WHERE email='entrehubservices@gmail.com'),published=true,"publishedAt"=CURRENT_TIMESTAMP,"editorialUpdatedAt"=CURRENT_TIMESTAMP,"updatedAt"=CURRENT_TIMESTAMP WHERE slug='social-media-marketing-strategies-that-work';
DELETE FROM "_BlogPostTags" WHERE "A"=(SELECT id FROM "BlogPost" WHERE slug='social-media-marketing-strategies-that-work');
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-social-media','Social Media','social-media',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='social-media-marketing-strategies-that-work' AND t.name='Social Media' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-personal-branding','Personal Branding','personal-branding',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='social-media-marketing-strategies-that-work' AND t.name='Personal Branding' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-retainers','Retainers','retainers',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='social-media-marketing-strategies-that-work' AND t.name='Retainers' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-content-planning','Content Planning','content-planning',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='social-media-marketing-strategies-that-work' AND t.name='Content Planning' ON CONFLICT DO NOTHING;
UPDATE "BlogPost" SET title='A Content Brief That Answers Real Customer Questions',slug='content-marketing-creating-value-for-your-audience',excerpt='Turn a customer question into a useful article or video with this content brief. Define the answer, evidence, format and next step before creating anything.',content='<p>The next useful topic may already be in your inbox.</p>
<p>“How long will the website take?” “What do I need to provide?” “Can we start with one platform?” These are buying questions. Answering one clearly can be more useful than publishing another broad article about the importance of marketing.</p>
<p>Before writing, decide what the reader needs to understand and what evidence you can honestly provide. A short brief gives the writer, designer and reviewer the same destination.</p>
<h2>Choose a question with a decision behind it</h2>
<p>Collect recurring questions from enquiries and sales conversations. Remove personal details before using them in planning. Group similar questions and identify the decision each one supports.</p>
<p>“Do I need a website?” is broad. “What should my website explain before I send visitors from Instagram?” is easier to turn into a practical piece. It also connects naturally to the <a href="https://www.entrehubng.com/blog/digital-marketing-plan-service-businesses">marketing plan</a>.</p>
<p>Do not claim a topic has high search demand without data. A question can still be worth answering because it helps existing prospects or reduces confusion during onboarding.</p>
<h2>Copy this brief before making the asset</h2>
<table>
<thead>
<tr>
<th>Field</th>
<th>What to write</th>
</tr>
</thead>
<tbody>
<tr>
<td>Reader</td>
<td>The person and situation you are addressing</td>
</tr>
<tr>
<td>Question</td>
<td>The one question the piece will answer</td>
</tr>
<tr>
<td>Short answer</td>
<td>Your answer in two or three plain sentences</td>
</tr>
<tr>
<td>Decision</td>
<td>What the reader can decide afterwards</td>
</tr>
<tr>
<td>Evidence</td>
<td>Sources, approved examples or a demonstration</td>
</tr>
<tr>
<td>Boundaries</td>
<td>What you cannot verify or promise</td>
</tr>
<tr>
<td>Format</td>
<td>Article, video, checklist or another suitable form</td>
</tr>
<tr>
<td>Next step</td>
<td>One relevant action or resource</td>
</tr>
<tr>
<td>Reviewer</td>
<td>The person responsible for factual approval</td>
</tr>
<tr>
<td>Maintenance</td>
<td>What would make the piece out of date?</td>
</tr>
</tbody>
</table>
<p>Keep the brief small enough to use. It should clarify the work rather than become another document nobody opens.</p>
<h2>A worked example</h2>
<p>Imagine a web developer is answering, “What should I prepare before a website project starts?”</p>
<p>The reader is an owner who has decided to build but has not organised the material. The short answer is to prepare the offer, page information, approved brand assets, contact details and access arrangements. The useful asset is a checklist showing who supplies each item and when.</p>
<p>The evidence can be a demonstration with a fictional business. If a real project is used, obtain permission and check what may be shown. Do not turn an imagined example into a client case study by giving it a realistic company name and invented results.</p>
<p>The next step could be a project enquiry. It does not need three booking buttons, a newsletter offer and a discount competing for attention.</p>
<h2>Edit for usefulness, then for style</h2>
<p>Read the draft and ask whether the main answer appears early. Replace statements such as “content is king” with the actual information the reader needs. Explain specialist terms or remove them.</p>
<p>Check every number, quote and claimed outcome. Link to primary sources near the relevant claim. Google''s <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content">people-first content guidance</a> is a useful quality check, particularly when a draft offers little beyond summaries already available elsewhere.</p>
<p>A natural voice comes from clear judgment and specific detail. Artificially adding spelling mistakes or casual phrases will not supply missing substance.</p>
<h2>Give the piece a life beyond publication</h2>
<p>Turn the useful part into a format someone can reference: a checklist, short example or blank worksheet. Share it with a relevant community only when it actually helps their audience. Do not insist on a link in return.</p>
<p>Review it when the underlying process changes. A current, reliable resource is easier to recommend than an abandoned article.</p>
<p>For help developing the brief into an article, video or campaign, see <a href="https://www.entrehubng.com/#services">Entrehub''s creative and content services</a>. If delivery will be ongoing, use the <a href="https://www.entrehubng.com/blog/social-media-marketing-strategies-that-work">retainer checklist</a> to agree responsibilities.</p>
',"coverImage"='/images/blog/content-marketing-creating-value-for-your-audience.webp',"coverImageAlt"='Notebook, planning cards and pencil arranged into a content brief.',"readTime"='3 min read',"authorId"=(SELECT id FROM "Author" WHERE email='entrehubservices@gmail.com'),published=true,"publishedAt"=CURRENT_TIMESTAMP,"editorialUpdatedAt"=CURRENT_TIMESTAMP,"updatedAt"=CURRENT_TIMESTAMP WHERE slug='content-marketing-creating-value-for-your-audience';
DELETE FROM "_BlogPostTags" WHERE "A"=(SELECT id FROM "BlogPost" WHERE slug='content-marketing-creating-value-for-your-audience');
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-content-marketing','Content Marketing','content-marketing',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='content-marketing-creating-value-for-your-audience' AND t.name='Content Marketing' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-customer-questions','Customer Questions','customer-questions',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='content-marketing-creating-value-for-your-audience' AND t.name='Customer Questions' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-content-brief','Content Brief','content-brief',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='content-marketing-creating-value-for-your-audience' AND t.name='Content Brief' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-personal-branding','Personal Branding','personal-branding',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='content-marketing-creating-value-for-your-audience' AND t.name='Personal Branding' ON CONFLICT DO NOTHING;
UPDATE "BlogPost" SET title='A Three-Email Welcome Sequence for a Service Business',slug='email-marketing-automation-for-better-roi',excerpt='Plan a simple welcome email sequence that delivers what subscribers requested, answers a buying question and offers a next step. Includes editable examples.',content='<p>Someone downloads your checklist and hears nothing from you. Three weeks later, they receive a sales promotion they barely recognise.</p>
<p>A short welcome sequence can make that handover more useful. It should deliver what the subscriber requested, help them use it and explain an appropriate next step. You do not need a complicated automation map to begin.</p>
<p>This example is for people who voluntarily sign up for your marketing emails. A sales enquiry is not automatically permission to receive an unrelated newsletter. Keep enquiry replies and subscribed marketing journeys distinct.</p>
<h2>Email one: deliver the promised resource</h2>
<p><strong>Suggested timing:</strong> Immediately after confirmed signup and the relevant permission checks.<br>
<strong>Example subject:</strong> Your website planning checklist</p>
<p>Hello [first name],</p>
<p>Here is the website planning checklist you requested: [resource link].</p>
<p>Start with the section on your main offer. Write down what someone can buy, who it is for and what they need to provide. Those answers will make the rest of the brief easier.</p>
<p>I''ll send two short follow-up notes about preparing the content and deciding what to build first. You can unsubscribe at any time.</p>
<p>Gabriel</p>
<p>Replace every placeholder before activation. The resource must exist and the form must describe what the subscriber will receive. Do not announce a daily newsletter when your plan is three messages.</p>
<h2>Email two: remove one obstacle</h2>
<p><strong>Suggested timing:</strong> Two days later, as a starting test rather than a universal rule.<br>
<strong>Example subject:</strong> What needs to be ready before design starts?</p>
<p>A website project becomes easier to plan when the service information is organised first.</p>
<p>Choose one offer and list its audience, deliverables, contact route and the questions a customer usually asks. If some material is missing, mark who will prepare it. You can improve the wording later; the important thing is knowing what needs to be said.</p>
<p>Our <a href="https://www.entrehubng.com/blog/content-marketing-creating-value-for-your-audience">content brief</a> can help you organise those answers.</p>
<p>Gabriel</p>
<p>The point is to help the reader make progress. Do not turn this message into a catalogue of everything your business sells.</p>
<h2>Email three: offer an appropriate conversation</h2>
<p><strong>Suggested timing:</strong> A few days after the second email.<br>
<strong>Example subject:</strong> Want help choosing your next website priority?</p>
<p>If the planning checklist has raised more questions, you can <a href="https://www.entrehubng.com/#services">explore our website services</a> and tell us what you are working towards.</p>
<p>A useful starting message includes the business, the main offer, your existing website if you have one, and the change you want to make. We can then discuss whether the priority is a new build, clearer content or improvements to the enquiry journey.</p>
<p>Gabriel</p>
<p>This invitation should fit the offer and the team''s capacity. Do not promise an instant audit, fixed delivery time or free consultation unless you actually provide it.</p>
<h2>Test the rules before turning it on</h2>
<p>Write down the entry trigger, each delay and the conditions that stop or change the sequence. Unsubscribed contacts must not continue receiving it. A subscriber who becomes a client may need a different journey rather than more sales prompts.</p>
<p>Check the sending address, reply inbox, resource links and mobile layout. Use an email provider with appropriate unsubscribe handling and suppression controls. Google''s <a href="https://support.google.com/mail/answer/81126">sender guidelines</a> explain authentication and delivery requirements for mail sent to Gmail; exact requirements depend on sending volume and type. Have the provider''s configuration checked rather than copying DNS records blindly.</p>
<p>Review meaningful actions: resource use, suitable replies and enquiries. Open tracking is imperfect, so avoid judging the sequence solely by opens. Use the <a href="https://www.entrehubng.com/blog/analytics-and-data-driven-marketing-decisions">measurement worksheet</a> to connect activity with outcomes.</p>
<p>Entrehub provides <a href="https://www.entrehubng.com/#services">email marketing support</a> for businesses that need help preparing the messages and delivery process.</p>
',"coverImage"='/images/blog/email-marketing-automation-for-better-roi.webp',"coverImageAlt"='Three cream envelopes beside a navy notebook.',"readTime"='3 min read',"authorId"=(SELECT id FROM "Author" WHERE email='entrehubservices@gmail.com'),published=true,"publishedAt"=CURRENT_TIMESTAMP,"editorialUpdatedAt"=CURRENT_TIMESTAMP,"updatedAt"=CURRENT_TIMESTAMP WHERE slug='email-marketing-automation-for-better-roi';
DELETE FROM "_BlogPostTags" WHERE "A"=(SELECT id FROM "BlogPost" WHERE slug='email-marketing-automation-for-better-roi');
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-email-marketing','Email Marketing','email-marketing',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='email-marketing-automation-for-better-roi' AND t.name='Email Marketing' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-welcome-emails','Welcome Emails','welcome-emails',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='email-marketing-automation-for-better-roi' AND t.name='Welcome Emails' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-automation','Automation','automation',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='email-marketing-automation-for-better-roi' AND t.name='Automation' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-service-businesses','Service Businesses','service-businesses',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='email-marketing-automation-for-better-roi' AND t.name='Service Businesses' ON CONFLICT DO NOTHING;
UPDATE "BlogPost" SET title='Track Marketing Enquiries: A Small-Business Worksheet',slug='analytics-and-data-driven-marketing-decisions',excerpt='Track where enquiries come from, which become proposals and what turns into sales. Use a simple worksheet and worked example to guide marketing decisions.',content='<p>A busy inbox can hide a weak sales process. Ten messages may mean ten suitable prospects, two genuine enquiries and eight unrelated requests, or one person contacting you repeatedly.</p>
<p>Before building a dashboard, agree what you will count. Then record what happens after the first conversation. A small, consistent worksheet can tell you more than a report filled with numbers nobody uses.</p>
<h2>Define the stages</h2>
<p>An <strong>enquiry</strong> is a genuine request about a service you provide. A <strong>qualified enquiry</strong> meets your agreed criteria, such as scope, location, timing and budget fit. A <strong>proposal</strong> is an actual offer sent to that prospect. A <strong>won project</strong> meets your chosen definition, such as an accepted agreement and required initial payment.</p>
<p>Use the same definitions each month. Do not count a comment saying “nice work” as a lead or treat every quotation request as a suitable customer.</p>
<p>For sensitive enquiries, keep the sheet minimal. Avoid copying personal stories or confidential details into a shared marketing report. Use a reference number and store necessary customer information in an appropriately controlled system.</p>
<h2>Copy this enquiry worksheet</h2>
<table>
<thead>
<tr>
<th>Enquiry reference</th>
<th>Date</th>
<th>Reported source</th>
<th>Service</th>
<th>Qualified?</th>
<th>Next action/date</th>
<th>Proposal sent?</th>
<th>Outcome</th>
<th>Recorded revenue</th>
</tr>
</thead>
<tbody>
<tr>
<td>Example-001</td>
<td>Example date</td>
<td>Instagram</td>
<td>Website</td>
<td>Yes</td>
<td>Arrange scope discussion</td>
<td>No</td>
<td>Open</td>
<td>—</td>
</tr>
<tr>
<td>Your entry</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
<p>Add a “source confidence” field if you can: self-reported, campaign-tagged, referral confirmed or unknown. A customer may have encountered the business several times before enquiring. Do not force every sale into the last link they clicked.</p>
<p>Ask a simple question during the conversation: “How did you hear about us?” Record the answer alongside website data rather than treating either as perfect.</p>
<h2>Use a worked example to read the figures</h2>
<p>Suppose a business records 20 enquiries, qualifies 8, sends 5 proposals and wins 2 projects. These are invented numbers for explanation, not Entrehub''s results.</p>
<p>Its enquiry qualification rate is 8 ÷ 20 = <strong>40%</strong>. Its proposal win rate is 2 ÷ 5 = <strong>40%</strong>. Its enquiry-to-win rate is 2 ÷ 20 = <strong>10%</strong>.</p>
<p>Those percentages answer different questions. If many enquiries are unsuitable, review targeting and the service information. If suitable prospects do not receive proposals, examine follow-up and capacity. If proposals are sent but rarely accepted, discuss fit, scope and objections before increasing advertising.</p>
<p>Small samples are noisy. One additional project can change a monthly rate substantially. Read the underlying conversations and longer trend before making a large spending decision.</p>
<h2>Connect website data carefully</h2>
<p>Google Analytics supports campaign parameters such as <code>utm_source</code>, <code>utm_medium</code> and <code>utm_campaign</code> in links, as explained in its <a href="https://support.google.com/analytics/answer/10917952">campaign URL guidance</a>. Agree a naming convention before sharing links so reports do not split one campaign into several inconsistent labels.</p>
<p>For example, an approved newsletter link could use <code>utm_source=newsletter</code>, <code>utm_medium=email</code> and a descriptive campaign name. Do not put names, email addresses or other personal data in tracking URLs. Do not tag ordinary internal navigation links as campaigns.</p>
<p>A click on a contact button indicates intent, not a completed sale. Test that form-success events reflect successful submission and that sales are recorded separately. Tracking can be incomplete because of consent choices, blocked scripts or journeys that move offline.</p>
<h2>Hold a short monthly review</h2>
<p>Look at five things: genuine enquiries, qualified enquiries, proposals, wins and the value recorded under your chosen revenue definition. Compare sources, but retain “unknown” where the evidence is missing.</p>
<p>Finish by choosing one change. It might be clearer service information, faster follow-up during working hours or a better qualification question. Use the <a href="https://www.entrehubng.com/blog/digital-marketing-plan-service-businesses">marketing planning sheet</a> to connect that decision to next month''s activity.</p>
<p>If you need help connecting website behaviour with business reporting, explore <a href="https://www.entrehubng.com/#services">Entrehub''s digital marketing services</a>.</p>
',"coverImage"='/images/blog/analytics-and-data-driven-marketing-decisions.webp',"coverImageAlt"='Calculator and paper worksheet on a business desk.',"readTime"='3 min read',"authorId"=(SELECT id FROM "Author" WHERE email='entrehubservices@gmail.com'),published=true,"publishedAt"=CURRENT_TIMESTAMP,"editorialUpdatedAt"=CURRENT_TIMESTAMP,"updatedAt"=CURRENT_TIMESTAMP WHERE slug='analytics-and-data-driven-marketing-decisions';
DELETE FROM "_BlogPostTags" WHERE "A"=(SELECT id FROM "BlogPost" WHERE slug='analytics-and-data-driven-marketing-decisions');
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-marketing-analytics','Marketing Analytics','marketing-analytics',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='analytics-and-data-driven-marketing-decisions' AND t.name='Marketing Analytics' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-lead-tracking','Lead Tracking','lead-tracking',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='analytics-and-data-driven-marketing-decisions' AND t.name='Lead Tracking' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-small-business','Small Business','small-business',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='analytics-and-data-driven-marketing-decisions' AND t.name='Small Business' ON CONFLICT DO NOTHING;
INSERT INTO "Tag" (id,name,slug,"updatedAt") VALUES ('tag-editorial-reporting','Reporting','reporting',CURRENT_TIMESTAMP) ON CONFLICT (name) DO NOTHING;
INSERT INTO "_BlogPostTags" ("A","B") SELECT p.id,t.id FROM "BlogPost" p,"Tag" t WHERE p.slug='analytics-and-data-driven-marketing-decisions' AND t.name='Reporting' ON CONFLICT DO NOTHING;
COMMIT;
