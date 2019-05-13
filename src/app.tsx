import React from 'react'
// import styled from '@emotion/styled'
import {Global, css} from '@emotion/core/dist/core.cjs.js'
import styled from '@emotion/styled/dist/styled.cjs.js'
import {
  DEFAULT_HP,
  MAX_ROW,
  MAX_COLUMN,
  MIN_BOMB_SIZE,
  COLOR_BG,
  COLOR_SAFE,
  COLOR_WORRY,
  COLOR_DANGER,
} from './constants'
import {Bomb} from './bomb'
import {BombType} from './types'
import {generateKey, generatePosition} from './utils'
import Slider from '@material-ui/lab/Slider';

const Wrapper = styled.div`
  position: relative;
  margin: 20px auto 40px;
  width: ${MIN_BOMB_SIZE * MAX_COLUMN}px;
  min-width: ${MIN_BOMB_SIZE * MAX_COLUMN}px;
  height: ${MIN_BOMB_SIZE * MAX_ROW}px;
  min-height: ${MIN_BOMB_SIZE * MAX_ROW}px;
  box-sizing: content-box;
  border-top: 1px solid ${COLOR_SAFE};
  border-bottom: 1px solid ${COLOR_DANGER};
  
  .score {
    position: absolute;
    top: -20px;
    right: 5px;
    transition: color ${(props: any) => props.time/1000}s linear;
  }

  .duang {
    position: absolute;
    font-size: 18px;
    width: ${MIN_BOMB_SIZE}px;
    height: ${MIN_BOMB_SIZE}px;
    color: ${COLOR_BG};
    text-align: center;
    vertical-align: baseline;
    transition: top ${(props: any) => props.time/1000}s linear;
  }
`
const SetTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;

  .slider-wrapper {
    width: 300px;
    margin: 0 10px;
  }
`

interface BombWithKey extends BombType {
  key: string
}

interface DropperState {
  hp: number // number of health-point left
  bombs: BombWithKey[]
  time: number
}

const DEFAULT_STATE: DropperState = {hp: 100, bombs: [], time: 1000}

export class App extends React.Component<{}, DropperState> {
  private timer: number
  private counter: number
  private dropping: boolean

  constructor(props: {}) {
    super(props)

    this.state = {...DEFAULT_STATE}

    this.counter = 0
    this.dropping = false
  }

  changeTime = (e, value) => {
    const time = Number(value)
    if (time) {
      this.setState({ time }, () => {
        this.pause()
        this.startOrResume()
      })
    }
  }
  render() {
    const {hp, bombs, time} = this.state
    const color = App.getColor(DEFAULT_HP - hp, DEFAULT_HP)

    return (
      <>
        <SetTimeWrapper className='set-time'>
          <span className='label'>当前速度：{(this.state.time/1000).toFixed(1)}秒</span>
          <i>快</i>
          <div className='slider-wrapper'>
            <Slider value={this.state.time || 100} max={1000} min={100} onChange={this.changeTime}/>
          </div>
          <i>慢</i>
        </SetTimeWrapper>
        <Wrapper time={time}>
          <Global styles={css`
          html, body {
            background: ${COLOR_BG};
          }
        `} />
          <div className='score' style={{color}}>{hp}</div>
          {bombs.map(bombWithKey => (
            <Bomb
              key={bombWithKey.key}
              text={bombWithKey.text}
              x={bombWithKey.x}
              y={bombWithKey.y}
              color={App.getColor(bombWithKey.y)}
            />
          ))}
        </Wrapper>
      </>
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
      let newBombs = App.checkHits(bombs)
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
    const {hp, time} = this.state

    const startDropping = () => {
      this.timer = setInterval(() => this.drop(), time)
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

export default App
