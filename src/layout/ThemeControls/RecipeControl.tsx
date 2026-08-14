import { Button } from '../../components/Button/Button'
import { getThemeRecipeIndex, themeRecipes } from '../../theme/recipes'

export interface RecipeControlProps {
  themeIndex: number
  onChange: (themeIndex: number) => void
}

export function RecipeControl({ themeIndex, onChange }: RecipeControlProps) {
  const count = themeRecipes.length
  const currentIndex = getThemeRecipeIndex(themeIndex)
  const recipe = themeRecipes[currentIndex]

  return (
    <div className="recipe-control">
      <div className="recipe-control__nav">
        <Button
          variant="ghost"
          className="recipe-control__arrow"
          aria-label="Previous theme"
          onClick={() => onChange((currentIndex - 1 + count) % count)}
        >
          ‹
        </Button>
        <span className="recipe-control__position">
          Theme {currentIndex + 1} of {count}
        </span>
        <Button
          variant="ghost"
          className="recipe-control__arrow"
          aria-label="Next theme"
          onClick={() => onChange((currentIndex + 1) % count)}
        >
          ›
        </Button>
      </div>
      <p className="recipe-control__name">{recipe.name}</p>
    </div>
  )
}
