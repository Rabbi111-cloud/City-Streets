import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignup(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('✅ Check your email to confirm your account')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Create Account</h1>
        <p className="subtitle">
          Sign up to save streets, bookmarks and views
        </p>

        <form onSubmit={handleSignup}>
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
            Sign Up
          </button>
        </form>

        {message && <p style={{ marginTop: 14 }}>{message}</p>}

        <p style={{ marginTop: 24 }}>
          Already have an account?{' '}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </div>
  )
}
