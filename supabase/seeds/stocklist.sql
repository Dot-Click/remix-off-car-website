-- Stocklist page seed content
-- Matches src/lib/cms-schema.ts keys: stocklist:hero, stocklist:intro
-- Note: only the hero is currently rendered on this page; "intro" is defined in the
-- schema for future use but has no matching copy block in the current page design.

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Our Vehicles', 'Find Your Next Car', NULL, 'Explore our latest selection of quality vehicles from trusted manufacturers — every car inspected across 165 points, warranted and available with finance or nationwide delivery.', NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'stocklist'
ON CONFLICT (page_id, section_key) DO NOTHING;
