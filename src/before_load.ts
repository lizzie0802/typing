import {MAX_ROW, MAX_COLUMN, MIN_BOMB_SIZE} from './constants'


export interface SizeConfig {
  width: number // width of dropper size
  height: number // height of dropper size
}

export const prepareScreen = (): SizeConfig => {
  const {innerWidth, innerHeight} = window as any
  let width = innerWidth
  let height = innerHeight
  if (innerWidth <= MAX_COLUMN * MIN_BOMB_SIZE) {
    width = MAX_COLUMN * MIN_BOMB_SIZE
  }

  if (innerHeight <= MAX_ROW * MIN_BOMB_SIZE) {
    height = MAX_ROW * MIN_BOMB_SIZE
  }

  return {width, height}
}