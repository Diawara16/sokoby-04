-- Create some demo products for testing with a real user_id
INSERT INTO public.products (name, description, price, category, user_id, status, stock, image) VALUES
  ('Smartphone Premium', 'Le dernier smartphone avec toutes les fonctionnalités avancées. Écran OLED, camera 108MP, 5G.', 899.99, 'Électronique', '4c87ed2a-f6ad-4678-b32a-07dfbe6e4a36', 'active', 50, null),
  ('Casque Audio Sans Fil', 'Casque audio haute qualité avec réduction de bruit active. Autonomie 30h.', 249.99, 'Audio', '4c87ed2a-f6ad-4678-b32a-07dfbe6e4a36', 'active', 75, null),
  ('Montre Connectée', 'Montre intelligente avec suivi fitness, GPS, notifications. Étanche IP68.', 329.99, 'Wearables', '4c87ed2a-f6ad-4678-b32a-07dfbe6e4a36', 'active', 100, null),
  ('Ordinateur Portable Gaming', 'PC portable haute performance pour le gaming. RTX 4070, 16GB RAM, SSD 1TB.', 1599.99, 'Informatique', '4c87ed2a-f6ad-4678-b32a-07dfbe6e4a36', 'active', 25, null),
  ('Tablette Graphique', 'Tablette professionnelle pour artistes et designers. Écran 13 pouces, stylet inclus.', 449.99, 'Créatif', '4c87ed2a-f6ad-4678-b32a-07dfbe6e4a36', 'active', 40, null),
  ('Enceinte Bluetooth Portable', 'Son cristallin et basses profondes. Étanche, 24h autonomie.', 89.99, 'Audio', '4c87ed2a-f6ad-4678-b32a-07dfbe6e4a36', 'active', 120, null);