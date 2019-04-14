import React from 'react'
// import styled from '@emotion/styled'
import {Global, css} from '@emotion/core/dist/core.cjs.js'
import styled from '@emotion/styled/dist/styled.cjs.js'
import {
  DEFAULT_HP,
  DEFAULT_DROP_INTERVAL,
  MAX_ROW,
  MAX_COLUMN,
  MIN_BOMB_SIZE,
  COLOR_BG,
  COLOR_DANGER,
} from './constants'
import {Bomb} from './bomb'
import {BombType} from './types'
import {generateKey, generatePosition} from './utils'


const Wrapper = styled.div`
  position: relative;
  margin: 40px auto;
  width: ${MIN_BOMB_SIZE * MAX_COLUMN}px;
  min-width: ${MIN_BOMB_SIZE * MAX_COLUMN}px;
  height: ${MIN_BOMB_SIZE * MAX_ROW}px;
  min-height: ${MIN_BOMB_SIZE * MAX_ROW}px;
  border-bottom: 1px solid ${COLOR_DANGER};
  
  .score {
    position: fixed;
    top: 5px;
    left: 5px;
  }

  .duang {
    position: absolute;
    font-size: 18px;
    width: ${MIN_BOMB_SIZE}px;
    height: ${MIN_BOMB_SIZE}px;
    color: ${COLOR_BG};
    text-align: center;
    vertical-align: baseline;
    transition: top ${DEFAULT_DROP_INTERVAL/1000}s linear;
  }
`

interface BombWithKey extends BombType {
  key: string
}

interface DropperState {
  hp: number // number of health-point left
  bombs: BombWithKey[]
}

const DEFAULT_STATE: DropperState = {hp: 100, bombs: []}

export class Dropper extends React.Component<{}, DropperState> {
  private timer: number
  private counter: number
  private dropping: boolean

  constructor(props: {}) {
    super(props)

    this.state = {...DEFAULT_STATE}

    this.counter = 0
    this.dropping = false
  }

  render() {
    const {hp, bombs} = this.state

    return (
      <Wrapper>
        <Global styles={css`
          html, body {
            background: ${COLOR_BG};
          }
        `} />
        <div className='score'>{hp}</div>
        {bombs.map(bombWithKey => (
          <Bomb
            key={bombWithKey.key}
            text={bombWithKey.text}
            x={bombWithKey.x}
            y={bombWithKey.y}
          />
        ))}
      </Wrapper>
    )
  }

  componentDidMount() {
    this.startOrResume()
    document.addEventListener('keydown', this.inputHandler)
  }

  private drop() {
    const {hp, bombs} = this.state
    if (hp <= 0) {
      clearInterval(this.timer)
      this.dropping = false
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
      this.dropping = false
    }
  }

  private inputHandler = (e: KeyboardEvent) => {
    const {bombs} = this.state
    const {key} = e
    if (key === ' ') { // space
      if (this.dropping) {
        this.pause()
      } else {
        this.startOrResume()
      }
    } else if(this.dropping) {
      let index = -1
      for (let i = 0; i < bombs.length; i++) {
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
  }

  private pause() {
    clearInterval(this.timer)
    this.dropping = false
  }

  private startOrResume() {
    const {hp, bombs} = this.state

    const startDropping = () => {
      this.timer = setInterval(() => this.drop(), DEFAULT_DROP_INTERVAL)
      this.dropping = true
    }

    if (hp <= 0) {
      this.setState({...DEFAULT_STATE}, startDropping)
    } else {
      startDropping()
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
