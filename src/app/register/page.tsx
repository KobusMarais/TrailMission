'use client'

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setErrorMsg('');

    // 1️⃣ Create Auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setErrorMsg(signUpError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Insert into users table
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          supabase_id: data.user.id,
          email,
          name,
          surname,
          gender,
        });

      if (insertError) {
        console.error('Insert failed:', insertError);
        setErrorMsg(insertError.message);
        setLoading(false);
        return;
      }
    }

    alert('Registration successful!');
    setLoading(false);
    router.push('/login'); // redirect to login
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Register</h1>

      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-2 border rounded" />
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 mb-2 border rounded" />
      <input placeholder="Surname" value={surname} onChange={e => setSurname(e.target.value)} className="w-full p-2 mb-2 border rounded" />
      <input placeholder="Gender" value={gender} onChange={e => setGender(e.target.value)} className="w-full p-2 mb-2 border rounded" />

      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <button onClick={handleRegister} disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded">
        {loading ? 'Registering...' : 'Register'}
      </button>
    </div>
  );
}
