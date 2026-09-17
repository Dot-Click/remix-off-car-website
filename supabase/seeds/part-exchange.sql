INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Part exchange', 'Trade in, drive out', NULL, 'Use your current car as your deposit. We settle any outstanding finance directly with your lender and handle the DVLA paperwork for you.', NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'part-exchange'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'benefits', 'Good To Know', 2, NULL, 'Good to know', NULL, NULL, NULL, NULL, NULL, NULL, '["We settle outstanding finance directly with your lender.", "Any equity goes straight towards your new car''s deposit.", "No admin fees, ever.", "Valuations held for 7 days or 250 miles."]'::jsonb,
'{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'part-exchange'
ON CONFLICT (page_id, section_key) DO NOTHING;
