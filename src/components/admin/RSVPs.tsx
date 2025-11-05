import { Rsvp } from '@/lib/schema'
import { useTable } from '@/hooks/use-table'
import { ATTENDANCE_MAP } from '@/lib/form'
import { useAdminRSVPs } from '@/lib/query'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { DataTable } from '../ui/data-table'
import { DataTableFilter } from '../ui/data-table-filter'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
import { DeleteRSVPSDialog } from './DeleteRSVPDialog'

export const RSVPs = () => {
  const rsvp = useAdminRSVPs()
  const [selectedRSVP, setSelectedRSVP] = useState<Rsvp>()

  const columns: ColumnDef<Rsvp>[] = [
    {
      accessorKey: 'name',
      header: 'Nama'
    },
    {
      accessorKey: 'attendance',
      header: 'Kehadiran',
      cell: ({ row }) => {
        const rsvp = row.original
        return ATTENDANCE_MAP.get(rsvp.attendance) ?? rsvp.attendance
      }
    },
    {
      accessorKey: 'attendees',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 hover:bg-inherit"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Jumlah <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
    {
      accessorKey: 'invitee.name',
      header: 'Sumber',
      // @ts-ignore
      cell: ({ row }) => row.original.invitee?.name || <i className="text-muted-foreground">Tamu tak diundang</i>
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

  console.log(rsvp.data, 'ajgile')
  const table = useTable({ columns, data: rsvp.data || [] })

  const onDebouncedFilter = useDebouncedCallback((value: string) => {
    table.getColumn('attendance')?.setFilterValue(value)
  }, 500)

  return (
    <>
      <DeleteRSVPSDialog rsvp={selectedRSVP} onClose={() => setSelectedRSVP(undefined)} />
      {rsvp.isFetching && (
        <div className="flex gap-1 my-3">
          <Loader2 className="animate-spin w-5 h-5" />
          <p>Memuat daftar RSVP...</p>
        </div>
      )}
      {rsvp.isError && (
        <div className="flex items-center my-3">
          <p className="text-destructive -mr-2">Gagal memuat daftar RSVP</p>
          <Button onClick={() => rsvp.refetch()} variant="link">
            Muat ulang
          </Button>
        </div>
      )}
      {rsvp.data && !rsvp.isFetching && !rsvp.isError && (
        <>
          <div className="flex flex-wrap gap-4">
            <DataTableFilter table={table} placeholder="Filter nama" />
            <Select onValueChange={onDebouncedFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter kehadiran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null as any}>Filter kehadiran</SelectItem>
                {Array.from(ATTENDANCE_MAP.entries()).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DataTable table={table} className="mt-4" />
        </>
      )}
    </>
  )
}
