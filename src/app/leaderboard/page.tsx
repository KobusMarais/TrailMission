'use client'

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function LeaderboardPage() {
  const { data, error } = useSWR('/api/leaderboard', fetcher);

  if (error) return <div className="p-4 text-red-500">Error loading leaderboard</div>;
  if (!data) return <div className="p-4">Loading leaderboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user: any, index: number) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{user.username}</td>
                  <td className="px-4 py-2">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            No leaderboard data yet.
          </div>
        )}
      </div>
    </div>
  );
}
