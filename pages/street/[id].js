import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StreetPage() {
  const router = useRouter()
  const { id, city } = router.query

  const [street, setStreet] = useState(null)
  const [streets, setStreets] = useState([])
  const [lang, setLang] = useState('en')
  const [views, setViews] = useState(0)

  useEffect(() => {
    if (!id || !city) return

    fetch(`/data/cities/${city}.json`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.streets.sort((a, b) =>
          a.name.localeCompare(b.name)
        )

        setStreets(sorted)
        setStreet(sorted.find(s => s.id === id))
      })
  }, [id, city])

  // VIEW COUNTER
  useEffect(() => {
    if (!id || !city) return
    const key = `views-${city}-${id}`
    const count = Number(localStorage.getItem(key) || 0) + 1
    localStorage.setItem(key, count)
    setViews(count)
  }, [id, city])

  if (!street) return <p>Loading street...</p>

  const index = streets.findIndex(s => s.id === id)
  const prev = streets[index - 1]
  const next = streets[index + 1]

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    street.name + ', ' + city
  )}`

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>{street.name}</h1>
      <p><b>Area:</b> {street.area}</p>
      <p>👀 Viewed {views} times</p>

      <img
        src={street.image}
        alt={street.name}
        style={{ width: '100%', marginBottom: 12 }}
      />

      {/* LANGUAGE TOGGLE */}
      <button
        onClick={() => setLang(lang === 'en' ? 'native' : 'en')}
        style={{ marginBottom: 12 }}
      >
        Switch to {lang === 'en' ? 'Native language' : 'English'}
      </button>

      <h3>Directions ({lang === 'en' ? 'English' : 'Native'})</h3>
      <p>{street.directions[lang]}</p>

      <h3>Landmarks</h3>
      <ul>
        {street.landmarks.map(l => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      {/* GOOGLE MAPS */}
      <p>
        📍{' '}
        <a href={mapLink} target="_blank" rel="noopener noreferrer">
          Open in Google Maps
        </a>
      </p>

      <hr />

      {/* STREET NAVIGATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {prev ? (
          <Link href={`/street/${prev.id}?city=${city}`}>
            ← {prev.name}
          </Link>
        ) : <span />}

        <Link href={`/city/${city}`}>Back to {city}</Link>

        {next ? (
          <Link href={`/street/${next.id}?city=${city}`}>
            {next.name} →
          </Link>
        ) : <span />}
      </div>
    </div>
  )
}
