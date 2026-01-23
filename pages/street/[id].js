import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StreetPage() {
  const router = useRouter()
  const { id, city } = router.query

  const [street, setStreet] = useState(null)
  const [streets, setStreets] = useState([])
  const [lang, setLang] = useState('en')
  const [bookmarked, setBookmarked] = useState(false)

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

  useEffect(() => {
    if (!street) return
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setBookmarked(saved.includes(street.id))
  }, [street])

  if (!street) return <p>Loading street...</p>

  const index = streets.findIndex(s => s.id === id)
  const prev = streets[index - 1]
  const next = streets[index + 1]

  function toggleBookmark() {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    let updated

    if (saved.includes(street.id)) {
      updated = saved.filter(i => i !== street.id)
      setBookmarked(false)
    } else {
      updated = [...saved, street.id]
      setBookmarked(true)
    }

    localStorage.setItem('bookmarks', JSON.stringify(updated))
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>{street.name}</h1>
      <p><b>Area:</b> {street.area}</p>

      <img
        src={street.image}
        alt={street.name}
        style={{ width: '100%', marginBottom: 12 }}
      />

      {/* LANGUAGE TOGGLE */}
      <button onClick={() => setLang(lang === 'en' ? 'yo' : 'en')}>
        Switch to {lang === 'en' ? 'Native' : 'English'}
      </button>

      {/* BOOKMARK */}
      <button onClick={toggleBookmark} style={{ marginLeft: 10 }}>
        {bookmarked ? '★ Bookmarked' : '☆ Save street'}
      </button>

      <h3>Landmarks</h3>
      <ul>
        {street.landmarks.map(l => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <h3>Directions ({lang === 'en' ? 'English' : 'Native'})</h3>
      <p>{street.directions[lang]}</p>

      <h3>Landmark-Based Navigation</h3>
      <p>
        To locate <b>{street.name}</b>, ask for directions near{' '}
        <b>{street.landmarks[0]}</b>. The street is commonly known around this
        landmark.
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
