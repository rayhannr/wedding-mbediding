import { deleteTokens, getTokens } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { ADMIN_USERID } from 'astro:env/server'
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async ({ url, redirect, cookies }, next) => {
  const response = await next()
  const protectedPages = ['/admin']
  const protectedApis = ['/api/admin']
  const { pathname } = url

  const isPageProtected = protectedPages.some((path) => pathname.startsWith(path))
  const isApiProtected = protectedApis.some((path) => pathname.startsWith(path))
  if (!isPageProtected && !isApiProtected) return response

  const { accessToken, refreshToken } = getTokens(cookies)
  const session = await supabase.auth.getSession()
  const isUnauthorized = !accessToken || !refreshToken
  const unauthorizedResponse = isApiProtected
    ? new Response(JSON.stringify({ message: 'token is expired' }), { status: 401 })
    : redirect('/login')
  if (isUnauthorized) return unauthorizedResponse

  try {
    const newSession = await supabase.auth.setSession({
      access_token: session.data.session?.access_token || accessToken.value,
      refresh_token: session.data.session?.refresh_token || refreshToken.value
    })
    if (newSession.error) throw newSession.error
    const { user } = newSession.data
    if (user?.id !== ADMIN_USERID) throw new Error("no you don't belong here")
  } catch (error) {
    console.error(error)
    deleteTokens(cookies)
    return unauthorizedResponse
  }

  return response
})
