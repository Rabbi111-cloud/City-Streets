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
    <div style={{ maxWidth: 600, margin: 'auto', padding: 16 }}>
      <h1>{street.name}</h1>
      <p>👀 Viewed {views} times</p>

      {/* Street image */}
      <img
        src={street.image || 'https://via.placeholder.com/600x400'}
        style={{ width: '100%', borderRadius: 16, marginBottom: 16 }}
      />

      {/* Buttons */}
      <div style={{ marginBottom: 12 }}>
        <button
          className="btn btn-primary"
          onClick={() => setLang(lang === 'en' ? 'native' : 'en')}
        >
          Switch to {lang === 'en' ? 'Native' : 'English'}
        </button>

        <button
          className="btn btn-secondary"
          style={{ marginLeft: 10 }}
          onClick={toggleBookmark}
        >
          {saved ? '★ Saved' : '☆ Save'}
        </button>

        {lang === 'en' && (
          <>
            <button className="btn btn-primary" onClick={playVoice} style={{ marginLeft: 10 }}>
              ▶ Play
            </button>
            <button className="btn btn-secondary" onClick={pauseVoice} style={{ marginLeft: 5 }}>
              ⏸ Pause
            </button>
            <button className="btn btn-primary" onClick={resumeVoice} style={{ marginLeft: 5 }}>
              ▶ Resume
            </button>
            <button className="btn btn-secondary" onClick={stopVoice} style={{ marginLeft: 5 }}>
              ■ Stop
            </button>
          </>
        )}
      </div>

      {/* Directions */}
      <p style={{ lineHeight: '1.7em', marginBottom: 20 }}>
        {lang === 'en'
          ? street.directions.en
          : street.directions.native || 'No native directions available'}
      </p>

      {/* Landmarks */}
      {street.landmarks && street.landmarks.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3>Landmarks:</h3>
          <ul>
            {street.landmarks.map((l, i) => (
              <li key={i}>{l.name ? l.name : l}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Google Maps link */}
      <a
        href={mapLink}
        target="_blank"
        className="btn btn-primary"
        style={{ width: '100%', textAlign: 'center', marginBottom: 20 }}
      >
        Open in Google Maps
      </a>

      <hr />

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {prev && (
          <Link href={`/street/${prev.id}?city=${city}`}>
            <a className="btn btn-secondary" style={{ flex: 1, marginRight: 6, marginBottom: 6 }}>
              ← {prev.name}
            </a>
          </Link>
        )}
        <Link href={`/city/${city}`}>
          <a className="btn btn-secondary" style={{ flex: 1, margin: '0 6px', marginBottom: 6 }}>
            Back to Streets
          </a>
        </Link>
        {next && (
          <Link href={`/street/${next.id}?city=${city}`}>
            <a className="btn btn-secondary" style={{ flex: 1, marginLeft: 6, marginBottom: 6 }}>
              {next.name} →
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}
