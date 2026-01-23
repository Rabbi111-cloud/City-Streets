import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StreetPage() {
  const router = useRouter()
  const { id, city } = router.query

  const [street, setStreet] = useState(null)
  const [streets, setStreets] = useState([])

  useEffect(() => {
    if (!id || !city) return

    fetch(`/data/cities/${city}.json`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.streets.sort((a, b) =>
          a.name.localeCompare(b.name)
        )

        setStreets(sorted)

        const found = sorted.find(s => s.id === id)
        setStreet(found)
      })
  }, [id, city])

  if (!street) return <p>Loading street...</p>

  const currentIndex = streets.findIndex(s => s.id === id)
  const prevStreet = streets[currentIndex - 1]
  const nextStreet = streets[currentIndex + 1]

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>{street.name}</h1>
      <p><b>Area:</b> {street.area}</p>

      <img
        src={street.image}
        alt={street.name}
        style={{ width: '100%', marginBottom: 16 }}
      />

      <h3>Landmarks</h3>
      <ul>
        {street.landmarks.map(l => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <h3>Directions (English)</h3>
      <p>{street.directions.en}</p>

      <h3>Directions (Native)</h3>
      <p>{street.directions.yo}</p>

      <hr />

      {/* NAVIGATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {prevStreet ? (
          <Link href={`/street/${prevStreet.id}?city=${city}`}>
            ← {prevStreet.name}
          </Link>
        ) : <span />}

        <Link href={`/city/${city}`}>Back to {city}</Link>

        {nextStreet ? (
          <Link href={`/street/${nextStreet.id}?city=${city}`}>
            {nextStreet.name} →
          </Link>
        ) : <span />}
      </div>
    </div>
  )
}
