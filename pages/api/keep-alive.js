import { createClient } from '@supabase/supabase-js'

// Supabase URL & anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  try {
    // Simple lightweight query to keep Supabase awake
    const { data, error } = await supabase
      .from('streets')  // Use any small table
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase ping error:', error.message)
      return res.status(500).json({ success: false, error: error.message })
    }

    console.log('Supabase ping successful:', data)
    return res.status(200).json({ success: true, data })
  } catch (err) {
    console.error('Supabase ping failed:', err)
    return res.status(500).json({ success: false, error: err.message })
  }
}
