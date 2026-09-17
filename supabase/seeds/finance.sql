INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Finance', 'Make Your Next Car More Affordable', NULL,
  'Explore flexible finance options designed around your budget. FCA-registered credit broker working with 22 lenders — soft-search quotes with no impact on your credit score.',
  'Calculate Finance', '#calculator', 'Apply For Finance', '#apply', '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'finance'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'products', 'How Finance Works', 2, 'How finance works', 'Four simple steps', NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "Choose Your Vehicle", "text": "Pick any car from our stock list — finance is available across the range."},
    {"title": "Calculate Your Payments", "text": "Set your deposit and term to see an accurate monthly figure."},
    {"title": "Apply For Finance", "text": "One short soft-search application, checked across 22 lenders."},
    {"title": "Drive Away", "text": "Sign digitally and collect, or we deliver nationwide to your door."}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'finance'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'calculator', 'Payment Calculator', 3, NULL, 'Monthly payment estimator', NULL,
  'Representative example based on 6.9% APR. Figures are indicative and subject to status.',
  NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'finance'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'why', 'Why Finance With Us', 4, NULL, 'Why finance with J1 Autoland', NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "22 lenders, one form", "text": "We shop your application across the market to find the sharpest rate."},
    {"title": "No credit footprint", "text": "Soft-search quotes are invisible to other lenders."},
    {"title": "Flexible terms", "text": "12 to 60 months, with or without a deposit."},
    {"title": "Settle any time", "text": "No early repayment penalties on any agreement."}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'finance'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'faq', 'Finance FAQ', 5, NULL, 'Finance questions', NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "Will a quote affect my credit score?", "text": "No. We run a soft search to give you an accurate quote, which is invisible to other lenders and leaves no footprint."},
    {"title": "What deposit do I need?", "text": "None. We offer zero-deposit agreements, though a larger deposit reduces your monthly payment and total interest."},
    {"title": "Can I settle the agreement early?", "text": "Yes. Every agreement we arrange allows early settlement with no penalty charges."},
    {"title": "Do you accept part exchange as a deposit?", "text": "Absolutely. Any equity in your current car can be used as all or part of your deposit."},
    {"title": "Can I get finance with poor credit?", "text": "We work with 22 lenders including specialists in adverse credit, so we can usually find an option."}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'finance'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'cta', 'Finance CTA', 6, NULL, NULL, NULL, NULL, 'Find a car to finance', '/stocklist', NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'finance'
ON CONFLICT (page_id, section_key) DO NOTHING;
