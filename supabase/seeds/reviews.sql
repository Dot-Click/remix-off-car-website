INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Trusted By Our Customers', 'What Our Customers Say', NULL, 'Real customers. Real experiences. 4.9 out of 5 from 2,417 verified buyers across Google, Autotrader and our own aftercare surveys.', NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'reviews'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'intro', 'Trust Section', 2, 'Real Customers. Real Experiences.', 'Every review is left by a verified buyer', NULL, 'We never filter, edit or remove feedback. Our Google profile is updated live with each new handover, so what you read is exactly what our customers wrote.', NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'reviews'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'cta', 'CTA Section', 3, NULL, NULL, NULL, NULL, 'Find Your Next Car', '/stocklist', NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'reviews'
ON CONFLICT (page_id, section_key) DO NOTHING;
