import { useConfig, useInvitees } from '@/lib/query'
import { InviteDialog } from './InviteDialog'
import { ColumnDef } from '@tanstack/react-table'
import { Invitee } from '@/lib/schema'
import { DataTable } from '../ui/data-table'
import { ArrowUpDown, Loader2, MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { useSimpleReducer } from '@/lib/react'
import { DeleteInviteeDialog } from './DeleteInviteeDialog'
import { useTable } from '@/hooks/use-table'
import { DataTableFilter } from '../ui/data-table-filter'
import { formatAttendanceTime } from '@/lib/utils'
import { EditMessageDialog } from './EditMessageDialog'
import { BRIDE_FULLNAME, BRIDE_NICKNAME, BRIDE_TITLE, GROOM_FULLNAME, GROOM_NICKNAME, GROOM_TITLE } from 'astro:env/client'
import { toast } from 'sonner'

const getInvitationLink = (code: string) => {
  const basePath = window.location.origin
  return `${basePath}/${code}`
}

const copy = (text: string) => {
  toast.success('Berhasil disalin!', { duration: 1500 })
  navigator.clipboard.writeText(text)
}

export const Invitees = () => {
  const invitees = useInvitees()
  const invitationMessage = useConfig('message')
  const [selected, setSelected] = useSimpleReducer<{ invitee?: Invitee; action?: 'edit' | 'delete' }>({})

  const resetSelected = () => {
    setSelected({ invitee: null, action: '' })
  }

  const copyInvitationMessage = (name: string, code: string) => {
    const message = invitationMessage.data?.value || ''
    copy(
      message
        .replace('{name}', name)
        .replace('{link}', getInvitationLink(code))
        .replace('{groom_full}', `${GROOM_FULLNAME}, ${GROOM_TITLE}`)
        .replace('{groom_short}', GROOM_NICKNAME)
        .replace('{bride_full}', `${BRIDE_FULLNAME}, ${BRIDE_TITLE}`)
        .replace('{bride_short}', BRIDE_NICKNAME)
    )
  }

  const columns: ColumnDef<Invitee>[] = [
    {
      accessorKey: 'id',
      header: 'Kode'
    },
    {
      accessorKey: 'name',
      header: 'Nama'
    },
    {
      accessorKey: 'visit_count',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 hover:bg-inherit"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dilihat (kali) <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
    {
      accessorKey: 'time',
      header: 'Waktu Kedatangan',
      cell: ({ row }) => (row.original.time ? formatAttendanceTime(row.original.time) : '')
    },
    {
      id: 'actions',
      header: () => <p className="text-right">Aksi</p>,
      cell: ({ row }) => {
        const invitee = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0 float-end">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelected({ invitee, action: 'edit' })}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelected({ invitee, action: 'delete' })} className="text-destructive">
                Hapus
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => copy(getInvitationLink(invitee.id || ''))}>Salin link undangan</DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyInvitationMessage(invitee.name, invitee.id)}>
                Salin teks undangan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useTable({ columns, data: invitees.data || [] })

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <DataTableFilter table={table} placeholder="Filter nama..." />
        <div className="flex gap-1">
          <EditMessageDialog />
          <InviteDialog invitee={selected.action === 'edit' ? selected.invitee : undefined} onClose={resetSelected} />
        </div>
      </div>
      <DeleteInviteeDialog invitee={selected.action === 'delete' ? selected.invitee : undefined} onClose={resetSelected} />
      {invitees.isFetching && (
        <div className="flex gap-1 my-3">
          <Loader2 className="animate-spin w-5 h-5" />
          <p>Memuat daftar undangan...</p>
        </div>
      )}
      {invitees.isError && (
        <div className="flex items-center my-3">
          <p className="text-destructive -mr-2">Gagal memuat daftar undangan</p>
          <Button onClick={() => invitees.refetch()} variant="link">
            Muat ulang
          </Button>
        </div>
      )}
      {invitees.data && !invitees.isFetching && !invitees.isError && <DataTable table={table} className="mt-4" />}
    </>
  )
}
