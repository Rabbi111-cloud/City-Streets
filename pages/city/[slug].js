import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CityPage() {
  const { slug } = useRouter().query
  const [city, setCity] = useState(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/data/cities/${slug}.json`)
      .then(r => r.json())
      .then(setCity)
  }, [slug])

  if (!city) return <p>Loading…</p>

  const withViews = city.streets.map(s => ({
    ...s,
    views: Number(localStorage.getItem(`views-${slug}-${s.id}`) || 0)
  }))

  const top = [...withViews].sort((a, b) => b.views - a.views).slice(0, 5)

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>{city.city}</h1>

      <h3>🔥 Most Viewed Streets</h3>
      <ul>
        {top.map(s => (
          <li key={s.id}>
            <Link href={`/street/${s.id}?city=${slug}`}>
              {s.name} ({s.views})
            </Link>
          </li>
        ))}
      </ul>

      <h3>All Streets</h3>
      <ul>
        {withViews.map(s => (
          <li key={s.id}>
            <Link href={`/street/${s.id}?city=${slug}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

