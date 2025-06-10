
-- Créer un bucket pour les images des produits
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Politique pour permettre à tous de voir les images (bucket public)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Politique pour permettre l'upload d'images
CREATE POLICY "Allow uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Politique pour permettre la mise à jour d'images
CREATE POLICY "Allow updates" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');

-- Politique pour permettre la suppression d'images
CREATE POLICY "Allow deletes" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
