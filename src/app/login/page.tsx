'use client'

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    alert('Login successful!');
    setLoading(false);
    router.push('/'); // redirect to homepage
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-2 border rounded" />

      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <button onClick={handleLogin} disabled={loading} className="w-full bg-green-500 text-white p-2 rounded">
        {loading ? 'Logging in...' : 'Login'}
      </button>
  <p className="text-center text-sm">
        Don’t have an account?{' '}
        <Link href="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>

    </div>
  );
}
