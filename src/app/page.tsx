'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

export default function HomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      // If logged in, store the user's Supabase ID
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    fetchUser();
  }, []);

  const navigate = (path: string) => {
    router.push(path);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Trail Mission</h1>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login / Signup
        </button>

        <button
          onClick={() => navigate('/scan')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Scan Summit QR
        </button>

        <button
          onClick={() => navigate('/leaderboard')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Leaderboard
        </button>

        <button
          onClick={() => {
            if (userId) {
              navigate(`/profile/${userId}`);
            } else {
              navigate('/login'); // Redirect to login if not signed in
            }
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          My Profile
        </button>
      </div>
    </div>
  );
}
