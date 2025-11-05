import { Rsvp } from '@/lib/schema'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { queryClient } from '@/lib/query'
import { getGenericErrorMessage } from '@/lib/react'
import { toast } from 'sonner'

interface Props {
  rsvp?: Rsvp
  onClose: () => void
}

export const DeleteMessageDialog = ({ rsvp, onClose }: Props) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)

  const deleteMessage = () => {
    setSubmitting(true)
    axios
      .patch(`/api/admin/rsvp/${rsvp?.id}`, { message: '' })
      .then(() => {
        setSubmitting(false)
        setOpen(false)

        const cachedData = (queryClient.getQueryData(['admin-rsvp']) || []) as Rsvp[]
        queryClient.setQueryData(
          ['admin-rsvp'],
          cachedData.filter((data) => data.id !== rsvp?.id)
        )
        queryClient.invalidateQueries({ queryKey: ['rsvp'] })
        toast.success('Pesan dihapus', { description: 'Mungkin pesannya terlalu ofensif kali ya' })
      })
      .catch((error) => {
        console.error(error)
        setSubmitting(false)
        toast.error('Waduh', {
          duration: 3000,
          description: getGenericErrorMessage('Server kami gagal menghapus undangan. Mohon bersabar.', error)
        })
      })
  }

  useEffect(() => {
    setOpen(!!rsvp)
  }, [rsvp])

  useEffect(() => {
    if (!open) onClose()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Pesan</DialogTitle>
          <DialogDescription className="my-0!" />
        </DialogHeader>
        <span className="text-muted-foreground">
          Yakin mau hapus pesan dari <b className="text-primary">{rsvp?.name}</b>?
        </span>
        <DialogFooter>
          <Button disabled={isSubmitting || !rsvp} onClick={deleteMessage} type="submit" variant="destructive">
            {isSubmitting && <Loader2 className="animate-spin" />} Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
