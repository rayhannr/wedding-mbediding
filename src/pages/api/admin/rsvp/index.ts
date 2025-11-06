import { getStatusCode } from '@/lib/error'
import { supabase } from '@/lib/supabase'
import { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase.from('rsvp').select('*,invitee(name)').order('created_at', { ascending: false })
    if (error) throw error

    const rsvpMap = new Map<string, (typeof data)[0]>()
    data.forEach((r) => {
      const found = rsvpMap.get(r.name)
      if (found && found.attendees > r.attendees) return
      rsvpMap.set(r.name, r)
    })
    return new Response(JSON.stringify([...rsvpMap.values()]), {
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
