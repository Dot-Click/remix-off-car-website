INSERT INTO public.site_settings (key, value) VALUES
('business', '{"name":"J1 AUTOLAND","name_title":"J1 Autoland","legal":"J1 Autoland Ltd","tagline":"Quality vehicles from trusted brands","phone":"+44(0)7483891595","phone_href":"tel:+447483891595","whatsapp":"https://wa.me/447483891595","email":"J1autoland26@gmail.com","address":"31 York Road, Birmingham, B21 9EB","website":"www.j1autoland.co.uk","hours":[{"day":"Monday – Friday","time":"09:00 – 18:30"},{"day":"Saturday","time":"09:00 – 17:00"},{"day":"Sunday","time":"11:00 – 16:00"},{"day":"Bank Holidays","time":"By appointment"}],"social":{"instagram":"#","facebook":"#","youtube":"#","linkedin":"#"}}'::jsonb),
('header', '{"show_phone":true,"cta_label":"Browse Stock","cta_url":"/stocklist","logo_path":null}'::jsonb),
('footer', '{"description":"An independent motor group with over 100 hand-selected vehicles, in-house finance and nationwide delivery.","newsletter_placeholder":"Email for new arrivals","newsletter_button":"Join","copyright":"All rights reserved.","small_print":"FCA registered credit broker, not a lender. Finance subject to status.","logo_path":null}'::jsonb);

INSERT INTO public.pages (slug, title, seo_title, seo_description, sort_order) VALUES
('home','Homepage','J1 Autoland | Quality Used Cars','Explore our collection of quality vehicles from trusted brands.',1),
('stocklist','Stocklist',NULL,NULL,2),
('services','Services',NULL,NULL,3),
('valuation','Valuation',NULL,NULL,4),
('warranty','Warranty',NULL,NULL,5),
('finance','Finance',NULL,NULL,6),
('about-us','About Us',NULL,NULL,7),
('reviews','Reviews',NULL,NULL,8),
('find-us','Find Us',NULL,NULL,9),
('contact','Contact',NULL,NULL,10),
('faq','FAQ',NULL,NULL,11),
('sell-your-car','Sell Your Car',NULL,NULL,12),
('part-exchange','Part Exchange',NULL,NULL,13);

INSERT INTO public.page_sections (page_id, section_key, name, eyebrow, heading, subheading, description, button_text, button_url, secondary_button_text, secondary_button_url, settings, items, sort_order)
SELECT p.id, s.section_key, s.name, s.eyebrow, s.heading, s.subheading, s.description, s.button_text, s.button_url, s.secondary_button_text, s.secondary_button_url, s.settings, s.items, s.sort_order
FROM public.pages p, (VALUES
 ('hero','Hero Section','J1 AUTOLAND · Manchester','Find Your Next Car','Next Car','Explore our collection of quality vehicles from trusted brands — each inspected, warranted for 12 months and delivered anywhere in the UK.','Browse Our Stock','/stocklist','Sell Your Car','/sell-your-car','{"autoplay_seconds":5}'::jsonb,'["100+ Vehicles","Quality Checked","Finance Available","Trusted Dealer"]'::jsonb,1),
 ('featured','Featured Vehicles','The Collection','Featured Vehicles',NULL,NULL,'View all stock','/stocklist',NULL,NULL,'{"count":3}'::jsonb,'[]'::jsonb,2),
 ('makes','Browse by Make','Marques','Browse by Make',NULL,'Search the marques our customers ask for most.',NULL,NULL,NULL,NULL,'{}'::jsonb,'[]'::jsonb,3),
 ('why','Why Choose Us','The J1 Standard','Why thousands choose us over the main dealer',NULL,NULL,NULL,NULL,NULL,NULL,'{}'::jsonb,'[]'::jsonb,4),
 ('finance','Finance Section','Finance','Drive away from £249 per month',NULL,'We work with 22 lenders to find the sharpest rate for your circumstances — including PCP, HP and lease purchase. Soft-search quotes leave no mark on your credit file.','Finance Calculator','/finance','Apply for Finance','/finance','{}'::jsonb,'["Decision in 60 seconds","No deposit options","Terms from 24–60 months","Settle early, penalty free"]'::jsonb,5),
 ('reviews','Reviews Section','Reviews','Loved by 10,000+ drivers',NULL,NULL,NULL,NULL,NULL,NULL,'{"count":3}'::jsonb,'[]'::jsonb,6),
 ('arrivals','Latest Arrivals','Just landed','Latest Arrivals',NULL,NULL,'See everything','/stocklist',NULL,NULL,'{"count":4}'::jsonb,'[]'::jsonb,7),
 ('cta','Closing Call To Action',NULL,'Ready to buy your next car?',NULL,'Reserve online for £199, or speak to a specialist seven days a week.','Browse Stock','/stocklist','Contact Us','/contact','{}'::jsonb,'[]'::jsonb,8)
) AS s(section_key,name,eyebrow,heading,subheading,description,button_text,button_url,secondary_button_text,secondary_button_url,settings,items,sort_order)
WHERE p.slug = 'home';

INSERT INTO public.navigation_items (location, label, url, sort_order) VALUES
('header','Home','/',1),('header','Stocklist','/stocklist',2),('header','Services','/services',3),
('header','Valuation','/valuation',4),('header','Warranty','/warranty',5),('header','Finance','/finance',6),
('header','About Us','/about-us',7),('header','Reviews','/reviews',8),('header','Find Us','/find-us',9),
('footer','Home','/',1),('footer','Stocklist','/stocklist',2),('footer','Services','/services',3),
('footer','Valuation','/valuation',4),('footer','Warranty','/warranty',5),('footer','Finance','/finance',6),
('footer','About Us','/about-us',7),('footer','Reviews','/reviews',8),('footer','Find Us','/find-us',9),
('footer_secondary','All Vehicles','/stocklist',1),('footer_secondary','Featured Vehicles','/stocklist',2),
('footer_secondary','Latest Arrivals','/stocklist',3),('footer_secondary','Business Card','/business-card',4);

INSERT INTO public.vehicle_categories (kind, name, slug, sort_order) VALUES
('body_type','SUV','suv',1),('body_type','Sedan','sedan',2),('body_type','Coupe','coupe',3),
('body_type','Convertible','convertible',4),('body_type','Hatchback','hatchback',5),
('body_type','Estate','estate',6),('body_type','Pickup','pickup',7),('body_type','MPV','mpv',8),
('fuel_type','Petrol','petrol',1),('fuel_type','Diesel','diesel',2),('fuel_type','Hybrid','hybrid',3),
('fuel_type','Electric','electric',4),('fuel_type','Plug-in Hybrid','plug-in-hybrid',5),
('transmission','Automatic','automatic',1),('transmission','Manual','manual',2),('transmission','Semi-Automatic','semi-automatic',3);

INSERT INTO public.testimonials (customer_name, vehicle, rating, review, sort_order) VALUES
('Priya Raman','Audi e-tron GT',5,'I''ve bought from main dealers for fifteen years — nothing came close to this experience. No pressure, total transparency.',1),
('Marcus Bell','BMW M4 Competition',5,'They took my old car in part exchange at a genuinely fair price and had me in the M4 the same weekend.',2),
('Sophie Lang','Tesla Model Y',5,'The photos don''t do the prep work justice. It arrived immaculate, fully charged and with a full history pack.',3);