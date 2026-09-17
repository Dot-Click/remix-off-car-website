INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Get in touch', 'We''re here seven days a week', NULL,
  'Whether you want a walkaround video, a finance quote or directions to the showroom — just ask.',
  NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'contact'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'details', 'Contact Details', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "Call the showroom", "text": "+44(0)7483891595", "url": "tel:+447483891595"},
    {"title": "Email us", "text": "J1autoland26@gmail.com", "url": "mailto:J1autoland26@gmail.com"},
    {"title": "Visit us", "text": "31 York Road, Birmingham, B21 9EB"}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'contact'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'form', 'Enquiry Form', 3, NULL, 'Send us a message', NULL, NULL, 'Send message', NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'contact'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hours', 'Opening Hours', 4, NULL, 'Opening hours', NULL, NULL, NULL, NULL, NULL, NULL,
  '[
    {"title": "Monday – Friday", "text": "09:00 – 18:30"},
    {"title": "Saturday", "text": "09:00 – 17:00"},
    {"title": "Sunday", "text": "11:00 – 16:00"},
    {"title": "Bank Holidays", "text": "By appointment"}
  ]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'contact'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'map', 'Map', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'contact'
ON CONFLICT (page_id, section_key) DO NOTHING;
