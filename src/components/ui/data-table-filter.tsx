import { Table } from '@tanstack/react-table'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from './input'

interface Props<TData> extends React.ComponentProps<'input'> {
  table: Table<TData>
}

export function DataTableFilter<TData>({ table, ...props }: Props<TData>) {
  const onDebouncedFilter = useDebouncedCallback((value: string) => {
    table.getColumn('name')?.setFilterValue(value)
  }, 500)

  return (
    <Input
      defaultValue={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
      onChange={(event) => onDebouncedFilter(event.target.value)}
      className="max-w-sm"
      {...props}
    />
  )
}
