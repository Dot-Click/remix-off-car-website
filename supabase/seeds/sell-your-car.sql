INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Sell or part exchange', 'We''ll buy your car today', NULL, 'Enter your registration for a free, no-obligation valuation. We pay same day by bank transfer, collect free of charge and handle all the paperwork.', NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'sell-your-car'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'steps', 'How It Works', 2, NULL, 'How it works', NULL, NULL, NULL, NULL, NULL, NULL,
'[
  {"title": "Send us the details", "text": "Registration, mileage and a few photos is all we need."},
  {"title": "Get your valuation", "text": "A real buyer prices your car within two working hours."},
  {"title": "We collect, you get paid", "text": "Free collection nationwide and same-day bank transfer."}
]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'sell-your-car'
ON CONFLICT (page_id, section_key) DO NOTHING;
