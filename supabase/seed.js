// supabase/seed.js
const { createClient } = require('@supabase/supabase-js');

// Manually enter your Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL ;
const supabaseKey = process.env.SUPABASE_ANON_KEY // Use the service role key for seeding

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error('Supabase URL and service role key are required.');
  console.error('Please update the credentials in supabase/seed.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockPaints = [
  {
    name: "Premium Interior White",
    price: 45.99,
    image_url: `https://${new URL(supabaseUrl).hostname}/storage/v1/object/public/paintings/white-paint-bucket.jpg`,
    description: "High-quality interior paint with excellent coverage and durability.",
  },
  {
    name: "Exterior Weather Guard",
    price: 62.5,
    image_url: `https://${new URL(supabaseUrl).hostname}/storage/v1/object/public/paintings/blue-paint-bucket.jpg`,
    description: "Weatherproof exterior paint with UV protection and fade resistance.",
  },
  {
    name: "Glossy Finish Premium",
    price: 55.99,
    image_url: `https://${new URL(supabaseUrl).hostname}/storage/v1/object/public/paintings/red-gloss-paint.jpg`,
    description: "Premium gloss finish paint for a shiny, elegant look.",
  },
  {
    name: "Matte Elegance",
    price: 48.99,
    image_url: `https://${new URL(supabaseUrl).hostname}/storage/v1/object/public/paintings/green-matte-paint.jpg`,
    description: "Sophisticated matte finish for a modern aesthetic.",
  },
  {
    name: "Semi-Gloss Durability",
    price: 52.99,
    image_url: `https://${new URL(supabaseUrl).hostname}/storage/v1/object/public/paintings/yellow-paint-bucket.jpg`,
    description: "Semi-gloss paint ideal for kitchens and bathrooms.",
  },
  {
    name: "Eco-Friendly Green",
    price: 59.99,
    image_url: `https://${new URL(supabaseUrl).hostname}/storage/v1/object/public/paintings/eco-friendly-paint.jpg`,
    description: "Environmentally conscious paint with low VOC formula.",
  },
];

async function seedDatabase() {
  console.log('Seeding database...');

  // Clear existing data
  const { error: deleteError } = await supabase.from('products').delete().gt('id', 0);
  if (deleteError) {
    console.error('Error clearing products table:', deleteError);
    return;
  }
  console.log('Cleared existing products.');

  // Insert new data
  const { data, error } = await supabase.from('products').insert(mockPaints).select();

  if (error) {
    console.error('Error seeding database:', error);
  } else {
    console.log('Database seeded successfully:');
    console.log(data);
  }
}

seedDatabase();