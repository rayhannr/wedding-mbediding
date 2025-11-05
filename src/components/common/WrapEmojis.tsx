import { Fragment } from 'react'

interface Props {
  text: string
}

export const WrapEmojis = ({ text }: Props) => {
  const emojiRegex = /(\p{EPres}|\p{ExtPict})(\u200d(\p{EPres}|\p{ExtPict}))*/gu

  const parts = text.split(emojiRegex).filter(Boolean)
  const matches: string[] = text.match(emojiRegex) || []

  return parts.map((part, index) =>
    matches.includes(part) ? (
      <span className="not-italic text-base" key={part + index}>
        {part}
      </span>
    ) : (
      <Fragment key={part + index}>{part}</Fragment>
    )
  )
}
