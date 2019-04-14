import React from 'react'
import {BombType} from './types'
import {COLOR_SAFE, COLOR_WORRY, COLOR_DANGER, MAX_ROW, MIN_BOMB_SIZE} from './constants'


interface SBTS extends BombType {
  key: string
}

export class Bomb extends React.Component<SBTS, {}> {
  render() {
    const {text, x, y} = this.props

    return (
      <div
        className='duang'
        style={{
          left: x * MIN_BOMB_SIZE,
          top: y * MIN_BOMB_SIZE,
          background: Bomb.getColor(y),
        }}
      >
        {text.toUpperCase()}
      </div>
    )
  }

  private static getColor(val: number, max: number = MAX_ROW) {
    let portion = val / max
    if (portion > 0.8) {
      return COLOR_DANGER
    } else if (portion > 0.4) {
      return COLOR_WORRY
    }
    return COLOR_SAFE
  }
}

export default Bomb
