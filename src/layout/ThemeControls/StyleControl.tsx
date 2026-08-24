import { Button } from '../../components/Button/Button'
import { getStyleIndex, styles } from '../../theme/styles'

export interface StyleControlProps {
  styleIndex: number
  onChange: (styleIndex: number) => void
}

export function StyleControl({ styleIndex, onChange }: StyleControlProps) {
  const count = styles.length
  const currentIndex = getStyleIndex(styleIndex)
  const style = styles[currentIndex]

  return (
    <div className="style-control">
      <div className="style-control__nav">
        <Button
          variant="ghost"
          className="style-control__arrow"
          aria-label="Previous style"
          onClick={() => onChange((currentIndex - 1 + count) % count)}
        >
          ‹
        </Button>
        <span className="style-control__position">
          Style {currentIndex + 1} of {count}
        </span>
        <Button
          variant="ghost"
          className="style-control__arrow"
          aria-label="Next style"
          onClick={() => onChange((currentIndex + 1) % count)}
        >
          ›
        </Button>
      </div>
      <p className="style-control__name">{style.name}</p>
    </div>
  )
}
