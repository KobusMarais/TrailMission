'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const pending = localStorage.getItem('pending_scan_peak')
    if (pending && supabase.auth.getSession) {
      // noop: we will redirect after login
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      const pending = localStorage.getItem('pending_scan_peak')
      if (pending) {
        localStorage.removeItem('pending_scan_peak')
        router.push('/scan') // user can rescan or we could auto-submit if desired
      } else {
        router.push('/')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <div className="mt-4">
        <a href="/auth/register" className="text-sm text-blue-600">Create account</a>
      </div>
    </div>
  )
}
