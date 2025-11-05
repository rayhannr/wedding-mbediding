import { useCallback, useState } from 'react'

export const useInView = () => {
  const [isInView, setIsInView] = useState(false)
  const ref = useCallback((element: HTMLElement | null) => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(({ intersectionRatio, target }) => {
          if (intersectionRatio < 0.9) return
          setIsInView(true)
          observer.unobserve(target)
        })
      },
      { threshold: 1.0 }
    )

    if (element) observer.observe(element)
  }, [])

  return { isInView, ref }
}
