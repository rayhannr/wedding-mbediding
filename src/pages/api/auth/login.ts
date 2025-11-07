import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { User } from '@/lib/schema'
import { setTokens } from '@/lib/auth'
import { ADMIN_USERID } from 'astro:env/server'

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.json()
  const user = User.safeParse(formData)

  if (!user.success) {
    return new Response('Invalid email or password', { status: 400 })
  }
  try {
    const { email, password } = user.data
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    if (data.user?.id !== ADMIN_USERID)
      return new Response(JSON.stringify({ error: "you're not an admin we recognize" }), { status: 403 })
    setTokens(data.session, cookies)

    return new Response(JSON.stringify({ message: 'Logged in successfully' }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 })
  }
}
