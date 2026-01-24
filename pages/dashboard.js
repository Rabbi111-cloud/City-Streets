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
          .then(data => {
            // supports both { cities: [...] } or [...]
            const list = data.cities || data
            const sorted = list.sort((a, b) =>
              a.name.localeCompare(b.name)
            )
            setCities(sorted)
          })
      }
    })
  }, [])

  return (
    <div>
      <div style={{ padding: '30px 30px 10px' }}>
        <h1 className="title">Select a City</h1>
        <p className="subtitle">
          Explore streets, landmarks and directions
        </p>
      </div>

      <div className="grid">
        {cities.map(city => (
          <Link key={city.slug} href={`/city/${city.slug}`}>
            <a className="city-card">
              <img
                src={city.image || 'https://via.placeholder.com/600x400'}
                alt={city.name}
              />
              <div>
                <h3 style={{ margin: 0 }}>{city.name}</h3>
                {city.streetCount && (
                  <p style={{ color: '#555', marginTop: 6 }}>
                    {city.streetCount} streets
                  </p>
                )}
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
