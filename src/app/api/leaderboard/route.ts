import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  // 1️⃣ fetch all summits
  const { data: summitsData, error: summitsError } = await supabase
    .from('summits')
    .select('id,user_id,peak_id');

  if (summitsError) return new Response(JSON.stringify({ error: summitsError.message }), { status: 500 });
  if (!summitsData?.length) return new Response(JSON.stringify([]));

  // 2️⃣ fetch peaks
  const peakIds = [...new Set(summitsData.map(s => s.peak_id))];
  const { data: peaksData } = await supabase
    .from('peaks')
    .select('id,name,points')
    .in('id', peakIds);

  const peaksMap = Object.fromEntries((peaksData ?? []).map(p => [p.id, p]));

  // 3️⃣ fetch users
  const userIds = [...new Set(summitsData.map(s => s.user_id))];
  const { data: usersData } = await supabase
    .from('users')
    .select('supabase_id,name,surname')
    .in('supabase_id', userIds);

  const usersMap = Object.fromEntries((usersData ?? []).map(u => [u.supabase_id, u]));

  // 4️⃣ calculate scores
  const scores: Record<string, { name: string; peaks: number; points: number }> = {};
  summitsData.forEach(s => {
    const user = usersMap[s.user_id];
    const peak = peaksMap[s.peak_id];
    if (!user || !peak) return;

    if (!scores[s.user_id]) scores[s.user_id] = { name: `${user.name} ${user.surname}`, peaks: 0, points: 0 };
    scores[s.user_id].points += peak.points;
    scores[s.user_id].peaks += 1;
  });

  // 5️⃣ convert to array and sort descending
  const sorted = Object.entries(scores)
    .map(([id, val]) => ({ id, ...val }))
    .sort((a, b) => b.points - a.points);

  return new Response(JSON.stringify(sorted), { headers: { 'Content-Type': 'application/json' } });
}
