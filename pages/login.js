import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">
          Login to access your saved streets
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 10 }}
          >
            Login
          </button>
        </form>

        {message && <p style={{ marginTop: 14 }}>{message}</p>}

        <p style={{ marginTop: 24 }}>
          Don’t have an account?{' '}
          <Link href="/signup">
            <a>Create one</a>
          </Link>
        </p>
      </div>
    </div>
  )
}
