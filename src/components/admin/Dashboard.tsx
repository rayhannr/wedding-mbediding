import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Invitees } from './Invitees'
import { RSVPs } from './RSVPs'
import { Messages } from './Messages'
import { Stats } from './Stats'

export const Dashboard = () => {
  const [table, setTable] = useState('invitee')
  return (
    <div className="space-y-12">
      <Stats />
      <div className="flex gap-3 items-center justify-end">
        <p className="text-muted-foreground">Tabel</p>
        <Select value={table} onValueChange={setTable}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Pilih Tabel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="invitee">Undangan</SelectItem>
            <SelectItem value="rsvp">RSVP</SelectItem>
            <SelectItem value="message">Pesan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {table === 'invitee' && <Invitees />}
      {table === 'rsvp' && <RSVPs />}
      {table === 'message' && <Messages />}
    </div>
  )
}
