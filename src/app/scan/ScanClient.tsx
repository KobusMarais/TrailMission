'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ScanClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const peakId = searchParams.get('peak_id');

  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const logSummit = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus('You must be logged in to log a summit.');
        router.push('/login');
        return;
      }

      if (!peakId) {
        setStatus('Invalid or missing peak ID.');
        return;
      }

      const { data, error } = await supabase
        .from('summits')
        .insert({ user_id: user.id, peak_id: Number(peakId) });

      if (error) {
        console.error('Summit error:', error.message);
        setStatus('An error occurred.');
      } else {
        setStatus('Summit logged successfully! 🎉');
      }
    };

    logSummit();
  }, [peakId, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen" >
      <p>{status} </p>
      < button onClick={() => router.push('/profile')
      } className="mt-4 p-2 bg-blue-500 text-white rounded" >
        Go to Profile
      </button>
    </div>
  );
}
