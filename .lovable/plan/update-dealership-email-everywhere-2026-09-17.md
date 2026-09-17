# Update dealership email everywhere

## Changes
- Replace the dealership contact email with `J1autoland26@gmail.com` in shared brand settings, CMS-backed content, contact cards, links, and existing seed data.
- Update the live CMS values so the public website does not continue showing the previous database value.
- Connect every existing public enquiry form to the shared enquiry submission flow and send each successful submission to the new dealership inbox.
- Keep customer-entered email fields and admin account emails unchanged.
- Replace the footer Visit Us WhatsApp artwork with the correct WhatsApp icon while preserving its number and link.

## Verification
- Search source, seed, and live content for the old dealership email.
- Test public enquiry forms, form validation, links, and desktop/mobile footer rendering.
- Confirm delivery status after the sender domain is configured.

## Email prerequisite
App-email delivery is not configured yet. Sending requires a verified sender domain owned by the dealership. The website and form handling can be completed now, but emails cannot be delivered until that domain setup is finished.

## Technical details
- Keep form sends server-side with fixed templates and recipients; browsers will not choose recipients or templates.
- Preserve existing enquiry records in the admin dashboard while adding email notification delivery.
- No layout, styling, animation, authentication, vehicle, or checkout changes.
