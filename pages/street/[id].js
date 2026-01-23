import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

let voicesCache = []

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

  // Load voices
  useEffect(() => {
    function loadVoices() {
      voicesCache = window.speechSynthesis.getVoices()
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  // Auto native language
  useEffect(() => {
    if (city === 'abuja') setLang('native')
    if (city === 'lagos' || city === 'ibadan') setLang('native')
  }, [city])

  // Get user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  // Load street JSON
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

  // Views counter
  useEffect(() => {
    if (!id || !city) return
    const key = `views-${city}-${id}`
    const count = Number(localStorage.getItem(key) || 0) + 1
    localStorage.setItem(key, count)
    setViews(count)
  }, [id, city])

  // Bookmark toggle
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

  // 🔊 Voice: pick best voice
  function getBestVoice() {
    if (lang === 'en') return voicesCache.find(v => v.lang.startsWith('en')) || null
    if (city === 'abuja') return voicesCache.find(v => v.lang.startsWith('ha')) || null
    return voicesCache.find(v => v.lang.startsWith('yo')) || null
  }

  // 🔊 Speak text
  function speak(text) {
    if (!text) return
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = getBestVoice()
    if (voice) utterance.voice = voice
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    speechSynthesis.speak(utterance)
  }

  function pauseSpeech() {
    if (speechSynthesis.speaking) speechSynthesis.pause()
  }

  function resumeSpeech() {
    if (speechSynthesis.paused) speechSynthesis.resume()
  }

  function stopSpeech() {
    speechSynthesis.cancel()
    setSpeaking(false)
  }

  // 🔊 Speak landmarks correctly
  function speakLandmarks() {
    if (!street?.landmarks?.length) return
    const landmarksText = street.landmarks.map(l => (l.name ? l.name : l)).join(', ')
    const text =
      lang === 'en'
        ? `Landmarks include ${landmarksText}`
        : `Awọn ami-aye pataki ni ${landmarksText}`
    speak(text)
  }

  if (!street) return <p>Loading…</p>

  const index = streets.findIndex(s => s.id === id)
  const prev = streets[index - 1]
  const next = streets[index + 1]

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    street.name + ', ' + city
  )}`

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>{street.name}</h1>
      <p>👀 Viewed {views} times</p>

      <img src={street.image} style={{ width: '100%' }} />

      <button onClick={() => setLang(lang === 'en' ? 'native' : 'en')}>
        Switch to {lang === 'en' ? 'Native' : 'English'}
      </button>

      <button onClick={toggleBookmark} style={{ marginLeft: 10 }}>
        {saved ? '★ Saved' : '☆ Save'}
      </button>

      <p>{street.directions[lang]}</p>

      {/* VOICE CONTROLS */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => speak(street.directions[lang])}>🔊 Play</button>
        <button onClick={pauseSpeech} disabled={!speaking}>⏸ Pause</button>
        <button onClick={resumeSpeech}>▶ Resume</button>
        <button onClick={stopSpeech}>⏹ Stop</button>
      </div>

      {/* LANDMARK VOICE */}
      {street.landmarks && (
        <button onClick={speakLandmarks}>📍 Listen to landmarks</button>
      )}

      <br /><br />

      <a href={mapLink} target="_blank">Open in Google Maps</a>

      <hr />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {prev && <Link href={`/street/${prev.id}?city=${city}`}>← {prev.name}</Link>}
        <Link href={`/city/${city}`}>Back</Link>
        {next && <Link href={`/street/${next.id}?city=${city}`}>{next.name} →</Link>}
      </div>
    </div>
  )
}
