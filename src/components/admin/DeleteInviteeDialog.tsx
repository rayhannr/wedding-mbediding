import { Invitee } from '@/lib/schema'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { queryClient } from '@/lib/query'
import { getGenericErrorMessage } from '@/lib/react'
import { toast } from 'sonner'

interface Props {
  invitee?: Invitee
  onClose: () => void
}

export const DeleteInviteeDialog = ({ invitee, onClose }: Props) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)

  const deleteInvitee = () => {
    setSubmitting(true)
    axios
      .delete(`/api/admin/invitees/${invitee?.id}`)
      .then(() => {
        setSubmitting(false)
        setOpen(false)

        const cachedData = (queryClient.getQueryData(['invitees']) || []) as Invitee[]
        queryClient.setQueryData(
          ['invitees'],
          cachedData.filter((data) => data.id !== invitee?.id)
        )
        toast.success('Undangan dihapus', { description: `${invitee?.name} batal diundang` })
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
    setOpen(!!invitee)
  }, [invitee])

  useEffect(() => {
    if (!open) onClose()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Undangan</DialogTitle>
          <DialogDescription className="my-0!" />
        </DialogHeader>
        <span className="text-muted-foreground">
          Yakin gak jadi undang <b className="text-primary">{invitee?.name}</b>?
        </span>
        <DialogFooter>
          <Button disabled={isSubmitting || !invitee} onClick={deleteInvitee} type="submit" variant="destructive">
            {isSubmitting && <Loader2 className="animate-spin" />} Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
