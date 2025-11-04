// src/app/api/leaderboard/route.ts
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('summits')
    .select('user_id, peak_id')
    .then(res => {
      // simple points: 1 per summit
      const scores: Record<string, number> = {};
      res.data?.forEach(s => { scores[s.user_id] = (scores[s.user_id] || 0) + 1 });
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      return sorted;
    });

  return new Response(JSON.stringify(data));
}
