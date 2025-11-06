import { useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'astro/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { User } from '@/lib/schema'
import axios from 'axios'
import { PasswordInput } from '../ui/password-input'
import { toast } from 'sonner'

export const LoginForm = () => {
  const ref = useRef<HTMLAnchorElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof User>>({
    resolver: zodResolver(User)
  })

  const onSubmit = (data: z.infer<typeof User>) => {
    setIsSubmitting(true)
    axios
      .post('/api/auth/login', data)
      .then(() => {
        form.reset()
        if (ref.current) {
          ref.current.click()
        } else {
          window.location.href = '/'
        }
      })
      .catch((error) => {
        console.error(error)
        toast.error('Gagal login', { description: 'Cek lagi email sama passwordnya' })
      })
      .finally(() => setIsSubmitting(false))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-0 grid gap-1">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-0 grid gap-1">
              <FormLabel className="sr-only">Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="password" autoCapitalize="none" autoCorrect="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />} Login
        </Button>
        <a href="/admin" ref={ref} className="sr-only">
          Dashboard
        </a>
      </form>
    </Form>
  )
}
