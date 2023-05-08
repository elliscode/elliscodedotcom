// https://www.waitingforfriday.com/?p=586
// Green – 415 Hz – G#4 (true pitch 415.305 Hz)
// Red – 310 Hz – D#4 (true pitch 311.127 Hz)
// Yellow – 252 Hz ‐ B3 (true pitch 247.942 Hz)
// Blue – 209 Hz – G#3 (true pitch 207.652 Hz)
// In addition, if the player presses he wrong colour or takes too long the game plays a losing tone of 42 Hz for 1.5 seconds.
const Audio = {};
Audio.red = function() {
    createjs.Sound.stop();
    createjs.Sound.play("red");
}
Audio.blue = function () {
    createjs.Sound.stop();
    createjs.Sound.play("blue");
}
Audio.green = function () {
    createjs.Sound.stop();
    createjs.Sound.play("green");
}
Audio.yellow = function () {
    createjs.Sound.stop();
    createjs.Sound.play("yellow");
}
Audio.lose = function () {
    createjs.Sound.stop();
    createjs.Sound.play("lose");
}