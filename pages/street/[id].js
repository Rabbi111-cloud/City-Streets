import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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

  // auto native language
  useEffect(() => {
    if (city === 'abuja') setLang('native')
    if (city === 'lagos' || city === 'ibadan') setLang('native')
  }, [city])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

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

  // views
  useEffect(() => {
    if (!id || !city) return
    const key = `views-${city}-${id}`
    const count = Number(localStorage.getItem(key) || 0) + 1
    localStorage.setItem(key, count)
    setViews(count)
  }, [id, city])

  // bookmarks
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
