import {MAX_COLUMN, KEY_MAP} from './constants'


export const generateKey = () => {
  const keys = Object.keys(KEY_MAP)
  const targetIndex = generateInteger(0, keys.length)
  const key = keys[targetIndex]

  return KEY_MAP[key]
}

export const generatePosition = () => generateInteger(0, MAX_COLUMN)

export const generateInteger = (start: number, end: number) => {
  const length = end - start

  if (length <= 0) {
    return 0
  }

  return Math.floor(Math.random() * length)
}
