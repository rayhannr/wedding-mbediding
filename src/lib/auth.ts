import { Session } from '@supabase/supabase-js'
import { AstroCookies } from 'astro'

export const ACCESS_TOKEN_KEY = 'sb-access-token'
export const REFRESH_TOKEN_KEY = 'sb-refresh-token'

export const getTokens = (cookies: AstroCookies) => {
  const accessToken = cookies.get(ACCESS_TOKEN_KEY)
  const refreshToken = cookies.get(REFRESH_TOKEN_KEY)

  return { accessToken, refreshToken }
}

export const setTokens = (session: Session, cookies: AstroCookies) => {
  const { access_token, refresh_token } = session
  cookies.set(ACCESS_TOKEN_KEY, access_token, { path: '/' })
  cookies.set(REFRESH_TOKEN_KEY, refresh_token, { path: '/' })
}

export const deleteTokens = (cookies: AstroCookies) => {
  cookies.delete(ACCESS_TOKEN_KEY, { path: '/' })
  cookies.delete(REFRESH_TOKEN_KEY, { path: '/' })
}
