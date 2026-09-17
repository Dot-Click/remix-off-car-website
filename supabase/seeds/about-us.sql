-- Seed content for the About Us page (public.page_sections)
-- Safe to re-run: ON CONFLICT (page_id, section_key) DO NOTHING.

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'About J1 Autoland', 'Driven By Quality. Built On Trust.', NULL,
  'An independent dealership where every vehicle is chosen, prepared and described the way we''d want it done for ourselves.',
  'Explore Our Stock', '/stocklist', NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'about-us'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'stats', 'Statistics', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"value": 100, "suffix": "+", "label": "Vehicles in stock"},
    {"value": 500, "suffix": "+", "label": "Happy customers"},
    {"value": 5, "suffix": "-Star", "label": "Rated service"},
    {"value": 165, "suffix": "-Point", "label": "Quality checked"}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'about-us'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'story', 'Our Story', 3, 'Our story', 'Built one honest handover at a time', NULL,
  'J1 Autoland started with a handful of carefully chosen cars and a simple belief: buying a used vehicle should feel as good as driving one. Today we hold over 100 vehicles at our Birmingham site, and the approach hasn''t changed — we only sell cars we would happily put a member of our own family in.',
  NULL, NULL, NULL, NULL,
  '[
    {"title": "Our mission", "text": "To make buying, financing and part-exchanging a car straightforward, transparent and genuinely enjoyable — with the full condition of every vehicle on the table before anyone signs anything."}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'about-us'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'commitment', 'Our Commitment', 4, 'Our commitment', 'Prepared properly, priced fairly, backed afterwards', NULL,
  'Preparation happens in our own workshop, pricing is checked daily against live market data, and support continues long after you drive away. If something isn''t right, we fix it — that''s the whole commitment.',
  NULL, NULL, NULL, NULL,
  '[
    "165-point mechanical inspection",
    "Full HPI and mileage verification",
    "Fresh MOT and service where due",
    "12 months'' warranty as standard",
    "Nationwide delivery available",
    "Aftercare from a named advisor"
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'about-us'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'why', 'Why Choose Us', 5, 'Why choose us', 'Why customers choose J1 Autoland', NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "Quality Vehicles", "text": "Every car passes a 165-point inspection, full history check and workshop preparation before it goes on sale."},
    {"title": "Transparent Pricing", "text": "The price you see is the price you pay. No admin fees, no preparation charges, no surprises at handover."},
    {"title": "Flexible Finance", "text": "PCP, HP and lease purchase from a panel of 22 lenders, with soft-search quotes that don''t mark your credit file."},
    {"title": "Part Exchange", "text": "A fair, same-day offer on your current car that can go straight into your deposit."},
    {"title": "Customer Support", "text": "A named contact from first enquiry through to years after handover — not a call centre queue."},
    {"title": "Warranty Options", "text": "12 months'' cover as standard with extended plans and nationwide repairs available."}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'about-us'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'cta', 'Call To Action', 6, NULL, 'Ready to find your next car?', NULL,
  'Browse the current stock list or come and see us at our showroom.',
  'Explore Our Stock', '/stocklist', 'Find Us', '/find-us', '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'about-us'
ON CONFLICT (page_id, section_key) DO NOTHING;
