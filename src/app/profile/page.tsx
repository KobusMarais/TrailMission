'use client'

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface Summit {
  id: string;
  peak: {
    id: number;
    points: number;
    name: string;
  };
  date: string;
  hidden: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [summits, setSummits] = useState<Summit[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErrorMsg('');

      // Get currently logged-in user from Supabase Auth
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setErrorMsg('Not logged in');
        setLoading(false);
        return;
      }

      // Fetch user info from `users` table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('supabase_id', authData.user.id)
        .single();

      if (userError) {
        setErrorMsg(userError.message);
        setLoading(false);
        return;
      }
      setUser(userData);

      // Fetch summits for this user
      const { data: summitData, error: summitError } = await supabase
        .from('summits')
        .select('id,user_id,date,hidden,peak:peaks(id,name,points)')
        .eq('user_id', userData.supabase_id);

      if (summitError) {
        setErrorMsg(summitError.message);
      } else {
        setSummits(
          (summitData ?? []).map(s => ({
            id: s.id,
            user_id: Number(s.user_id),
            date: s.date,
            hidden: s.hidden,
            peak: s.peak as unknown as { id: number; name: string; points: number }, // tell TS it's an object
          }))
        );

      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const toggleSummitHidden = async (summitId: string, hidden: boolean) => {
    const { error } = await supabase
      .from('summits')
      .update({ hidden: !hidden })
      .eq('id', summitId);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSummits(prev =>
      prev.map(s => (s.id === summitId ? { ...s, hidden: !hidden } : s))
    );
  };

  if (loading) return <p>Loading...</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <p><strong>Name:</strong> {user.name} {user.surname}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Gender:</strong> {user.gender}</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Your Summits</h2>
      {summits.length === 0 && <p>No summits logged yet.</p>}
      <ul>
        {summits.map(summit => (
          <li key={summit.id} className="flex justify-between border-b py-2">
            <span>
              {summit.peak.name} - {new Date(summit.date).toLocaleDateString()} - {summit.peak.points}
              {summit.hidden && <span className="text-gray-400 ml-2">(hidden)</span>}
            </span>
            <button
              onClick={() => toggleSummitHidden(summit.id, summit.hidden)}
              className="text-blue-500 hover:underline"
            >
              {summit.hidden ? 'Unhide' : 'Hide'}
            </button>
          </li>
        ))}
      </ul>
      <div>
        <h1>Your Profile</h1>
        {/* Profile info here */}

        <LogoutButton />
      </div>
    </div>
  );
}
export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
      return;
    }
    // Redirect to login page after logout
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
