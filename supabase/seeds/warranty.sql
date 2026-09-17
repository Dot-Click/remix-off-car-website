-- Warranty page seed content
-- Matches src/lib/cms-schema.ts keys: warranty:hero, warranty:plans, warranty:covered, warranty:cta
-- Note: "plans" cards are used for the benefit cards shown on this page (icon cards);
-- the "price" field defined in the schema is not used by the current page design.

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Warranty & Protection', 'Drive With Confidence', NULL, 'Every vehicle deserves peace of mind. Explore our warranty options and vehicle protection.', 'Speak To Our Team', '/contact', NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'warranty'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'plans', 'Benefit Cards', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "Warranty Protection", "text": "12 months'' comprehensive cover included with every vehicle we sell.", "price": ""},
    {"title": "Vehicle Support", "text": "Repairs at any VAT-registered garage in the UK — no approved-network limits.", "price": ""},
    {"title": "Peace Of Mind", "text": "Parts and labour paid directly to the garage, so there''s nothing to reclaim.", "price": ""},
    {"title": "Professional Assistance", "text": "A named advisor handles your claim from first call to completed repair.", "price": ""}
  ]'::jsonb,
  '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'warranty'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'covered', 'What''s Covered', 3, 'The detail', 'What your cover includes', NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    "Engine and cylinder head",
    "Gearbox, clutch and transmission",
    "Turbocharger and fuel system",
    "Drivetrain, axles and differentials",
    "Braking and steering components",
    "Suspension and wheel bearings",
    "Cooling and heating systems",
    "Electrics, ECUs and sensors",
    "Air conditioning components",
    "Hybrid and EV drive units"
  ]'::jsonb,
  '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'warranty'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'cta', 'Still Have A Question CTA', 4, NULL, 'Still have a question?', NULL, 'Our warranty team will talk you through exactly what''s covered on the car you''re considering.', 'Speak To Our Team', '/contact', 'Browse Our Stock', '/stocklist', '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'warranty'
ON CONFLICT (page_id, section_key) DO NOTHING;
