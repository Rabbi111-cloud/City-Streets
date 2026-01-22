import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>CITY STREETS</h1>
      <p>Find streets using landmarks and native languages.</p>
      <Link href="/signup">Sign up</Link>
      <br />
      <Link href="/login">Login</Link>
    </div>
  )
}
