import { PostgrestError } from '@supabase/supabase-js'

export const getStatusCode = (error: PostgrestError) => {
  switch (error.code) {
    case 'PGRST116':
      return 404
    default:
      return 500
  }
}
