import { Rsvp } from '@/lib/schema'
import { useTable } from '@/hooks/use-table'
import { useRSVPs } from '@/lib/query'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { DataTable } from '../ui/data-table'
import { useMemo, useState } from 'react'
import { DeleteMessageDialog } from './DeleteMessageDialog'

export const Messages = () => {
  const rsvp = useRSVPs()
  const rsvpWithMessage = useMemo(() => rsvp.data?.filter((r) => !!r.message), [rsvp.data])
  const [selectedRSVP, setSelectedRSVP] = useState<Rsvp>()

  const columns: ColumnDef<Rsvp>[] = [
    {
      accessorKey: 'name',
      header: 'Nama'
    },
    {
      accessorKey: 'message',
      header: 'Pesan'
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const message = row.original

        return (
          <Button variant="ghost" onClick={() => setSelectedRSVP(message)} className="text-destructive px-0">
            Hapus
          </Button>
        )
      }
    }
  ]
  const table = useTable({ columns, data: rsvpWithMessage || [] })

  return (
    <>
      <DeleteMessageDialog rsvp={selectedRSVP} onClose={() => setSelectedRSVP(undefined)} />
      {rsvp.isFetching && (
        <div className="flex gap-1 my-3">
          <Loader2 className="animate-spin w-5 h-5" />
          <p>Memuat daftar Pesan...</p>
        </div>
      )}
      {rsvp.isError && (
        <div className="flex items-center my-3">
          <p className="text-destructive -mr-2">Gagal memuat daftar pesan</p>
          <Button onClick={() => rsvp.refetch()} variant="link">
            Muat ulang
          </Button>
        </div>
      )}
      {rsvp.data && !rsvp.isFetching && !rsvp.isError && <DataTable table={table} className="mt-4" />}
    </>
  )
}
