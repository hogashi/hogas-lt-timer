// indicator
// propTypes: {
//     id: string.isRequired,
//   }
class TimerIndicator {
  constructor(props) {
    this.props = props

    this.indicator = document.getElementById(this.props.id)
  }

  // zero fill in 2 figures
  // returns: string
  _zfill(num) {
    return `00${num}`.slice(-2)
  }

  updateView(second) {
    const sec = second % 60
    const min = parseInt((second - sec) / 60)
    this.indicator.innerHTML = `${this._zfill(min)}:${this._zfill(sec)}`

    if (second > 0) {
      this.indicator.setAttribute('class', null)
    }
    else {
      this.indicator.setAttribute('class', 'end')
    }
  }
}

// button
// propTypes: {
//     id: string.isRequired,
//     onClick: func.isRequired
//   }
class Button {
  constructor(props) {
    this.props = props

    this.button = document.getElementById(this.props.id)
    this.button.addEventListener('click', this._onClick.bind(this))
  }

  _onClick(e) {
    this.button.blur()
    this.props.onClick(e)
  }
}

// input
// propTypes: {
//     id: string.isRequired,
//     onTimeSubmit: func.isRequired
//   }
class TimerInput {
  constructor(props) {
    this.props = props

    this.input = document.getElementById(this.props.id)
    this.input.focus()
  }

  // test for is 1 ~ 99
  // returns: boolean
  _isValidMinute(min) {
    if (Math.round(min) === min  // is integer
        && min >= 1
        && min <= 99) {
      return true
    }
    return false
  }

  onSubmit() {
    const minute = parseInt(this.input.value)
    const isValid = this._isValidMinute(minute)
    if (isValid) {
      this.input.setAttribute('class', 'valid')
      this.input.blur()

      // pass second
      this.props.onTimeSubmit(minute * 60)
    }
    else {
      this.input.setAttribute('class', 'invalid')
      this.input.focus()
    }
  }
}

// root controller
class TimerController {
  constructor() {
    this.state = {
      isRunning: false,
      startSecond: 0,
      nowSecond: 0,
      timerId: null
    }

    // main container
    this.main = document.getElementById('main')

    // timer indicator
    this.timerIndicator =
      new TimerIndicator({
        id: 'indicator',
      })

    // time input
    this.timerInput =
      new TimerInput({
        id: 'input',
        onTimeSubmit: this._resetTimer.bind(this)
      })

    // buttons
    this.resetButton =
      new Button({
        id: 'resetButton',
        onClick: this._onPressResetButton.bind(this)
      })

    this.startStopButton =
      new Button({
        id: 'startStopButton',
        onClick: this._switchTimer.bind(this)
      })

    document.addEventListener('keydown', this._onKeydown.bind(this))
  }

  // args: KeyboardEvent
  _onKeydown(e) {
    // no timer operations if inputting
    if (document.activeElement === input) {
      if (e.key === 'Enter') {
        this.timerInput.onSubmit()
      }
      return
    }

    const keydownOperations = {
      ' ':          () => { this._switchTimer() },
      's':          () => { this._switchTimer() },
      'Escape':     () => { this._resetTimer(this.state.startSecond) },
      'r':          () => { this._resetTimer(this.state.startSecond) },
      'ArrowRight': () => { this._modifySecond(-10) },
      'ArrowLeft':  () => { this._modifySecond(10) },
      'ArrowDown':  () => { this._modifySecond(-1) },
      'ArrowUp':    () => { this._modifySecond(1) },
    }

    const key = Object.keys(keydownOperations)
      .filter(k => {
        return k === e.key
      })[0]

    if (key) {
      keydownOperations[key]()
    }
  }

  _onPressResetButton() {
    this.timerInput.onSubmit()
  }

  // update the timer view with the state
  _updateView() {
    const { isRunning, nowSecond, startSecond } = this.state

    this.timerIndicator.updateView(nowSecond)
    if (isRunning) {
      if (nowSecond < startSecond * 0.2) {
        this.main.setAttribute('class', 'hurry')
      }
      else {
        this.main.setAttribute('class', 'isRunning')
      }
    }
    else {
      this.main.setAttribute('class', 'notRunning')
    }
  }

  // modify the second of the state
  // args: integer
  _modifySecond(diff) {
    const nextSecond = this.state.nowSecond + diff
    // time is allowed to be between 00:00-99:59
    if (0 <= nextSecond && nextSecond <= 99 * 60 + 59) {
      this.state.nowSecond = nextSecond
      this._updateView()
    }
  }

  // (re)set the timer to startSecond
  _resetTimer(second) {
    this._stopTimer()

    this.state.startSecond = second
    this.state.nowSecond = this.state.startSecond
    this._updateView()
  }

  _startTimer() {
    if (this.state.nowSecond > 0) {
      this.state.isRunning = true

      this.state.timerId = setInterval(() => {
        this.state.nowSecond -= 1

        if (this.state.nowSecond <= 0) {
          // stop timer
          this.state.nowSecond = 0
          this._stopTimer()
        }

        this._updateView()
      }, 1000)
    }

    // update view even not started
    this._updateView()
  }

  _stopTimer() {
    clearInterval(this.state.timerId)
    this.state.isRunning = false
    this._updateView()
  }

  // if on  -> then off
  // if off -> then on
  _switchTimer() {
    if (this.state.isRunning) {
      this._stopTimer()
      return
    }
    this._startTimer()
  }
}

const lttimer = new TimerController()

