import { useEffect } from 'react'
import '../styles/style.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return <Component {...pageProps} />
}
