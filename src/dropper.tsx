import React from 'react'
// import styled from '@emotion/styled'
import {DEFAULT_HP, DEFAULT_DROP_INTERVAL, MAX_ROW} from './constants'
import {Bomb} from './bomb'
import {BombType} from './types'
import {generateKey, generatePosition} from './utils'


// const Wrapper = styled.div`
//   position: fixed;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
//   background: #89fffa;
//
//   .duang {
//     position: absolute;
//     min-width: 10px;
//     min-height: 10px;
//     width: 10px;
//     height: 10px;
//     background: red;
//   }
// `

interface BombWithKey extends BombType {
  key: string
}

interface DropperState {
  hp: number // number of health-point left
  bombs: BombWithKey[]
}

export class Dropper extends React.Component<{}, DropperState> {
  private timer: number
  private counter: number

  constructor(props: {}) {
    super(props)

    this.state = {
      hp: DEFAULT_HP,
      bombs: [],
    }

    this.counter = 0
  }

  render() {
    const {hp, bombs} = this.state

    return (
      <div className='dropper-f2'>
        <div>{hp}</div>
        {bombs.map(bombWithKey => (
          <Bomb
            key={bombWithKey.key}
            text={bombWithKey.text}
            x={bombWithKey.x}
            y={bombWithKey.y}
          />
        ))}
      </div>
    )
  }

  componentDidMount() {
    this.timer = setInterval(() => this.drop(), DEFAULT_DROP_INTERVAL)
    this.registerStopper()
    document.addEventListener('keydown', this.inputHandler)
  }

  private drop() {
    const {hp, bombs} = this.state
    if (hp <= 0) {
      clearInterval(this.timer)
    } else {
      const newBomb: BombWithKey = {
        text: generateKey(),
        x: generatePosition(),
        y: 0,
        key: this.counter++ + '',
      }
      let newBombs = Dropper.checkHits(bombs)
      const hits = bombs.length - newBombs.length
      newBombs = [...newBombs, newBomb]

      this.setState({bombs: newBombs, hp: hp - hits})
    }
  }

  private registerStopper() {
    (window as any).stop = () => {
      clearInterval(this.timer)
    }
  }

  private inputHandler = (e: KeyboardEvent) => {
    const {bombs} = this.state
    const {key} = e
    let index = -1
    for (let i = 0; i < bombs.length; i++) {
      // console.log('ts sb ma', bombs[i], key, i, index)
      if (bombs[i].text === key) {
        index = i as any
        break
      }
    }
    if (index >= 0) {
      const newBombs = [...bombs]
      newBombs.splice(index, 1)
      this.setState({bombs: newBombs})
    }
  }

  private static checkHits(bombs: BombWithKey[]) {
    // const hits: number[] = []
    const bombsLeft: BombWithKey[] = []
    for (let i in bombs) {
      if (bombs[i].y < MAX_ROW - 1) {
        bombsLeft.push({
          ...bombs[i],
          y: bombs[i].y + 1,
        })
      }
    }

    return bombsLeft
  }
}

export default Dropper
