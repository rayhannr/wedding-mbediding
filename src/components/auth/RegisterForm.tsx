import { useState } from 'react'
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

export const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof User>>({
    resolver: zodResolver(User)
  })

  const onSubmit = (data: z.infer<typeof User>) => {
    setIsSubmitting(true)
    axios
      .post('/api/auth/register', data)
      .then(() => {
        form.reset()
        window.location.href = '/login'
      })
      .catch((error) => {
        console.error(error)
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
                  disabled
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
                <PasswordInput disabled placeholder="password" autoCapitalize="none" autoCorrect="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled>
          {isSubmitting && <Loader2 className="animate-spin" />} Daftar
        </Button>
        <p className="text-sm text-muted-foreground">Note: Udah gak bisa bikin akun ya kak karena kami sudah punya 1 admin</p>
      </form>
    </Form>
  )
}
