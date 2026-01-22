import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CityPage() {
  const router = useRouter()
  const { slug } = router.query
  const [cityData, setCityData] = useState(null)

  useEffect(() => {
    if (!slug) return

    fetch(`/data/cities/${slug}.json`)
      .then(res => res.json())
      .then(data => {
        data.streets.sort((a, b) => a.name.localeCompare(b.name))
        setCityData(data)
      })
      .catch(() => setCityData(null))
  }, [slug])

  if (!cityData) return <p>Loading streets...</p>

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>{cityData.city} Streets</h1>
      <p>{cityData.country}</p>

      <ul>
        {cityData.streets.map(street => (
          <li key={street.id}>
            <Link href={`/street/${street.id}?city=${slug}`}>
              {street.name} ({street.type})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
