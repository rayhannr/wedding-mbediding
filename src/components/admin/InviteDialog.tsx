import { useEffect, useState } from 'react'
import { Loader2, UserRoundPlus } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios, { AxiosError } from 'axios'
import { Invitee } from '@/lib/schema'
import { queryClient } from '@/lib/query'
import { getGenericErrorMessage } from '@/lib/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { formatAttendanceTime } from '@/lib/utils'
import { toast } from 'sonner'

interface Props {
  invitee?: Invitee
  onClose: () => void
}

export const InviteDialog = ({ invitee, onClose }: Props) => {
  const [name, setName] = useState('')
  const [time, setTime] = useState<string>()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const title = invitee ? 'Edit Undangan' : 'Tambah Undangan'

  const addInvite = () => {
    setSubmitting(true)
    const data: Partial<Invitee> = { name, visit_count: 0, time }
    axios
      .post<Invitee>('/api/admin/invitees', data)
      .then((result) => {
        setSubmitting(false)
        setOpen(false)
        setName('')

        const cachedData = (queryClient.getQueryData(['invitees']) || []) as Invitee[]
        queryClient.setQueryData(['invitees'], [result.data, ...cachedData])
        toast.success('Undangan ditambah', { description: `${data.name} masuk daftar undangan` })
      })
      .catch((error: AxiosError<any>) => {
        console.error(error)
        setSubmitting(false)

        const errorMessage = error.response?.data?.[0]?.message as string
        toast.error('Undangan gagal', {
          duration: 3000,
          description: errorMessage.includes('is not unique')
            ? `${data.name} sudah pernah diundang`
            : getGenericErrorMessage('Server kami gagal menyimpan undangan. Mohon bersabar.', error)
        })
      })
  }

  const editInvite = () => {
    if (!invitee) return
    setSubmitting(true)
    axios
      .patch(`/api/admin/invitees/${invitee.id}`, { name, time })
      .then((result) => {
        setSubmitting(false)
        setOpen(false)
        setName('')
        setTime(undefined)

        const cachedData = structuredClone((queryClient.getQueryData(['invitees']) || []) as Invitee[])
        const editedIndex = cachedData.findIndex((data) => data.id === invitee.id)

        if (editedIndex > -1) cachedData[editedIndex] = result.data
        queryClient.setQueryData(['invitees'], cachedData)
        queryClient.invalidateQueries({ queryKey: ['admin-rsvp'] })
        if (invitee.name !== name) {
          toast.success('Undangan diedit', { description: `Nama tamu berubah dari ${invitee.name} jadi ${name}` })
        }
        if (invitee.time !== time) {
          toast.success('Undangan diedit', {
            description: `${name} jadinya dateng jam ${time}`
          })
        }
      })
      .catch((error: AxiosError<any>) => {
        console.error(error)
        setSubmitting(false)

        const errorMessage = error.response?.data?.[0]?.message as string
        toast.error('Undangan gagal', {
          duration: 3000,
          description: errorMessage.includes('is not unique')
            ? `${name} sudah pernah diundang`
            : getGenericErrorMessage('Server kami gagal meng-update undangan. Mohon bersabar.', error)
        })
      })
  }

  useEffect(() => {
    setOpen(!!invitee)
    setName(invitee?.name || '')
    setTime(invitee?.time || '')
  }, [invitee])

  useEffect(() => {
    if (!open) onClose()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon" onClick={() => setOpen(true)}>
                <span className="sr-only">{title}</span>
                <UserRoundPlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Bisa untuk satu orang atau grup</DialogDescription>
        </DialogHeader>

        <div>
          <Label htmlFor="name">Nama</Label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Minato Namikaze" />
        </div>
        <div>
          <Label htmlFor="time">Waktu Kedatangan</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Waktu" />
            </SelectTrigger>
            <SelectContent>
              {['10.00-11.00', '11.00-12.00', '12.00-13.00'].map((t) => (
                <SelectItem value={t} key={t}>
                  {formatAttendanceTime(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={invitee ? editInvite : addInvite} disabled={isSubmitting || !name} type="submit">
            {isSubmitting && <Loader2 className="animate-spin" />} {invitee ? 'Edit' : 'Undang'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
