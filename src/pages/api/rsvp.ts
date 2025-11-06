import { getStatusCode } from '@/lib/error'
import { supabase } from '@/lib/supabase'
import { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const rsvp = await request.json()
    if (rsvp.message?.length > 400) {
      return new Response(JSON.stringify({ message: 'message should only be 400 characters long' }), { status: 400 })
    }
    if (rsvp.name?.length > 100) {
      return new Response(JSON.stringify({ message: 'name should only be 100 characters long' }), { status: 400 })
    }
    const { data, error } = await supabase.from('rsvp').insert([rsvp]).select().single()

    if (error) throw error
    return new Response(JSON.stringify(data), {
      status: 201,
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

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase.from('rsvp').select('*').order('created_at', { ascending: false })
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
