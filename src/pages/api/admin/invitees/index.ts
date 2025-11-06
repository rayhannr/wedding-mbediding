import { getStatusCode } from '@/lib/error'
import { supabase } from '@/lib/supabase'
import { generateCode } from '@/lib/utils'
import { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase.from('invitee').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    return new Response(JSON.stringify(error?.errors || {}), {
      status: getStatusCode(error)
    })
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const invitee = await request.json()
    const id = generateCode()
    const { data, error } = await supabase
      .from('invitee')
      .insert([{ ...invitee, id }])
      .select('*')
      .single()
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
