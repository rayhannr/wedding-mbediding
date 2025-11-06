import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Rsvp } from '@/lib/schema'
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { chunkArray, cn } from '@/lib/utils'
import { User } from '../icons/User'

dayjs.extend(relativeTime)

interface Props {
  wishes: Rsvp[]
}

const maxHeight = 600

export const WishCarousel = ({ wishes }: Props) => {
  const [api, setApi] = useState<CarouselApi>()
  const [carouselHeight, setCarouselHeight] = useState<number>(0)

  const updateHeight = useCallback(() => {
    if (!api) return
    const selectedIndex = api.selectedScrollSnap()
    const selectedSlide = api.slideNodes()[selectedIndex]

    if (selectedSlide) {
      setCarouselHeight(Math.min(selectedSlide.scrollHeight, maxHeight))
    }
  }, [api])

  useEffect(() => {
    if (!api) return

    updateHeight()
    api.on('select', updateHeight)
    api.on('resize', updateHeight)
    window.addEventListener('resize', updateHeight)

    return () => {
      api.off('select', updateHeight)
      api.off('resize', updateHeight)
      window.removeEventListener('resize', updateHeight)
    }
  }, [api, updateHeight])

  useEffect(() => {
    if (!api) return
    api.scrollTo(0, false)
  }, [wishes.length, api])

  if (!wishes.length)
    return (
      <p className="text-center text-muted-foreground relative inline-block pointer-events-none">
        Belum ada. Yuk jadi yang pertama memberi doa dan ucapan selamat kepada calon pengantin!
      </p>
    )

  return (
    <Carousel opts={{ align: 'start' }} orientation="horizontal" setApi={setApi} className="text-center">
      <CarouselContent className="transition-[height] duration-300 min-h-24 max-h-[600px]" style={{ height: carouselHeight }}>
        {chunkArray(wishes, 5).map((wish) => (
          <CarouselItem key={wish[0].id} className="text-left flex flex-col gap-6">
            {wish.map((w) => (
              <blockquote className="flex gap-2 justify-start" key={w.id}>
                <div>
                  <User />
                </div>
                <div>
                  <h4 className="font-title leading-none">{w.name}</h4>
                  <span className="text-muted-foreground text-sm">{dayjs(w.created_at).locale('id').fromNow()}</span>
                  <p className="mt-2 text-sm">{w.message}</p>
                </div>
              </blockquote>
            ))}
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex gap-2 justify-center mt-4">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}
