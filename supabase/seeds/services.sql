-- Seed content for the Services page (public.page_sections)
-- Safe to re-run: ON CONFLICT (page_id, section_key) DO NOTHING.

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Our Services', 'More Than Just A Car Dealership', NULL,
  'From finding your next vehicle to keeping it in excellent condition, we''re here to help.',
  'Browse Our Stock', '/stocklist', NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'services'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'intro', 'Intro', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'services'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'services', 'Service Cards', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "Vehicle Sales", "text": "Over 100 hand-selected vehicles, each inspected, prepared and honestly described.", "image": "", "url": "/stocklist"},
    {"title": "Vehicle Sourcing", "text": "Tell us the exact specification you want and we''ll find it through our trade network.", "image": "", "url": "/contact"},
    {"title": "Finance", "text": "PCP, HP and lease purchase from a panel of 22 lenders with soft-search quotes.", "image": "", "url": "/finance"},
    {"title": "Part Exchange", "text": "Use your current car as your deposit with a same-day, no-obligation offer.", "image": "", "url": "/part-exchange"},
    {"title": "Vehicle Valuation", "text": "A fair, market-accurate figure for your vehicle within one working hour.", "image": "", "url": "/valuation"},
    {"title": "Warranty", "text": "12 months'' cover as standard with extended protection options available.", "image": "", "url": "/warranty"},
    {"title": "After-Sales Support", "text": "A named contact after handover for servicing, claims and any question at all.", "image": "", "url": "/find-us"},
    {"title": "Vehicle Preparation", "text": "165-point inspection, full valet, fresh MOT and service before every handover.", "image": "", "url": "/about-us"}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'services'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'process', 'Process Steps', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "Sourcing done properly", "text": "If it isn''t on the forecourt, we''ll find it. Our buyers work auctions, main-dealer part exchanges and private collections daily, so the exact colour, spec and mileage you want is usually only days away."},
    {"title": "Prepared to a standard you can see", "text": "Every vehicle goes through our workshop before it reaches the display floor: mechanical inspection, brake and tyre assessment, diagnostics, paint correction and a full valet inside and out."}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'services'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'cta', 'Call To Action', 5, NULL, 'Need Help Finding The Right Vehicle?', NULL,
  'Our team will match your budget, mileage and specification to the right car — or source it for you. Call us or send us a message.',
  'Contact Us', '/contact', NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'services'
ON CONFLICT (page_id, section_key) DO NOTHING;
