// scripts/seed.js
import { createClient } from '@supabase/supabase-js';
import peaksData from './peaksData.js'; // optional: your peaks array

// Make sure you have these env vars set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPeaks() {
  for (const peak of peaksData) {
    const { data, error } = await supabase
      .from('peaks')
      .upsert({
        slug: peak.slug,  // assuming slug is unique
        name: peak.name,
        altitude: peak.altitude,
        region: peak.region,
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error inserting ${peak.name}:`, error.message);
    } else {
      console.log(`Inserted/updated: ${peak.name}`);
    }
  }
}

seedPeaks().then(() => {
  console.log('Seeding complete');
  process.exit(0);
});
