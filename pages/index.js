import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 className="title">City Streets 🌍</h1>

        <p className="subtitle">
          Find streets using landmarks and native languages across Nigeria.
        </p>

        <Link href="/signup">
          <a
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: 12 }}
          >
            Create Account
          </a>
        </Link>

        <Link href="/login">
          <a className="btn btn-secondary" style={{ width: '100%' }}>
            Login
          </a>
        </Link>
      </div>
    </div>
  )
}
