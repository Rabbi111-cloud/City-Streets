import Head from 'next/head'

export default function App({ Component, pageProps }) {
  // Temporarily DISABLE the service worker to avoid old cached pages
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/sw.js')
  //   }
  // }, [])

  return (
    <>
      <Head>
        <style>{`
          * {
            box-sizing: border-box;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }

          body {
            margin: 0;
            background: #f4f6fb;
            color: #222;
          }

          .container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card {
            background: white;
            padding: 32px;
            border-radius: 14px;
            box-shadow: 0 20px 40px rgba(0,0,0,.08);
            width: 100%;
            max-width: 420px;
          }

          .btn {
            display: inline-block;
            padding: 14px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            border: none;
          }

          .btn-primary {
            background: #4f46e5;
            color: white;
          }

          .btn-secondary {
            border: 2px solid #4f46e5;
            color: #4f46e5;
            background: transparent;
          }

          .title {
            font-size: 34px;
            font-weight: 800;
            margin-bottom: 10px;
          }

          .subtitle {
            color: #555;
            margin-bottom: 24px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 22px;
            padding: 30px;
          }

          .city-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 15px 30px rgba(0,0,0,.08);
            transition: transform .25s ease;
          }

          .city-card:hover {
            transform: translateY(-6px);
          }

          .city-card img {
            width: 100%;
            height: 170px;
            object-fit: cover;
          }

          .city-card div {
            padding: 16px;
          }

          .street-img {
            width: 100%;
            height: 260px;
            object-fit: cover;
            border-radius: 16px;
            margin-bottom: 20px;
          }

          .landmark {
            background: #eef2ff;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 8px;
          }
        `}</style>
      </Head>

      <Component {...pageProps} />
    </>
  )
}

