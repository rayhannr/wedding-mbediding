import { useEffect, useState } from 'react'
import { z } from 'astro/zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { queryClient } from '@/lib/query'
import { ATTENDANCE_MAP } from '@/lib/form'
import { Invitee, Rsvp } from '@/lib/schema'
import dayjs from 'dayjs'
import { getGenericErrorMessage } from '@/lib/react'
import { toast } from 'sonner'

const MESSAGE_MAX_LENGTH = 400

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Nama minimal 2 karakter' }).max(50, { message: 'Nama maksimal 50 karakter' }),
  message: z
    .string()
    .max(MESSAGE_MAX_LENGTH, { message: `Pesan maksimal ${MESSAGE_MAX_LENGTH} karakter` })
    .optional(),
  attendance: z.string({ message: 'Pilih salah satu' }),
  attendees: z.number({ message: 'Diisi angka ya' }).min(0)
})

export const AttendanceForm = ({ invitee }: { invitee?: Invitee }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: invitee?.name || '',
      message: '',
      attendance: 'yes',
      attendees: 1
    }
  })
  const attendance = form.watch('attendance')
  const isComing = attendance === 'yes'

  const [isSubmitting, setSubmitting] = useState(false)

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true)
    const submittedData = {
      ...data,
      source: invitee?.id || null
    }
    axios
      .post('/api/rsvp', submittedData)
      .then((result: AxiosResponse<Rsvp>) => {
        setSubmitting(false)
        form.reset()
        const clonedResult = structuredClone(result.data)
        clonedResult.created_at = dayjs(result.data.created_at).subtract(3, 'second').toISOString()
        const cachedData = (queryClient.getQueryData(['rsvp']) || []) as Rsvp[]

        queryClient.setQueryData(['rsvp'], [clonedResult, ...cachedData])
        queryClient.invalidateQueries({ queryKey: ['admin-rsvp'] })
        toast.success('Terima kasih', { description: 'Konfirmasi kehadiran berhasil disimpan.', duration: 150000 })
        if (data.message) document.getElementById('wishes')?.scrollIntoView({ behavior: 'smooth' })
      })
      .catch((error: AxiosError) => {
        console.error(error)
        setSubmitting(false)
        toast.error('Waduh', {
          duration: 3000,
          description: getGenericErrorMessage('Server kami gagal menyimpan konfirmasi kehadiran Anda. Coba lagi.', error)
        })
      })
  }

  useEffect(() => {
    form.setValue('attendees', isComing ? 1 : 0, { shouldTouch: false, shouldDirty: false })
  }, [isComing])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="relative">Nama</FormLabel>
              <FormControl className="relative">
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-wrap justify-between relative">
                <span>Pesan (opsional)</span>
                <span>
                  {field.value?.length || 0}/{MESSAGE_MAX_LENGTH}
                </span>
              </FormLabel>
              <FormControl className="relative">
                <Textarea
                  placeholder="Ucapan selamat dan doa"
                  maxLength={MESSAGE_MAX_LENGTH}
                  className="resize-none text-wrap"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="attendance"
            render={({ field }) => (
              <FormItem className="w-2/3 sm:w-1/2">
                <FormLabel className="relative">Kehadiran</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="relative">
                    <SelectTrigger>
                      <SelectValue placeholder="Konfirmasi kehadiran" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from(ATTENDANCE_MAP.entries()).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attendees"
            render={({ field }) => (
              <FormItem className="w-1/3 sm:w-1/2">
                <FormLabel className="relative">Jumlah</FormLabel>
                <FormControl className="relative">
                  <Input
                    type="number"
                    {...field}
                    onChange={(event) => {
                      const { value } = event.target
                      if (value === '') {
                        field.onChange(value)
                        return
                      }
                      field.onChange(+value)
                    }}
                    disabled={!isComing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="relative">
          {isSubmitting && <Loader2 className="animate-spin" />}
          Konfirmasi
        </Button>
      </form>
    </Form>
  )
}
