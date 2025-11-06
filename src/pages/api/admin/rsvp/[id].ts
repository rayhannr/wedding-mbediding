import { getStatusCode } from '@/lib/error'
import { supabase } from '@/lib/supabase'
import { APIRoute } from 'astro'

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params
  if (!id) {
    return new Response(JSON.stringify({ err: 'id is required' }), { status: 400 })
  }

  try {
    const { data, error } = await supabase.from('rsvp').delete().eq('id', id).select().single()
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

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params
  if (!id) {
    return new Response(JSON.stringify({ err: 'id is required' }), { status: 400 })
  }

  try {
    const rsvp = await request.json()
    const { data, error } = await supabase.from('rsvp').update(rsvp).eq('id', id).select().single()
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
