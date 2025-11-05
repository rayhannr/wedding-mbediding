import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import path from 'path'
import react from '@astrojs/react'
import netlify from '@astrojs/netlify'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  },
  server: { port: 3000 },
  output: 'server',
  integrations: [react()],
  adapter: netlify(),
  env: {
    schema: {
      SUPABASE_URL: envField.string({ context: 'server', access: 'secret' }),
      SUPABASE_ANON_KEY: envField.string({ context: 'server', access: 'secret' }),
      ADMIN_USERID: envField.string({ context: 'server', access: 'secret' }),
      GROOM_FULLNAME: envField.string({ context: 'client', access: 'public' }),
      GROOM_TITLE: envField.string({ context: 'client', access: 'public' }),
      GROOM_NICKNAME: envField.string({ context: 'client', access: 'public' }),
      GROOM_PARENTS: envField.string({ context: 'client', access: 'public' }),
      GROOM_ROLE: envField.string({ context: 'client', access: 'public' }),
      BRIDE_FULLNAME: envField.string({ context: 'client', access: 'public' }),
      BRIDE_TITLE: envField.string({ context: 'client', access: 'public' }),
      BRIDE_NICKNAME: envField.string({ context: 'client', access: 'public' }),
      BRIDE_PARENTS: envField.string({ context: 'client', access: 'public' }),
      BRIDE_ROLE: envField.string({ context: 'client', access: 'public' }),
      WEDDING_DATE: envField.string({ context: 'client', access: 'public' }),
      VENUE_NAME: envField.string({ context: 'client', access: 'public' }),
      VENUE_ADDRESS: envField.string({ context: 'client', access: 'public' }),
      VENUE_GMAPS: envField.string({ context: 'client', access: 'public' })
    }
  }
})
