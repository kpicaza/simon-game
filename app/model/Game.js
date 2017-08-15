
Game = function () {
  var toneMaker;
  var autoToneMaker;
  var colours = ["green", "red", "yellow", "blue"];
  var tones = [391.995, 329.628, 261.626, 195.998];
  var autoTones = [310.252];

  var constructor = function () {
    toneMaker = new ToneMaker(tones);
    autoToneMaker = new ToneMaker(autoTones);
  };
  constructor();

  this.totalSteps = 2;

  this.getColor = function (i) {
    return colours[i];
  };

  this.playError = function () {
    return autoToneMaker.play(0);
  };

  this.pauseError = function () {
    autoTones.map(function (tone, i) {
      autoToneMaker.pause(i);
    });
  };

  this.playTone = function (i) {
    return toneMaker.play(i);
  };

  this.pauseTones = function () {
    tones.map(function (tone, i) {
      toneMaker.pause(i);
    });
  };

};
