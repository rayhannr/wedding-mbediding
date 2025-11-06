import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { deleteTokens } from '@/lib/auth'

export const POST: APIRoute = async ({ cookies }) => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400
    })
  }

  deleteTokens(cookies)

  return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200
  })
}
