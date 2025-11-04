'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { firstName, lastName } }
    })
    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for confirmation (if enabled).')
      router.push('/auth/login')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>
      <form onSubmit={handleRegister} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Last name" value={lastName} onChange={e=>setLastName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full p-2 bg-green-600 text-white rounded">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      <div className="mt-4">
        <a href="/auth/login" className="text-sm text-blue-600">Already have an account?</a>
      </div>
    </div>
  )
}
