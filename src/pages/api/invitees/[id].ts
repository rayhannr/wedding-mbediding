import { getStatusCode } from '@/lib/error'
import { supabase } from '@/lib/supabase'
import { APIRoute } from 'astro'

export const PATCH: APIRoute = async ({ params }) => {
  const id = params.id
  if (!id) {
    return new Response(JSON.stringify({ err: 'id is required' }), { status: 400 })
  }

  try {
    const invitee = await supabase.from('invitee').select('*').eq('id', id).single()
    if (invitee.error) throw invitee.error
    if (!invitee.data) {
      return new Response(`${id} gak diundang wleee`, { status: 404 })
    }

    const { data, error } = await supabase
      .from('invitee')
      .update({ visit_count: (invitee.data.visit_count ?? 0) + 1 })
      .eq('id', id)
      .select()
      .single()
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
