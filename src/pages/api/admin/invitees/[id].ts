import { getStatusCode } from '@/lib/error'
import { supabase } from '@/lib/supabase'
import { APIRoute } from 'astro'

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = params.id
  if (!id) {
    return new Response(JSON.stringify({ err: 'id is required' }), { status: 400 })
  }

  try {
    const invitee = await request.json()
    const { data, error } = await supabase.from('invitee').update(invitee).eq('id', id).select().single()
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

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id
  if (!id) {
    return new Response(JSON.stringify({ err: 'id is required' }), { status: 400 })
  }

  try {
    const { data, error } = await supabase.from('invitee').delete().eq('id', id).select().single()
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
