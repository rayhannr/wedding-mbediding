import { getStatusCode } from '@/lib/error'
import { supabase } from '@/lib/supabase'
import { APIRoute } from 'astro'

export const PATCH: APIRoute = async ({ params, request }) => {
  const key = params.key
  if (!key) {
    return new Response(JSON.stringify({ err: 'key is required' }), { status: 400 })
  }

  try {
    const config = await request.json()

    const { data, error } = await supabase.from('config').upsert(config).eq('key', key).select('*').single()
    if (error) throw error
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    return new Response(JSON.stringify(error || {}), {
      status: getStatusCode(error)
    })
  }
}

export const GET: APIRoute = async ({ params }) => {
  const key = params.key
  if (!key) {
    return new Response(JSON.stringify({ err: 'key is required' }), { status: 400 })
  }

  try {
    const { data, error } = await supabase.from('config').select('*').eq('key', key).single()
    if (error) throw error
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    return new Response(JSON.stringify(error || {}), {
      status: getStatusCode(error)
    })
  }
}
