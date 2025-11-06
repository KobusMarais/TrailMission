'use client'

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';

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
  const { user_id } = useParams(); // <- Get user_id from URL
  const [user, setUser] = useState<any>(null);
  const [summits, setSummits] = useState<Summit[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user?.id ?? null); // fallback to null if undefined
    });
  }, []);


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErrorMsg('');

      if (!user_id) {
        setErrorMsg('No user ID provided');
        setLoading(false);
        return;
      }

      // Fetch user info for the profile being viewed
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('supabase_id', user_id)
        .single();

      if (userError || !userData) {
        setErrorMsg('User not found');
        setLoading(false);
        return;
      }

      setUser(userData);

      // Fetch summits for this user
      const { data: summitData, error: summitError } = await supabase
        .from('summits')
        .select('id,user_id,date,hidden,peak:peaks(id,name,points)')
        .eq('user_id', user_id)
        .order('date', { ascending: false }) // latest first
        .limit(10);

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
  }, [user_id]);

  const toggleSummitHidden = async (summitId: string, hidden: boolean) => {
    const { error } = await supabase
      .from('summits')
      .update({ hidden: !hidden })
      .eq('id', summitId)
      .order('date', { ascending: false }) // latest first
      .limit(10);

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
      {currentUser === user_id && <p><strong>Email:</strong> {user.email}</p>}
      <p><strong>Gender:</strong> {user.gender}</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Most recent summits</h2>
      {summits.length === 0 && <p>No summits logged yet.</p>}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Peak</th>
            <th className="border px-4 py-2 text-left">Summit Date</th>
          </tr>
        </thead>
        <tbody>
          {summits.map(summit => (
            <tr
              key={summit.id}
            >
              <td className="border px-4 py-2">{summit.peak.name}</td>
              <td className="border px-4 py-2">{new Date(summit.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {currentUser === user_id && <LogoutButton />}
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
