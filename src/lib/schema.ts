import { z } from 'astro/zod'
import { Database } from '@/db/database.types'

export const User = z.object({
  email: z.string().email({ message: 'Pakai format email yang bener' }),
  password: z.string().min(8, { message: 'Password minimal 8 karakter' }).max(64, { message: 'Password maksimal 64 karakter' })
})

export type Invitee = Database['public']['Tables']['invitee']['Row']
export type Rsvp = Database['public']['Tables']['rsvp']['Row']
export type Config = Database['public']['Tables']['config']['Row']
