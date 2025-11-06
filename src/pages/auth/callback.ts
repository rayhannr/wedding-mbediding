import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ request, redirect }) => {
  const code = new URL(request.url).searchParams.get('code')

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return redirect('/')
    }
  }

  // If there's an error or no code, redirect to login
  return redirect('/login')
}
