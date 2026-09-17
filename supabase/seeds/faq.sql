INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'hero', 'Hero Section', 1, 'Help centre', 'Frequently asked questions', NULL, 'Everything about buying, financing, warranty and delivery — in plain English.', NULL, NULL, NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'faq'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'faq', 'Questions', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
'[
  {"title": "Can I view a car before buying?", "text": "Yes — our Birmingham showroom is open seven days a week, and appointments guarantee the car is unlocked, charged and ready."},
  {"title": "Do you sell nationally?", "text": "We deliver anywhere in mainland UK, usually within 72 hours of the sale completing."},
  {"title": "Can I reserve a car online?", "text": "Yes. A £199 refundable deposit holds any vehicle for seven days."},
  {"title": "What rates do you offer?", "text": "Rates start at 6.9% APR representative and depend on your credit profile, deposit and term."},
  {"title": "Will applying hurt my credit score?", "text": "No. Our quotes use a soft search that is invisible to other lenders."},
  {"title": "Can I overpay or settle early?", "text": "Yes, with no early repayment penalties on any agreement we arrange."},
  {"title": "What payment methods do you accept?", "text": "Bank transfer, debit card and finance. Card payments are capped at £5,000."},
  {"title": "Is my deposit refundable?", "text": "Fully refundable within seven days if you change your mind."},
  {"title": "Are there admin fees?", "text": "None. The price you see is the price you pay."},
  {"title": "What''s included?", "text": "A 12-month comprehensive warranty covering engine, transmission, electrics and more, with unlimited claims."},
  {"title": "Can I extend it?", "text": "Yes — 24 and 36 month extensions are available at the point of sale."},
  {"title": "Where can I get work done?", "text": "At any VAT-registered garage in the UK, or at our own workshop."},
  {"title": "How long does delivery take?", "text": "Typically 48–72 hours after funds clear and paperwork is signed."},
  {"title": "Is delivery free?", "text": "Free on vehicles over £30,000. Below that it''s a flat £149 anywhere in mainland UK."},
  {"title": "Can I return the car?", "text": "Yes — a 14-day money-back guarantee applies to all distance sales, up to 500 miles."},
  {"title": "Do you take part exchange?", "text": "On every car we sell. Get an estimate on our part exchange page in under a minute."},
  {"title": "What if I still owe finance?", "text": "We settle the outstanding balance directly with your lender and offset any equity."},
  {"title": "How long is a valuation valid?", "text": "Seven days or 250 additional miles, whichever comes first."}
]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'faq'
ON CONFLICT (page_id, section_key) DO NOTHING;

INSERT INTO public.page_sections (page_id, section_key, name, sort_order, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, items, settings, status)
SELECT id, 'cta', 'CTA Section', 3, NULL, 'Still have a question?', NULL, 'Our team answers calls and messages seven days a week.', 'Contact us', '/contact', NULL, NULL, '[]'::jsonb, '{}'::jsonb, 'published'
FROM public.pages WHERE slug = 'faq'
ON CONFLICT (page_id, section_key) DO NOTHING;
