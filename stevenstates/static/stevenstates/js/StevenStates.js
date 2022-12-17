const StevenStates = {};
StevenStates.canvas = document.getElementById('steven-states')
StevenStates.context = StevenStates.canvas.getContext('2d');
StevenStates.selectedColor = undefined;
StevenStates.answerArray = [];
StevenStates.arrayIndex = 0;
StevenStates.startPushed = false;
StevenStates.startGame = function () {
    StevenStates.selectedColor = undefined;
    StevenStates.answerArray = [];
    StevenStates.arrayIndex = 0;
    StevenStates.beginStatements();
}
StevenStates.beginStatements = function () {
    StevenStates.arrayIndex = 0;
    StevenStates.addEntry();
    StevenStates.playArray();
}
StevenStates.beginGameplay = function () {
    StevenStates.arrayIndex = 0;
    Controls.addListeners();
}
StevenStates.mainMenu = function () {
    Controls.addMenuListeners();
}
StevenStates.addEntry = function () {
    StevenStates.answerArray.push(Graphics.colorArray[Math.floor(Math.random() * 4)]);
}
StevenStates.playArray = function () {
    Controls.addDeadListeners();
    StevenStates.setColor(StevenStates.answerArray[StevenStates.arrayIndex], true);
    if(StevenStates.arrayIndex >= StevenStates.answerArray.length) {
        setTimeout(StevenStates.beginGameplay, 500);
    } else {
        setTimeout(StevenStates.playArray, 500);
    }
}
StevenStates.setColor = function (color, dontPlay) {
    clearTimeout(Controls.timeout);
    StevenStates.selectedColor = color;
    let correct = StevenStates.answerArray[StevenStates.arrayIndex] === color
    StevenStates.arrayIndex++;
    if(correct) {
        Controls.timeout = setTimeout(function () { StevenStates.selectedColor = undefined; Controls.timeout = undefined; }, 372);
        if(!dontPlay && StevenStates.arrayIndex >= StevenStates.answerArray.length) {
            Controls.timeout = setTimeout(StevenStates.beginStatements, 1500);
            Graphics.setScore(StevenStates.answerArray.length);
            Controls.addDeadListeners();
        }
    } else {
        Controls.addDeadListeners();
        Controls.timeout = setTimeout(function () { StevenStates.selectedColor = undefined; Controls.timeout = undefined; StevenStates.mainMenu(); }, 1500);
    }
    // try and play the sound, if you're debugging locally without --disable-web-security none of the sounds will work because of cross site scripting restrictions
    try {
        if (!correct) {
            Audio.lose();
        } else if(color == Graphics.colors.red) {
            Audio.red();
        } else if(color == Graphics.colors.green) {
            Audio.green();
        } else if(color == Graphics.colors.blue) {
            Audio.blue();
        } else if(color == Graphics.colors.yellow) {
            Audio.yellow();
        }
    } catch (error) {
        
    }
}