import { useRSVPs } from '@/lib/query'
import { useInView } from '@/hooks/use-in-view'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { WishCarousel } from './WishCarousel'

export const Wishes = () => {
  const { isInView, ref } = useInView()

  const rsvp = useRSVPs({ enabled: isInView })

  return (
    <section ref={ref} id="wishes">
      <div className="container py-4 xl:py-12 px-4 sm:px-6 lg:px-36 xl:px-48 grid gap-4 items-center mx-auto">
        <p className="text-center font-medium relative inline-block pointer-events-none">DOA DAN UCAPAN SELAMAT</p>
        {rsvp.isFetching && (
          <div className="flex gap-1 my-3 justify-center text-muted-foreground relative pointer-events-none">
            <Loader2 className="animate-spin w-5 h-5" />
            <p>Memuat doa dan ucapan selamat...</p>
          </div>
        )}
        {rsvp.isError && (
          <div className="flex items-center justify-center my-3 relative">
            <p className="text-destructive -mr-2 pointer-events-none">Gagal memuat doa dan ucapan selamat 😢</p>
            <Button onClick={() => rsvp.refetch()} variant="link">
              Muat ulang
            </Button>
          </div>
        )}
        {rsvp.data && !rsvp.isFetching && !rsvp.isError && <WishCarousel wishes={rsvp.data.filter((rsvp) => !!rsvp.message)} />}
      </div>
    </section>
  )
}
