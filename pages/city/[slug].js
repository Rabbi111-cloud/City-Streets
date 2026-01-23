import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CityPage() {
  const router = useRouter()
  const { slug } = router.query

  const [cityData, setCityData] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!slug) return

    fetch(`/data/cities/${slug}.json`)
      .then(res => res.json())
      .then(data => {
        data.streets.sort((a, b) => a.name.localeCompare(b.name))
        setCityData(data)
      })
  }, [slug])

  if (!cityData) return <p>Loading city...</p>

  const filteredStreets = cityData.streets.filter(street =>
    street.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>{cityData.city}</h1>

      <input
        placeholder="Search streets..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />

      <ul>
        {filteredStreets.map(street => (
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
