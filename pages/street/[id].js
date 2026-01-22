import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function StreetPage() {
  const router = useRouter()
  const { id } = router.query
  const [street, setStreet] = useState(null)
  const [city, setCity] = useState(null)
  const [lang, setLang] = useState('en') // default English

  useEffect(() => {
    if (!id || !router.query.city) return

    const citySlug = router.query.city

    fetch(`/data/cities/${citySlug}.json`)
      .then(res => res.json())
      .then(data => {
        setCity(data.city)
        const found = data.streets.find(s => s.id === id)
        if (found) setStreet(found)
      })
  }, [id, router.query.city])

  if (!street) return <p>Loading street info...</p>

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px' }}>
      <h1>{street.name}</h1>
      <h3>City: {city}</h3>

      <img 
        src={street.image} 
        alt={street.name} 
        style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }} 
      />

      <h4>Landmarks:</h4>
      <ul>
        {street.landmarks.map((lm, i) => (
          <li key={i}>{lm}</li>
        ))}
      </ul>

      <h4>Directions & Description:</h4>
      <p>{street.directions[lang]}</p>

      <button 
        onClick={() => setLang(lang === 'en' ? Object.keys(street.directions).find(k => k !== 'en') : 'en')}
        style={{ marginTop: '15px', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
      >
        Switch to {lang === 'en' ? 'Native Language' : 'English'}
      </button>
    </div>
  )
}
