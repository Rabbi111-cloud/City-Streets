import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [cities, setCities] = useState([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        fetch('/data/cities/index.json')
          .then(res => res.json())
          .then(data => setCities(data))
      }
    })
  }, [])

  return (
    <div>
      <h1>Select a City</h1>

      <ul>
        {cities.map(city => (
          <li key={city.slug}>
            <Link href={`/city/${city.slug}`}>
              {city.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
