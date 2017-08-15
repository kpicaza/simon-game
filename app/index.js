$(document).ready(function () {
  Simon.init();
});

var AudioContext = window.AudioContext || window.webkitAudioContext;
var Simon = Simon === undefined ? {} : Simon;
var Controls = Controls === undefined ? {} : Controls;
var Game = Game === undefined ? {} : Game;
var ToneMaker = ToneMaker === undefined ? {} : ToneMaker;

Simon = {
  controls: null,
  game: null,
  interval: null,
  fail: false,
  end: false,
  stillStarting: false,
  computerMoves: [],
  playerMoves: [],
  currentMoves: [],
  board: $("#board"),
  countBox: $("#count-box"),
  startBox: $("#start-box"),
  strictBox: $("#strict-box"),
  strictLightIcon: $("#strict-text").find("i"),
  sides: $(".side"),
  greenSide: $("#green-side"),
  redSide: $("#red-side"),
  yellowSide: $("#yellow-side"),
  blueSide: $("#blue-side"),
  powerOn: $("#power-button"),
  powerOff: $("#power-off-button"),

  init: function () {
    Simon.controls = new Controls();
    Simon.game = new Game();
    Simon.fixBoard();
    Simon.bindControls();
  },

  fixBoard: function () {
    var width = Simon.board.width();
    Simon.board.css({"min-height": width + "px"});
    var buttonWidth = Simon.startBox.width();
    Simon.startBox.css({"min-height": buttonWidth + "px", "height": buttonWidth + "px"});
    Simon.strictBox.css({"min-height": buttonWidth + "px", "height": buttonWidth + "px"});
  },

  bindControls: function () {
    $(".power-button").bind("click", Simon.togglePower);
    Simon.countBox.bind("power::toggled", Simon.startCounter);
    Simon.board.bind("game::swichedOn", Simon.bindGameControls);
    Simon.board.bind("game::swichedOff", Simon.unbindAll);
    Simon.board.bind("game::started", Simon.startGame);
  },

  bindGameControls: function () {
    Simon.strictBox.bind("click", Simon.toggleStrict);
    Simon.strictBox.bind("strict::toggled", Simon.strictLight);
    Simon.startBox.bind("click", Simon.toggleStart);
    Simon.startBox.bind("start::toggled", Simon.startLight);
  },

  bindBoardControls: function() {
    Simon.sides.bind({
      mousedown: Simon.sidePulsed,
      mouseup: Simon.sideUnPulsed
    });
  },

  unbindBoardControls: function () {
    Simon.sides.unbind();
  },

  resetSides: function() {
    Simon.greenSide.removeClass("bg-green");
    Simon.redSide.removeClass("bg-red");
    Simon.yellowSide.removeClass("bg-yellow");
    Simon.blueSide.removeClass("bg-blue");
  },

  resetTurn: function () {
    if (Simon.playerMoves.length > (Simon.computerMoves.length - 1)) {
      Simon.playerMoves.pop();
    }

    Simon.currentMoves = [];
    console.log('Player moves after fail', Simon.playerMoves);

    setTimeout(function () {
      Simon.move();
    }, 1000);
  },

  resetGame: function () {
    console.log('Reset Game');
    Simon.end = false;
    Simon.fail = false;
    Simon.computerMoves = [];
    Simon.playerMoves = [];
    Simon.currentMoves = [];
    Simon.countBox.text('--');

    setTimeout(function () {
      Simon.move();
    }, 1000);
  },

  startGame: function (e) {
    e.preventDefault();
    if (true === Simon.stillStarting) {
      return;
    }

    Simon.stillStarting = true;

    Simon.unbindBoardControls();

    console.log('Start Game');

    clearInterval(Simon.interval);
    Simon.resetSides();
    Simon.game.pauseTones();

    Simon.end = false;
    Simon.fail = false;
    Simon.computerMoves = [];
    Simon.playerMoves = [];
    Simon.currentMoves = [];
    Simon.countBox.text('--');
    console.log('Player moves after Start', Simon.playerMoves);

    setTimeout(function () {
      Simon.computerMove();
      Simon.stillStarting = false;
    }, 1000);
  },

  togglePower: function (e) {
    e.preventDefault();

    Simon.controls.togglePower();
    Simon.countBox.trigger("power::toggled");
  },

  startCounter: function (e) {
    if (false === Simon.controls.hasPowerOn()) {
      Simon.powerOn.show();
      Simon.powerOff.hide();
      Simon.countBox.html("");
      clearInterval(Simon.interval);
      Simon.unbindBoardControls();
      Simon.resetSides();
      Simon.game.pauseTones();

      Simon.powerOff.trigger("game::swichedOff");
      return;
    }

    Simon.powerOn.hide();
    Simon.powerOff.show();
    Simon.countBox.html("--");
    Simon.powerOn.trigger("game::swichedOn");
  },

  toggleStrict: function (e) {
    e.preventDefault();

    Simon.controls.toggleStrict();
    Simon.strictBox.trigger("strict::toggled");
  },

  strictLight: function (e) {
    Simon.changeColor("strictLightIcon", "text-red");
  },

  toggleStart: function (e) {
    e.preventDefault();

    Simon.startBox.trigger("start::toggled");
    Simon.startBox.trigger("game::started");
  },

  startLight: function (e) {
    if (true === Simon.controls.isStarted()) {
      return;
    }

    Simon.controls.start();
    Simon.changeColor("startBox", "bg-red");
  },

  changeColor: function (div, className) {
    if (true === Simon[div].hasClass(className)) {
      Simon[div].removeClass(className);
      return;
    }
    Simon[div].addClass(className);
  },

  computerMove: function () {
    Simon.computerMoves.push(Math.floor(Math.random() * 4 + 1 - 1));
    Simon.move();
  },

  move: function () {
    if (true === Simon.end) {
      return;
    }

    Simon.fail = false;
    var i = 0;

    Simon.interval = setInterval(function () {
      Simon.resetSides();
      Simon.game.pauseTones();
      Simon.countBox.text(Simon.computerMoves.length);

      setTimeout(function () {

        console.log('Computer', Simon.computerMoves);

        var color = Simon.game.getColor(Simon.computerMoves[i]);

        Simon.changeColor(color + "Side", "bg-" + color);
        Simon.game.playTone(Simon.computerMoves[i]);

        if ((i + 1) === Simon.computerMoves.length) {
          clearInterval(Simon.interval);
          setTimeout(function () {
            Simon.unbindBoardControls();
            Simon.bindBoardControls();
            Simon.resetSides();
            Simon.game.pauseTones();
          }, 1000);
        }

        i++
      }, 500);

    }, 1000);
  },

  sidePulsed: function (e) {
    e.preventDefault();

    Simon.resetSides();
    Simon.game.pauseTones();

    var i = $(this).data('value');

    Simon.currentMoves.push(i);
    if (Simon.currentMoves.length === Simon.computerMoves.length) {
      Simon.playerMoves.push(i);
    }

    console.log('Current', Simon.currentMoves);
    console.log('Player', Simon.playerMoves);
    var color = Simon.game.getColor(i);

    Simon.changeColor(color + "Side", "bg-" + color);
    Simon.game.playTone(i);

  },

  sideUnPulsed: function (e) {
    e.preventDefault();

    Simon.checkForFail();
    Simon.resetSides();
    Simon.game.pauseTones();

    if (Simon.playerMoves.length === Simon.computerMoves.length) {
      Simon.currentMoves = [];
      Simon.unbindBoardControls();
      if (false === Simon.fail) {
        Simon.computerMove();
      }
    }
  },

  checkForFail: function () {
    var i = Simon.currentMoves.length - 1;

    if (Simon.computerMoves[i] !== Simon.currentMoves[i]) {
      Simon.playerFails();
      return;
    }

    if (Simon.playerMoves.length === Simon.game.totalSteps) {
      Simon.gameEnd();
    }
  },

  playerFails: function () {
    Simon.unbindBoardControls();
    Simon.game.pauseTones();
    Simon.fail = true;
    Simon.game.playError();
    setTimeout(function () {
      console.log('Player fails.');
      Simon.game.pauseError();

      console.log('Strict: ', Simon.controls.hasStrictOn());

      if (true === Simon.controls.hasStrictOn()) {
        Simon.resetGame();

        return;
      }

      Simon.resetTurn()
    }, 1000);
  },

  gameEnd: function () {
    console.log('Game end.');
    Simon.end = true;
    Simon.countBox.text('WIN');
    setTimeout(function () {
      Simon.startGame(new Event('Start'));
    }, 3000);
  }
};
