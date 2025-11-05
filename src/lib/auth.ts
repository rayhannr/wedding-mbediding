import { AstroCookies } from 'astro'

const ACCESS_TOKEN_KEY = 'sb-access-token'
const REFRESH_TOKEN_KEY = 'sb-refresh-token'

export const getTokens = (cookies: AstroCookies) => {
  const accessToken = cookies.get(ACCESS_TOKEN_KEY)
  const refreshToken = cookies.get(REFRESH_TOKEN_KEY)

  return { accessToken, refreshToken }
}

export const deleteTokens = (cookies: AstroCookies) => {
  cookies.delete('sb-access-token', { path: '/' })
  cookies.delete('sb-refresh-token', { path: '/' })
}
