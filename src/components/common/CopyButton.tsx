import { useEffect, useState } from 'react'
import { Copy, CopyCheck } from 'lucide-react'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast'

interface Props {
  content: string
}

export const CopyButton = ({ content }: Props) => {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!isCopied) return

    const timeout = setTimeout(() => {
      setIsCopied(false)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [isCopied])

  return (
    <Button
      variant="link"
      className="w-6 h-6"
      onClick={() => {
        setIsCopied(true)
        navigator.clipboard.writeText(content)
        toast({ title: 'Berhasil disalin!', duration: 1500 })
      }}
    >
      {isCopied ? <CopyCheck /> : <Copy />}
    </Button>
  )
}
