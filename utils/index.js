import categories from './categories.json'

export const colorForCategory = (category) => {
  const found = categories.find((c) => c.value === category)
  return found?.hex
}

export const categoryForCategory = (category) => {
  const found = categories.find((c) => c.value === category)
  return found.label
}
