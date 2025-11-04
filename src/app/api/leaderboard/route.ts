// src/app/api/leaderboard/route.ts
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  const res = await supabase
    .from('summits')
    .select('user_id, peak_id');

  if (res.error) {
    return new Response(JSON.stringify({ error: res.error.message }), { status: 500 });
  }

  // simple points: 1 per summit
  const scores: Record<string, number> = {};
  res.data?.forEach(s => { scores[s.user_id] = (scores[s.user_id] || 0) + 1 });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return new Response(JSON.stringify(sorted));

}
