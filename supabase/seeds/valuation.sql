-- Valuation page seed content
-- Matches src/lib/cms-schema.ts keys: valuation:hero, valuation:form, valuation:steps, valuation:cta

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Vehicle Valuation', 'What''s Your Car Worth?', NULL, 'Get a valuation for your vehicle and discover how much it could be worth.', NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'valuation'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'form', 'Valuation Form', 2, NULL, 'Your vehicle', NULL, 'No obligation. We''ll never pass your details to a third party.', 'Request Valuation', NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'valuation'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'steps', 'Why Value Your Car With Us', 3, NULL, 'Why Value Your Car With Us?', NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "Fair Valuation", "text": "Live market data, auction results and retail demand — not a lowball guess."},
    {"title": "Fast Response", "text": "A real figure from a real buyer within one working hour, seven days a week."},
    {"title": "Simple Process", "text": "One short form, no haggling, no obligation and no admin fees."},
    {"title": "Part Exchange Available", "text": "Put every penny of your valuation straight into your next car."}
  ]'::jsonb,
  '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'valuation'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'cta', 'Talk It Through CTA', 4, NULL, 'Prefer to talk it through?', NULL, 'Our buying team is on the phone seven days a week.', NULL, NULL, 'Contact Our Team', '/contact', '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'valuation'
ON CONFLICT (page_id, section_key) DO NOTHING;
