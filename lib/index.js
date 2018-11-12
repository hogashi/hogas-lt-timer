"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// indicator
// propTypes: {
//     id: string.isRequired,
//   }
var TimerIndicator =
/*#__PURE__*/
function () {
  function TimerIndicator(props) {
    _classCallCheck(this, TimerIndicator);

    this.props = props;
    this.indicator = document.getElementById(this.props.id);
  } // zero fill in 2 figures
  // returns: string


  _createClass(TimerIndicator, [{
    key: "_zfill",
    value: function _zfill(num) {
      return "00".concat(num).slice(-2);
    }
  }, {
    key: "updateView",
    value: function updateView(second) {
      var sec = second % 60;
      var min = parseInt((second - sec) / 60);
      this.indicator.innerHTML = "".concat(this._zfill(min), ":").concat(this._zfill(sec));

      if (second > 0) {
        this.indicator.setAttribute('class', null);
      } else {
        this.indicator.setAttribute('class', 'end');
      }
    }
  }]);

  return TimerIndicator;
}(); // button
// propTypes: {
//     id: string.isRequired,
//     onClick: func.isRequired
//   }


var Button =
/*#__PURE__*/
function () {
  function Button(props) {
    _classCallCheck(this, Button);

    this.props = props;
    this.button = document.getElementById(this.props.id);
    this.button.addEventListener('click', this._onClick.bind(this));
  }

  _createClass(Button, [{
    key: "_onClick",
    value: function _onClick(e) {
      this.button.blur();
      this.props.onClick(e);
    }
  }]);

  return Button;
}(); // input
// propTypes: {
//     id: string.isRequired,
//     onTimeSubmit: func.isRequired
//   }


var TimerInput =
/*#__PURE__*/
function () {
  function TimerInput(props) {
    _classCallCheck(this, TimerInput);

    this.props = props;
    this.input = document.getElementById(this.props.id);
    this.input.focus();
  } // test for is 1 ~ 99
  // returns: boolean


  _createClass(TimerInput, [{
    key: "_isValidMinute",
    value: function _isValidMinute(min) {
      if (Math.round(min) === min // is integer
      && min >= 1 && min <= 99) {
        return true;
      }

      return false;
    }
  }, {
    key: "onSubmit",
    value: function onSubmit() {
      var minute = parseInt(this.input.value);

      var isValid = this._isValidMinute(minute);

      if (isValid) {
        this.input.setAttribute('class', 'valid');
        this.input.blur(); // pass second

        this.props.onTimeSubmit(minute * 60);
      } else {
        this.input.setAttribute('class', 'invalid');
        this.input.focus();
      }
    }
  }]);

  return TimerInput;
}(); // root controller


var TimerController =
/*#__PURE__*/
function () {
  function TimerController() {
    _classCallCheck(this, TimerController);

    this.state = {
      isRunning: false,
      startSecond: 0,
      nowSecond: 0,
      timerId: null // main container

    };
    this.main = document.getElementById('main'); // timer indicator

    this.timerIndicator = new TimerIndicator({
      id: 'indicator'
    }); // time input

    this.timerInput = new TimerInput({
      id: 'input',
      onTimeSubmit: this._resetTimer.bind(this)
    }); // buttons

    this.resetButton = new Button({
      id: 'resetButton',
      onClick: this._onPressResetButton.bind(this)
    });
    this.startStopButton = new Button({
      id: 'startStopButton',
      onClick: this._switchTimer.bind(this)
    });
    document.addEventListener('keydown', this._onKeydown.bind(this));
  } // args: KeyboardEvent


  _createClass(TimerController, [{
    key: "_onKeydown",
    value: function _onKeydown(e) {
      var _this = this;

      // no timer operations if inputting
      if (document.activeElement === input) {
        if (e.key === 'Enter') {
          this.timerInput.onSubmit();
        }

        return;
      }

      var keydownOperations = {
        ' ': function _() {
          _this._switchTimer();
        },
        's': function s() {
          _this._switchTimer();
        },
        'Escape': function Escape() {
          _this._resetTimer(_this.state.startSecond);
        },
        'r': function r() {
          _this._resetTimer(_this.state.startSecond);
        },
        'ArrowRight': function ArrowRight() {
          _this._modifySecond(-10);
        },
        'ArrowLeft': function ArrowLeft() {
          _this._modifySecond(10);
        },
        'ArrowDown': function ArrowDown() {
          _this._modifySecond(-1);
        },
        'ArrowUp': function ArrowUp() {
          _this._modifySecond(1);
        }
      };
      var key = Object.keys(keydownOperations).filter(function (k) {
        return k === e.key;
      })[0];

      if (key) {
        keydownOperations[key]();
      }
    }
  }, {
    key: "_onPressResetButton",
    value: function _onPressResetButton() {
      this.timerInput.onSubmit();
    } // update the timer view with the state

  }, {
    key: "_updateView",
    value: function _updateView() {
      var _this$state = this.state,
          isRunning = _this$state.isRunning,
          nowSecond = _this$state.nowSecond,
          startSecond = _this$state.startSecond;
      this.timerIndicator.updateView(nowSecond);

      if (isRunning) {
        if (nowSecond < startSecond * 0.2) {
          this.main.setAttribute('class', 'hurry');
        } else {
          this.main.setAttribute('class', 'isRunning');
        }
      } else {
        this.main.setAttribute('class', 'notRunning');
      }
    } // modify the second of the state
    // args: integer

  }, {
    key: "_modifySecond",
    value: function _modifySecond(diff) {
      var nextSecond = this.state.nowSecond + diff; // time is allowed to be between 00:00-99:59

      if (0 <= nextSecond && nextSecond <= 99 * 60 + 59) {
        this.state.nowSecond = nextSecond;

        this._updateView();
      }
    } // (re)set the timer to startSecond

  }, {
    key: "_resetTimer",
    value: function _resetTimer(second) {
      this._stopTimer();

      this.state.startSecond = second;
      this.state.nowSecond = this.state.startSecond;

      this._updateView();
    }
  }, {
    key: "_startTimer",
    value: function _startTimer() {
      var _this2 = this;

      if (this.state.nowSecond > 0) {
        this.state.isRunning = true;
        this.state.timerId = setInterval(function () {
          _this2.state.nowSecond -= 1;

          if (_this2.state.nowSecond <= 0) {
            // stop timer
            _this2.state.nowSecond = 0;

            _this2._stopTimer();
          }

          _this2._updateView();
        }, 1000);
      } // update view even not started


      this._updateView();
    }
  }, {
    key: "_stopTimer",
    value: function _stopTimer() {
      clearInterval(this.state.timerId);
      this.state.isRunning = false;

      this._updateView();
    } // if on  -> then off
    // if off -> then on

  }, {
    key: "_switchTimer",
    value: function _switchTimer() {
      if (this.state.isRunning) {
        this._stopTimer();

        return;
      }

      this._startTimer();
    }
  }]);

  return TimerController;
}();

var lttimer = new TimerController();