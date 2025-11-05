import { queryClient, useConfig } from '@/lib/query'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { Loader2, Mail } from 'lucide-react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import axios from 'axios'
import { getGenericErrorMessage } from '@/lib/react'
import { toast } from 'sonner'

export const EditMessageDialog = () => {
  const defaultMessage = useConfig('message')
  const [message, setMessage] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const editMessage = () => {
    if (!message) return
    setSubmitting(true)
    axios
      .patch('/api/admin/config/message', { key: 'message', value: message.trim() })
      .then(({ data }) => {
        setSubmitting(false)
        setMessage('')
        setOpen(false)
        queryClient.setQueryData(['config', 'message'], data)
        toast.success('Template undangan diedit', {
          description: 'Saatnya kita undang tamu-tamu itu!',
          duration: 2000
        })
      })
      .catch((error) => {
        console.error(error)
        setSubmitting(false)

        toast.error('Undangan gagal', {
          duration: 2000,
          description: getGenericErrorMessage('Server kami gagal mengedit template undangan. Mohon bersabar.', error)
        })
      })
  }

  useEffect(() => {
    setMessage(defaultMessage.data?.value || '')
  }, [defaultMessage.data])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon" onClick={() => setOpen(true)}>
                <span className="sr-only">Edit Template Undangan</span>
                <Mail />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Template Undangan</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm md:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle>Edit Template Undangan</DialogTitle>
          <DialogDescription>Gunakan keyword berikut sebagai placeholder teks dinamis:</DialogDescription>
          <div className="text-muted-foreground text-sm">
            <p>
              <code>{`{name}`}</code>: Nama orang yang diundang
            </p>
            <p>
              <code>{`{link}`}</code>: Link undangan
            </p>
            <p>
              <code>{`{groom_full}`}</code>: Nama lengkap calon pengantin laki-laki
            </p>
            <p>
              <code>{`{groom_short}`}</code>: Nama panggilan calon pengantin laki-laki
            </p>
            <p>
              <code>{`{bride_full}`}</code>: Nama lengkap calon pengantin perempuan
            </p>
            <p>
              <code>{`{bride_short}`}</code>: Nama panggilan calon pengantin perempuan
            </p>
          </div>
        </DialogHeader>

        {defaultMessage.isFetching && (
          <div className="flex gap-1 my-3">
            <Loader2 className="animate-spin w-5 h-5" />
            <p>Memuat teks undangan...</p>
          </div>
        )}
        {!defaultMessage.isFetching && (
          <div>
            <Label htmlFor="message">Template Undangan</Label>
            <Textarea
              placeholder="Bismillah..."
              className="resize-none max-h-80 text-wrap"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              ref={(textarea) => {
                if (textarea) {
                  textarea.style.height = '0px'
                  textarea.style.height = textarea.scrollHeight + 'px'
                }
              }}
            />
          </div>
        )}

        <DialogFooter>
          <Button
            disabled={!message || message === defaultMessage.data?.value || defaultMessage.isFetching}
            type="submit"
            onClick={editMessage}
          >
            {isSubmitting && <Loader2 className="animate-spin" />} Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
