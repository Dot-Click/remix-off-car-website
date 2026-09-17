INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Visit Our Showroom', 'Visit J1 Autoland', NULL, 'Come and view our latest vehicles and speak with our team.', 'Call Us', NULL, 'WhatsApp', NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'find-us'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'details', 'Location Details', 2, NULL, 'Address', NULL, 'Free customer parking on site. Five minutes from the A41 in Birmingham.', NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'find-us'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hours', 'Opening Hours', 3, NULL, 'Opening hours', NULL, NULL, NULL, NULL, NULL, NULL,
'[
  {"title": "Monday", "text": "09:00 – 18:30"},
  {"title": "Tuesday", "text": "09:00 – 18:30"},
  {"title": "Wednesday", "text": "09:00 – 18:30"},
  {"title": "Thursday", "text": "09:00 – 18:30"},
  {"title": "Friday", "text": "09:00 – 18:30"},
  {"title": "Saturday", "text": "09:00 – 17:00"},
  {"title": "Sunday", "text": "11:00 – 16:00"}
]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'find-us'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'cta', 'Enquiry CTA', 4, 'Have A Question?', 'Send us an enquiry', NULL, 'Ask about a specific vehicle, book a viewing or arrange a test drive. We reply to every message within one working hour.', 'Send Enquiry', NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'find-us'
ON CONFLICT (page_id, section_key) DO NOTHING;
