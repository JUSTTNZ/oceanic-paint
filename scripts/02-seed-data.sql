-- Seed categories
INSERT INTO categories (name) VALUES
  ('Interior'),
  ('Exterior'),
  ('Gloss'),
  ('Matte'),
  ('Semi-Gloss')
ON CONFLICT DO NOTHING;

-- Seed products
INSERT INTO products (name, category, price, image, description, rating, reviews) VALUES
  ('Premium Interior White', 'Interior', 45.99, '/white-paint-bucket.jpg', 'High-quality interior paint with excellent coverage and durability.', 4.8, 124),
  ('Exterior Weather Guard', 'Exterior', 62.5, '/blue-paint-bucket.jpg', 'Weatherproof exterior paint with UV protection and fade resistance.', 4.6, 98),
  ('Glossy Finish Premium', 'Gloss', 55.99, '/red-gloss-paint.jpg', 'Premium gloss finish paint for a shiny, elegant look.', 4.7, 156),
  ('Matte Elegance', 'Interior', 48.99, '/green-matte-paint.jpg', 'Sophisticated matte finish for a modern aesthetic.', 4.5, 87),
  ('Semi-Gloss Durability', 'Gloss', 52.99, '/yellow-paint-bucket.jpg', 'Semi-gloss paint ideal for kitchens and bathrooms.', 4.6, 112),
  ('Eco-Friendly Green', 'Interior', 59.99, '/eco-friendly-paint.jpg', 'Environmentally conscious paint with low VOC formula.', 4.9, 203)
ON CONFLICT DO NOTHING;
