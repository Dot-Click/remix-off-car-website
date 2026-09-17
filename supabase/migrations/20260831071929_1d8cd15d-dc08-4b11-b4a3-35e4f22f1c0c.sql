CREATE POLICY "Vehicle images are viewable"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'vehicle-images');

CREATE POLICY "Admins can upload vehicle images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update vehicle images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete vehicle images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle-images' AND public.has_role(auth.uid(), 'admin'));