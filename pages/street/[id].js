import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function StreetPage() {
  const router = useRouter()
  const { id, city } = router.query

  const [street, setStreet] = useState(null)
  const [streets, setStreets] = useState([])
  const [lang, setLang] = useState('en')
  const [views, setViews] = useState(0)
  const [user, setUser] = useState(null)
  const [saved, setSaved] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  // Default language
  useEffect(() => {
    if (!city) return
    setLang('en')
  }, [city])

  // Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  // Load street data
  useEffect(() => {
    if (!id || !city) return

    fetch(`/data/cities/${city}.json`)
      .then(r => r.json())
      .then(data => {
        const sorted = data.streets.sort((a, b) =>
          a.name.localeCompare(b.name)
        )
        setStreets(sorted)
        setStreet(sorted.find(s => s.id === id))
      })
  }, [id, city])

  // Track views
  useEffect(() => {
    if (!id || !city) return
    const key = `views-${city}-${id}`
    const count = Number(localStorage.getItem(key) || 0) + 1
    localStorage.setItem(key, count)
    setViews(count)
  }, [id, city])

  // Toggle bookmark
  async function toggleBookmark() {
    if (!user) return alert('Login to save streets')

    if (saved) {
      await supabase.from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('street_id', id)
      setSaved(false)
    } else {
      await supabase.from('bookmarks')
        .insert({ user_id: user.id, city, street_id: id })
      setSaved(true)
    }
  }

  // Voice: Play English
  function playVoice() {
    if (!street?.directions?.en) return
    if ('speechSynthesis' in window) {
      stopVoice()
      const utterance = new SpeechSynthesisUtterance(street.directions.en)
      utterance.lang = 'en-US'
      utterance.onend = () => setSpeaking(false)
      utteranceRef.current = utterance
      setSpeaking(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  function pauseVoice() {
    if ('speechSynthesis' in window && speaking) {
      window.speechSynthesis.pause()
    }
  }

  function resumeVoice() {
    if ('speechSynthesis' in window && speaking) {
      window.speechSynthesis.resume()
    }
  }

  function stopVoice() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }

  if (!street) return <p style={{ textAlign: 'center', marginTop: 50 }}>Loading…</p>

  const index = streets.findIndex(s => s.id === id)
  const prev = streets[index - 1]
  const next = streets[index + 1]

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    street.name + ', ' + city
  )}`

  return (
    <div style={{ maxWidth: 650, margin: 'auto', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Street Header */}
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>{street.name}</h1>
      <p style={{ color: '#555', marginBottom: 20 }}>👀 Viewed {views} times</p>

      {/* Street Image */}
      <img
        src={street.image || 'https://via.placeholder.com/600x400'}
        alt={street.name}
        style={{ width: '100%', borderRadius: 16, marginBottom: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      />

      {/* Action Buttons */}
      <div style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button
          className="btn btn-primary"
          onClick={() => setLang(lang === 'en' ? 'native' : 'en')}
        >
          Switch to {lang === 'en' ? 'Native' : 'English'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={toggleBookmark}
        >
          {saved ? '★ Saved' : '☆ Save'}
        </button>

        {lang === 'en' && (
          <>
            <button className="btn btn-primary" onClick={playVoice}>▶ Play</button>
            <button className="btn btn-secondary" onClick={pauseVoice}>⏸ Pause</button>
            <button className="btn btn-primary" onClick={resumeVoice}>▶ Resume</button>
            <button className="btn btn-secondary" onClick={stopVoice}>■ Stop</button>
          </>
        )}
      </div>

      {/* Directions */}
      <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 20 }}>
        {lang === 'en'
          ? street.directions.en
          : street.directions.native || 'No native directions available'}
      </p>

      {/* Landmarks */}
      {street.landmarks && street.landmarks.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, marginBottom: 10 }}>Landmarks</h3>
          <ul style={{ paddingLeft: 20 }}>
            {street.landmarks.map((l, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{l.name ? l.name : l}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Google Maps */}
      <a
        href={mapLink}
        target="_blank"
        className="btn btn-primary"
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '12px 0',
          borderRadius: 12,
          marginBottom: 20,
          textDecoration: 'none',
          backgroundColor: '#4f46e5',
          color: '#fff',
          fontWeight: 600
        }}
      >
        Open in Google Maps
      </a>

      <hr style={{ margin: '20px 0' }} />

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        {prev && (
          <Link href={`/street/${prev.id}?city=${city}`}>
            <a className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 12 }}>
              ← {prev.name}
            </a>
          </Link>
        )}

        {/* City button */}
        <Link href={`/city/${city}`}>
          <a className="btn btn-primary" style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 12 }}>
            🏙 View All Streets in {city.charAt(0).toUpperCase() + city.slice(1)}
          </a>
        </Link>

        {next && (
          <Link href={`/street/${next.id}?city=${city}`}>
            <a className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 12 }}>
              {next.name} →
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}

