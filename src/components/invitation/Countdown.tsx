import { WEDDING_DATE } from 'astro:env/client'
import { useEffect, useState } from 'react'

interface CountdownProps {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const DEFAULT_COUNTDOWN = { days: 0, hours: 0, minutes: 0, seconds: 0 }
const addZero = (time: number) => `${time}`.padStart(2, '0')

export const Countdown = () => {
  const [countdown, setCountdown] = useState<CountdownProps>(DEFAULT_COUNTDOWN)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const eventDate = new Date(WEDDING_DATE).getTime()
      const distance = eventDate - now

      if (distance < 0) {
        clearInterval(interval)
        setCountdown(DEFAULT_COUNTDOWN)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="relative overflow-hidden morphing-diamonds text-white">
      <div className="container mx-auto py-12 xl:py-24 px-4 sm:px-6 lg:px-36 xl:px-48 space-y-10">
        <div className="lg:flex gap-x-8 lg:gap-x-16 items-center justify-between">
          <img
            src="/images/hourglass.png"
            loading="lazy"
            className="w-full lg:w-1/2 h-auto sm:w-auto sm:max-h-44 xl:max-h-72 mx-auto lg:mx-0 relative mb-4 lg:mb-0"
          />

          <ul className="w-full grid place-items-center grid-cols-4 gap-x-2 gap-y-8 xl:gap-x-4 mt-4">
            {[
              { label: 'Hari', value: countdown.days },
              { label: 'Jam', value: countdown.hours },
              { label: 'Menit', value: countdown.minutes },
              { label: 'Detik', value: countdown.seconds }
            ].map((c) => (
              <li key={c.label} className="text-center">
                <h2 className="font-title font-medium text-4xl sm:text-5xl lg:text-6xl tracking-[-.045em]!">
                  {addZero(c.value)}
                </h2>
                <p className="text-slate-300 text-base lg:text-lg">{c.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
