import { useAdminRSVPs, useInvitees, useRSVPs } from '@/lib/query'
import CountUp from 'react-countup'

const Stat = ({ end, label }: { end: number; label: string }) => (
  <div>
    <CountUp end={end} className="text-5xl font-medium font-title tracking-tighter" />
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
)

export const Stats = () => {
  const invitees = useInvitees()
  const rsvps = useAdminRSVPs()
  const messages = useRSVPs()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
      <Stat end={invitees.data?.length || 0} label="Undangan Terkirim" />
      <Stat end={rsvps.data?.length || 0} label="Mengisi RSVP" />
      <Stat
        end={
          rsvps.data
            ?.filter((rsvp) => rsvp.attendance === 'yes')
            .map((rsvp) => rsvp.attendees)
            .reduce((acc, curr) => acc + curr, 0) || 0
        }
        label="Estimasi Tamu yang Hadir"
      />
      <Stat end={rsvps.data?.filter((rsvp) => rsvp.attendance === 'no').length || 0} label="Belum Bisa Hadir" />
      <Stat end={messages.data?.filter(({ message }) => !!message).length || 0} label="Pesan" />
    </div>
  )
}
