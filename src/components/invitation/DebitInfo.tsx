import { CopyButton } from '../common/CopyButton'

interface Props {
  name: string
  number: string
  bank: string
  className?: string
}

export const DebitInfo = ({ name, number, bank, className }: Props) => (
  <div className={className}>
    <div className="flex flex-wrap">
      <p className="font-bold">{number}</p>
      <CopyButton content={number} />
    </div>
    <p className="text-muted-foreground">
      {bank} a.n. {name}
    </p>
  </div>
)
