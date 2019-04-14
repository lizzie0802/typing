import React from 'react'
import {BombType} from './types'
import {COLOR_SAFE, COLOR_WORRY, COLOR_DANGER, MAX_ROW, MIN_BOMB_SIZE} from './constants'


interface SBTS extends BombType {
  key: string
  color: string
}

export class Bomb extends React.Component<SBTS, {}> {
  render() {
    const {text, x, y, color} = this.props

    return (
      <div
        className='duang'
        style={{
          left: x * MIN_BOMB_SIZE,
          top: y * MIN_BOMB_SIZE,
          background: color,
        }}
      >
        {text.toUpperCase()}
      </div>
    )
  }
}

export default Bomb
