const GameBoard = {};
GameBoard.canvas = document.getElementById('game-canvas');
GameBoard.WIDTH = 206;
GameBoard.HEIGHT = 406;
GameBoard.canvas.width = 206;
GameBoard.canvas.height = 406;
GameBoard.currentPiece = undefined;
GameBoard.contentHeight = 23;
GameBoard.visualHeight = 20;
GameBoard.currentX = 4;
GameBoard.currentY = 0 + (GameBoard.contentHeight - GameBoard.visualHeight);
GameBoard.paused = false;
GameBoard.areYouDead = false;
GameBoard.mainMenu = false;
GameBoard.content = [];

const Stats = {};
Stats.level = 0;
Stats.rowsCleared = 0;
Stats.singles = 0;
Stats.doubles = 0;
Stats.triples = 0;
Stats.quads = 0;
Stats.levelSpans = ['level-reached'];
Stats.rowsClearedSpans = ['total-lines-cleared'];
Stats.singlesSpans = ['singles-cleared'];
Stats.doublesSpans = ['doubles-cleared'];
Stats.triplesSpans = ['triples-cleared'];
Stats.quadsSpans = ['four-squares-cleared'];
Stats.clearStats = function () {
    Stats.level = 0;
    Stats.rowsCleared = 0;
    Stats.singles = 0;
    Stats.doubles = 0;
    Stats.triples = 0;
    Stats.quads = 0;
    Stats.setSpans();
}
Stats.setSpans = function () {
    for (let classString of Stats.levelSpans) {
        for (let span of document.getElementsByClassName(classString)) {
            span.innerText = Stats.level;
        }
    }
    for (let classString of Stats.rowsClearedSpans) {
        for (let span of document.getElementsByClassName(classString)) {
            span.innerText = Stats.rowsCleared;
        }
    }
    for (let classString of Stats.singlesSpans) {
        for (let span of document.getElementsByClassName(classString)) {
            span.innerText = Stats.singles;
        }
    }
    for (let classString of Stats.doublesSpans) {
        for (let span of document.getElementsByClassName(classString)) {
            span.innerText = Stats.doubles;
        }
    }
    for (let classString of Stats.triplesSpans) {
        for (let span of document.getElementsByClassName(classString)) {
            span.innerText = Stats.triples;
        }
    }
    for (let classString of Stats.quadsSpans) {
        for (let span of document.getElementsByClassName(classString)) {
            span.innerText = Stats.quads;
        }
    }
}

const Windows = {};
Windows.background = document.getElementById('popup-background');
Windows.death = document.getElementById('death-window');
Windows.win = document.getElementById('win-window');
Windows.pause = document.getElementById('pause-window');
Windows.sensitivity = document.getElementById('sensitivity-window');
Windows.menu = document.getElementById('main-menu');
Windows.controls = document.getElementById('controls');

Windows.playButton = document.getElementById('play-button');
Windows.replayButton = document.getElementById('replay-button');
Windows.returnButton = document.getElementById('return-button');
Windows.resumeButton = document.getElementById('resume-button');
Windows.sensitivityButton = document.getElementById('sensitivity-button');
Windows.continueButton = document.getElementById('continue-button');
Windows.returnButton2 = document.getElementById('return-button-2');
Windows.restartButton2 = document.getElementById('restart-button-2');
Windows.sensitivityApplyButton = document.getElementById('sensitivity-apply');
Windows.sensitivityCancelButton = document.getElementById('sensitivity-cancel');
Windows.decreaseHorizontalButton = document.getElementById('horiz-minus');
Windows.increaseHorizontalButton = document.getElementById('horiz-plus');
Windows.decreaseVerticalButton = document.getElementById('vert-minus');
Windows.increaseVerticalButton = document.getElementById('vert-plus');
Windows.horizontalDisplay = document.getElementById('horiz-display');
Windows.verticalDisplay = document.getElementById('vert-display');

Windows.removeListeners = function() {
    Windows.playButton.removeEventListener('touchstart', FourSquares.startGame, {passive: false});
    Windows.replayButton.removeEventListener('touchstart', FourSquares.startGame, {passive: false});
    Windows.returnButton.removeEventListener('touchstart', FourSquares.mainMenu, {passive: false});
    Windows.resumeButton.removeEventListener('touchstart', FourSquares.resumeGame, {passive: false});
    Windows.sensitivityButton.removeEventListener('touchstart', FourSquares.sensitivityWindow, {passive: false});
    Windows.continueButton.removeEventListener('touchstart', FourSquares.resumeGame, {passive: false});
    Windows.returnButton2.removeEventListener('touchstart', FourSquares.mainMenu, {passive: false});
    Windows.restartButton2.removeEventListener('touchstart', FourSquares.startGame, {passive: false});
    Windows.sensitivityApplyButton.removeEventListener('touchstart', FourSquares.applySensitivities, { passive: false });
    Windows.sensitivityCancelButton.removeEventListener('touchstart', Windows.displayPause, { passive: false });
    Windows.decreaseHorizontalButton.removeEventListener('touchstart', FourSquares.decreaseHorizontal, { passive: false });
    Windows.increaseHorizontalButton.removeEventListener('touchstart', FourSquares.increaseHorizontal, { passive: false });
    Windows.decreaseVerticalButton.removeEventListener('touchstart', FourSquares.decreaseVertical, { passive: false });
    Windows.increaseVerticalButton.removeEventListener('touchstart', FourSquares.increaseVertical, { passive: false });
}
Windows.displayPause = function() {
    Windows.displayScreen('pause');
}
Windows.displayScreen = function (windowType) {
    Windows.removeListeners();
    if (windowType === 'death') {
        Windows.replayButton.addEventListener('touchstart', FourSquares.startGame, {passive: false});
        Windows.returnButton.addEventListener('touchstart', FourSquares.mainMenu, {passive: false});
        Windows.hideScreens();
        Windows.death.style.display = 'block';
        Windows.death.style.zIndex = '10';
    } else if (windowType === 'win') {
        Windows.continueButton.addEventListener('touchstart', FourSquares.resumeGame, {passive: false});
        Windows.hideScreens();
        Windows.win.style.display = 'block';
        Windows.win.style.zIndex = '10';
    } else if (windowType == 'controls') {
    
    } else if (windowType == 'main-menu') {
        Windows.playButton.addEventListener('touchstart', FourSquares.startGame, {passive: false});
        Windows.hideScreens();
        Windows.menu.style.display = 'block';
        Windows.menu.style.zIndex = '10';
        MainMenu.canvas.style.display = 'block';
        MainMenu.canvas.style.zIndex = '8';
        MainMenu.canvas.width = window.innerWidth;
        MainMenu.canvas.height = window.innerWidth;
        MainMenu.fadeDiv.style.display = 'block';
        MainMenu.fadeDiv.style.zIndex = '9';
        MainMenu.background.style.display = 'block';
        MainMenu.background.style.zIndex = '7';
    } else if (windowType == 'sensitivity-window') {
        Windows.sensitivityApplyButton.addEventListener('touchstart', FourSquares.applySensitivities, {passive: false});
        Windows.sensitivityCancelButton.addEventListener('touchstart', Windows.displayPause, {passive: false});
        Windows.decreaseHorizontalButton.addEventListener('touchstart', FourSquares.decreaseHorizontal, {passive: false});
        Windows.increaseHorizontalButton.addEventListener('touchstart', FourSquares.increaseHorizontal, {passive: false});
        Windows.decreaseVerticalButton  .addEventListener('touchstart', FourSquares.decreaseVertical,   {passive: false});
        Windows.increaseVerticalButton  .addEventListener('touchstart', FourSquares.increaseVertical,   {passive: false});
        Windows.horizontalDisplay.value = Controls.horizontalDivisions;
        Windows.verticalDisplay.value = Controls.verticalDivisions;
        Windows.hideScreens();
        Windows.sensitivity.style.display = 'block';
        Windows.sensitivity.style.zIndex = '10';
    } else {
        Windows.resumeButton.addEventListener('touchstart', FourSquares.resumeGame, {passive: false});
        Windows.sensitivityButton.addEventListener('touchstart', FourSquares.sensitivityWindow, {passive: false});
        Windows.returnButton2.addEventListener('touchstart', FourSquares.mainMenu, {passive: false});
        Windows.restartButton2.addEventListener('touchstart', FourSquares.startGame, {passive: false});
        Windows.hideScreens();
        Windows.pause.style.display = 'block';
        Windows.pause.style.zIndex = '10';
    }
    Stats.setSpans();
    Controls.removeListeners();
    if (windowType == 'pause') {
        Controls.addPauseListeners();
    }
    Windows.background.style.display = 'block';
    Windows.background.style.zIndex = '6';
    Graphics.onResize();
    setTimeout(Graphics.onResize, 25);
}
Windows.hideScreens = function () {
    Windows.background.style.display = 'none';
    MainMenu.canvas.style.display = 'none';
    MainMenu.fadeDiv.style.display = 'none';
    MainMenu.background.style.display = 'none';
    for (let screen of document.getElementsByClassName('popup-window')) {
        screen.style.display = 'none';
    }
}

const Pieces = {};
Pieces.array = [];
Pieces.array[0] = { type: 'bar', color: 'rgba(38,213,252,1)', squares: [[-1, 0], [0, 0], [1, 0], [2, 0]] }; // long
Pieces.array[1] = { type: 't', color: 'rgba(139,0,181,1)', squares: [[-1, 0], [0, 0], [1, 0], [0, -1]] }; // t
Pieces.array[2] = { type: 's', color: 'rgba(0,181,24,1)', squares: [[-1, 0], [0, 0], [0, -1], [1, -1]] }; // s
Pieces.array[3] = { type: '2', color: 'rgba(181,0,0,1)', squares: [[-1, -1], [0, -1], [0, 0], [1, 0]] }; // 2
Pieces.array[4] = { type: 'j', color: 'rgba(0,19,143,1)', squares: [[-1, 0], [0, 0], [0, -1], [0, -2]] }; // J
Pieces.array[5] = { type: 'l', color: 'rgba(230,146,21,1)', squares: [[1, 0], [0, 0], [0, -1], [0, -2]] }; // L
Pieces.array[6] = { type: 'o', color: 'rgba(230,219,21,1)', squares: [[-1, 0], [0, 0], [-1, -1], [0, -1]] }; // o
Pieces.findCenterPoints = function (piece) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let square of piece.squares) {
        minX = Math.min(minX, square[0]);
        maxX = Math.max(maxX, square[0]);
        minY = Math.min(minY, square[1]);
        maxY = Math.max(maxY, square[1]);
    }
    let width = maxX - minX + 1;
    let height = maxY - minY + 1;
    let output = {};
    output.x = 2.75 - (width / 2) - minX;
    output.y = 2.75 - (height / 2) - minY + (GameBoard.contentHeight - GameBoard.visualHeight);
    return output;
}

const NextThree = {};
NextThree.canvas = document.getElementById('next-three');
NextThree.text = document.getElementById('next-three-text');
NextThree.canvas.width = 120;
NextThree.canvas.height = 360;
NextThree.pieces = [];
NextThree.context = NextThree.canvas.getContext('2d');
NextThree.bag = [];
NextThree.add = function () {
    if (NextThree.bag.length == 0) {
        NextThree.bag.push(...Pieces.array);
    }
    let piece = NextThree.bag.splice(Math.floor(Math.random() * NextThree.bag.length), 1)
    NextThree.pieces.push(piece[0]);
}
NextThree.popAndAdd = function () {
    NextThree.add();
    return NextThree.pieces.shift();
}

const HoldPiece = {};
HoldPiece.canvas = document.getElementById('hold-piece');
HoldPiece.canvas.width = 120;
HoldPiece.canvas.height = 120;
HoldPiece.context = HoldPiece.canvas.getContext('2d');
HoldPiece.text = document.getElementById('hold-piece-text');
HoldPiece.piece = undefined;
HoldPiece.swapHoldPiece = function () {
    if (HoldPiece.movedDownWithoutUsing) {
        return;
    }
    let pieceToHold = GameBoard.currentPiece;
    let nextPiece = undefined;
    if (HoldPiece.piece == undefined) {
        nextPiece = NextThree.popAndAdd();
    } else {
        nextPiece = HoldPiece.piece;
    }
    GameBoard.currentPiece = nextPiece;
    HoldPiece.piece = pieceToHold;
    GameBoard.currentX = 4;
    let maxY = -Infinity;
    for (let block of GameBoard.currentPiece.squares) {
        maxY = Math.max(maxY, block[1]);
    }
    GameBoard.currentY = (GameBoard.contentHeight - GameBoard.visualHeight) - maxY - 1;
    Controls.moveDown();
    FourSquares.timeStamp = new Date();
    HoldPiece.movedDownWithoutUsing = true;
}

const GreyBackground = document.getElementById('grey-background');

const Graphics = {};
Graphics.context = GameBoard.canvas.getContext('2d');
Graphics.addOpacityToColor = function (color, opacity) {
    return color.substring(0, color.lastIndexOf(',')) + ',' + opacity + ')';
}
Graphics.onResize = function () {
    const squareWidth = 100;
    const textHeight = 25;
    var viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0')
    let perhapsWidth = window.innerWidth - 10 - 10;
    let widthRatio = perhapsWidth / GameBoard.WIDTH;
    let widthBasedHeight = GameBoard.HEIGHT * widthRatio;

    let perhapsHeight = window.innerHeight - 10 - 10;
    let heightRatio = perhapsHeight / GameBoard.HEIGHT;
    let heightBasedWidth = GameBoard.WIDTH * heightRatio;

    for (let screen of document.getElementsByClassName('popup-window')) {
        if (screen.style.display == 'none') {
            continue;
        }
        let windowWidth = screen.clientWidth;
        let windowHeight = screen.clientHeight;
        screen.style.left = (window.innerWidth - windowWidth) / 2 + 'px';
        screen.style.top = (window.innerHeight - windowHeight) / 2 + 'px';
    }

    MainMenu.canvas.width = window.innerWidth;
    MainMenu.canvas.height = window.innerHeight;

    if (widthBasedHeight < window.innerHeight) {
        GreyBackground.style.display = 'none';
        let height = Math.min(widthBasedHeight, window.innerHeight - 10 - 10 - squareWidth - textHeight - 10);
        let width = perhapsWidth * (height / widthBasedHeight);
        GameBoard.canvas.style.width = width + 'px';
        GameBoard.canvas.style.height = height + 'px';
        let fullWidth = 10 + width + 10;
        let fullHeight = 10 + height + 10 + textHeight + squareWidth + 10;
        let left = (window.innerWidth - fullWidth) / 2;
        let top = Math.max(0, window.innerHeight - fullHeight) / 2;
        GameBoard.canvas.style.left = left + 10 + 'px';
        GameBoard.canvas.style.top = top + 10 + textHeight + squareWidth + 10 + 'px';
        NextThree.canvas.style.display = 'none';
        NextThree.text.style.display = 'none';
        HoldPiece.text.style.left = left + 10 + 'px';
        HoldPiece.text.style.top = top + 10 + 'px';
        HoldPiece.text.style.width = squareWidth + 'px';
        HoldPiece.text.style.height = textHeight + 'px';
        HoldPiece.canvas.style.width = squareWidth + 'px';
        HoldPiece.canvas.style.height = squareWidth + 'px';
        HoldPiece.canvas.style.left = left + 10 + 'px';
        HoldPiece.canvas.style.top = top + 10 + textHeight + 'px';
        ScoreBoard.div.style.display = 'block';
        ScoreBoard.div.style.width = width - squareWidth - 10 + 'px';
        ScoreBoard.div.style.height = squareWidth + 'px';
        ScoreBoard.div.style.left = left + 10 + squareWidth + 10 + 'px';
        ScoreBoard.div.style.top = top + 10 + textHeight + 'px';
        ScoreBoard.text.style.width = width - squareWidth - 10 + 'px';
        ScoreBoard.text.style.height = textHeight + 'px';
        ScoreBoard.text.style.left = left + 10 + squareWidth + 10 + 'px';
        ScoreBoard.text.style.top = top + 10 + 'px';
    } else {
        HoldPiece.text.style.display = 'block';
        HoldPiece.canvas.style.display = 'block';
        ScoreBoard.text.style.display = 'block';
        ScoreBoard.div.style.display = 'block';
        let width = Math.min(heightBasedWidth, window.innerWidth - 10 - 10 - squareWidth - 10);
        let height = perhapsHeight * (width / heightBasedWidth);
        GameBoard.canvas.style.width = width + 'px';
        GameBoard.canvas.style.height = height + 'px';
        let fullWidth = 10 + width + 10 + squareWidth + 10;
        let fullHeight = 10 + height + 10;
        let left = (window.innerWidth - fullWidth) / 2;
        let top = Math.max(0, window.innerHeight - fullHeight) / 2;
        GameBoard.canvas.style.left = left + 10 + 'px';
        GameBoard.canvas.style.top = top + 10 + 'px';

        HoldPiece.text.style.left = left + 10 + width + 10 + 'px';
        HoldPiece.text.style.top = top + 10 + 'px';
        HoldPiece.text.style.width = squareWidth + 'px';
        HoldPiece.text.style.height = textHeight + 'px';
        HoldPiece.canvas.style.width = squareWidth + 'px';
        HoldPiece.canvas.style.height = squareWidth + 'px';
        HoldPiece.canvas.style.left = left + 10 + width + 10 + 'px';
        HoldPiece.canvas.style.top = top + 10 + textHeight + 'px';

        NextThree.text.style.left = left + 10 + width + 10 + 'px';
        NextThree.text.style.top = top + 10 + textHeight + squareWidth + 10 + 'px';
        NextThree.text.style.width = squareWidth + 'px';
        NextThree.text.style.height = textHeight + 'px';
        NextThree.canvas.style.left = left + 10 + width + 10 + 'px';
        NextThree.canvas.style.top = top + 10 + textHeight + squareWidth + 10 + textHeight + 'px';
        NextThree.canvas.style.width = squareWidth + 'px';
        NextThree.canvas.style.height = 3 * squareWidth + 'px';
        NextThree.canvas.style.display = 'block';
        NextThree.text.style.display = 'block';
        ScoreBoard.div.style.width = squareWidth + 'px';
        ScoreBoard.div.style.height = squareWidth + 'px';
        ScoreBoard.text.style.width = squareWidth + 'px';
        ScoreBoard.text.style.height = textHeight + 'px';
        ScoreBoard.text.style.left = left + 10 + width + 10 + 'px';
        ScoreBoard.text.style.top = top + 10 + textHeight + (3 * squareWidth) + 10 + textHeight + squareWidth + 10 + 'px';
        ScoreBoard.div.style.width = squareWidth + 'px';
        ScoreBoard.div.style.height = squareWidth + 'px';
        ScoreBoard.div.style.left = left + 10 + width + 10 + 'px';
        ScoreBoard.div.style.top = top + 10 + textHeight + (3 * squareWidth) + 10 + textHeight + squareWidth + 10 + textHeight + 'px';
        GreyBackground.style.display = 'none';
        if (top + 10 + textHeight + (3 * squareWidth) + 10 + textHeight + squareWidth + 10 + textHeight + squareWidth > top + 10 + height) {
            GameBoard.canvas.style.top = top + 10 + 'px';

            HoldPiece.text.style.top = top + 10 + 'px';
            HoldPiece.canvas.style.top = top + 10 + textHeight + 'px';

            NextThree.text.style.top = top + 10 + textHeight + squareWidth + 10 + 'px';
            NextThree.canvas.style.top = top + 10 + textHeight + squareWidth + 10 + textHeight + 'px';

            ScoreBoard.text.style.top = top + 10 + height - squareWidth - textHeight + 'px';
            ScoreBoard.div.style.top = top + 10 + height - squareWidth + 'px';

            let topNum = top + 10 + height - squareWidth - textHeight - 10;
            GreyBackground.style.width = squareWidth + 'px';
            GreyBackground.style.height = window.innerHeight - topNum + 'px';
            GreyBackground.style.top = topNum + 'px';
            GreyBackground.style.left = left + 10 + width + 10 + 'px';
            GreyBackground.style.display = 'block';
        }
    }

    window.scrollTo(0, 0);
}
Graphics.drawPiece = function (context, piece, x, y, forceColor) {
    context.fillStyle = "#fff";
    for (let part of piece.squares) {
        context.fillRect(0 + 3 + (20 * (part[0] + x)) - 1, 0 + 3 + (20 * (part[1] + y - (GameBoard.contentHeight - GameBoard.visualHeight))) - 1, 22, 22);
    }
    if (forceColor != undefined) {
        context.fillStyle = forceColor;
    } else {
        context.fillStyle = piece.color;
    }
    for (let part of piece.squares) {
        context.fillRect(0 + 3 + (20 * (part[0] + x)) + 1, 0 + 3 + (20 * (part[1] + y - (GameBoard.contentHeight - GameBoard.visualHeight))) + 1, 18, 18);
    }
}
Graphics.drawBoard = function (board) {
    let y = 0;
    for (let row of board) {
        let x = 0;
        for (let fill of row) {
            if (fill.length == 0) {
                x++;
                continue;
            }
            Graphics.context.fillStyle = "#fff";
            Graphics.context.fillRect(0 + 3 + (20 * x) - 1, 0 + 3 + (20 * (y - (GameBoard.contentHeight - GameBoard.visualHeight))) - 1, 22, 22);
            Graphics.context.fillStyle = fill;
            Graphics.context.fillRect(0 + 3 + (20 * x) + 1, 0 + 3 + (20 * (y - (GameBoard.contentHeight - GameBoard.visualHeight))) + 1, 18, 18);
            x++;
        }
        y++;
    }
}
Graphics.drawGhost = function (piece, x, y) {
    let shouldStay = FourSquares.checkIfItShouldStay(piece, x, y);
    while (!shouldStay && y < GameBoard.content.length) {
        y++;
        shouldStay = FourSquares.checkIfItShouldStay(piece, x, y);
    }
    Graphics.context.fillStyle = "rgba(255,255,255,0.2)";
    for (let part of piece.squares) {
        Graphics.context.fillRect(0 + 3 + (20 * (part[0] + x)) - 1, 0 + 3 + (20 * (part[1] + y - (GameBoard.contentHeight - GameBoard.visualHeight))) - 1, 20, 20);
    }
}

const ScoreBoard = {};
ScoreBoard.text = document.getElementById('score-board-text');
ScoreBoard.div = document.getElementById('score-board');
ScoreBoard.score = document.getElementById('score');
ScoreBoard.flavorText = document.getElementById('flavor-text');

const MainMenu = {};
MainMenu.transparencyInterval = undefined;
MainMenu.canvas = document.getElementById('main-menu-canvas');
MainMenu.background = document.getElementById('main-menu-background');
MainMenu.fadeDiv = document.getElementById('main-menu-fade-div');
MainMenu.context = MainMenu.canvas.getContext('2d');
MainMenu.piecesList = [];
MainMenu.fadeDivFunction = function () {
    let opacity = parseFloat(MainMenu.fadeDiv.style.opacity);
    opacity -= 0.01;
    if (opacity <= 0) {
        MainMenu.fadeDiv.style.opacity = 0;
        clearInterval(MainMenu.transparencyInterval);
    } else {
        MainMenu.fadeDiv.style.opacity = opacity;
    }
}
MainMenu.draw = function () {
    if (!GameBoard.mainMenu) {
        MainMenu.piecesList = [];
        return;
    }
    for (let i = MainMenu.piecesList.length - 1; i >= 0; i--) {
        let piece = MainMenu.piecesList[i];
        if (piece.yOffset > (window.innerHeight / 20) + (4)) {
            MainMenu.piecesList.splice(i, 1);
        }
    }
    while (MainMenu.piecesList.length < 20) {
        let randomPiece = Object.assign({}, Pieces.array[Math.floor(Math.random() * Pieces.array.length)]);
        randomPiece.xOffset = Math.random() * window.innerWidth / 20;
        randomPiece.yOffset = Math.random() * -(window.innerHeight / 20);
        randomPiece.speed = Math.random() * 0.1;
        MainMenu.piecesList.push(randomPiece);
    }
    MainMenu.context.clearRect(0, 0, MainMenu.canvas.width, MainMenu.canvas.height);
    for (let piece of MainMenu.piecesList) {
        Graphics.drawPiece(MainMenu.context, piece, piece.xOffset, piece.yOffset);
        piece.yOffset += piece.speed;
    }
    requestAnimationFrame(MainMenu.draw);
}

const FourSquares = {};
FourSquares.timeStamp = new Date();
FourSquares.frameTime = new Date();
FourSquares.currentInterval = 1000;
FourSquares.levelSpeeds = [1000, 830, 660, 500, 380, 275, 220, 150, 110, 90, 76, 62, 48, 34, 20];
FourSquares.levelRequirements = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
// FourSquares.levelSpeeds = [1000, 830];
// FourSquares.levelRequirements = [5, 10];
FourSquares.pauseGame = function () {
    GameBoard.paused = true;
}
FourSquares.resumeGame = function (e) {
    Windows.hideScreens();
    GameBoard.paused = false;
    FourSquares.frameTime = new Date();
    Controls.addListeners();
    if(undefined != e) {
        e.preventDefault();
    }
    FourSquares.draw();
}
FourSquares.xyOffsetsToCheckForRotation = [[-1, 1], [0, 1], [1, 1] // down 1 left or right
    , [-1, 0], [1, 0] // left or right
    , [-1, -1], [0, -1], [1, -1] // up 1 left or right
    , [-1, -2], [0, -2], [1, -2]]; // up 2 left or right
FourSquares.mainMenu = function (e) {
    GameBoard.mainMenu = true;
    Windows.displayScreen('main-menu');
    MainMenu.fadeDiv.style.opacity = 1;
    setTimeout(function () { MainMenu.transparencyInterval = setInterval(MainMenu.fadeDivFunction, 20); }, 250);
    while (MainMenu.piecesList.length < 20) {
        let randomPiece = Object.assign({}, Pieces.array[Math.floor(Math.random() * Pieces.array.length)]);
        randomPiece.xOffset = Math.random() * window.innerWidth / 20;
        randomPiece.yOffset = Math.random() * (window.innerHeight / 20);
        randomPiece.speed = Math.random() * 0.1;
        MainMenu.piecesList.push(randomPiece);
    }
    if(undefined != e) {
        e.preventDefault();
    }
    MainMenu.draw();
}
FourSquares.startGame = function (e) {
    GameBoard.currentY = 0 + (GameBoard.contentHeight - GameBoard.visualHeight)
    HoldPiece.piece = undefined;
    GameBoard.mainMenu = false;
    NextThree.pieces = [];
    for (let i = 0; i < 5; i++) {
        NextThree.add();
    }
    GameBoard.areYouDead = false;
    GameBoard.paused = false;
    GameBoard.content = [];
    for (let i = 0; i < GameBoard.contentHeight; i++) {
        GameBoard.content.unshift(['', '', '', '', '', '', '', '', '', '']);
    }
    Windows.hideScreens();
    GameBoard.currentPiece = NextThree.popAndAdd();
    Stats.clearStats();
    let levelInfo = FourSquares.checkLevel();
    ScoreBoard.text.innerText = "Level " + levelInfo.level;
    ScoreBoard.score.innerText = levelInfo.scoreLeft;
    Controls.addListeners();
    FourSquares.frameTime = new Date();
    if(undefined != e) {
        e.preventDefault();
    }
    FourSquares.draw();
}
FourSquares.checkLevel = function () {
    let level = 1;
    let levelRequirement = FourSquares.levelRequirements[0];
    while (levelRequirement <= Stats.rowsCleared && level < FourSquares.levelRequirements.length) {
        levelRequirement += FourSquares.levelRequirements[Math.min(level, FourSquares.levelRequirements.length)];
        level++;
    }
    FourSquares.currentInterval = FourSquares.levelSpeeds[Math.min(level - 1, FourSquares.levelSpeeds.length)];
    Stats.level = level;
    let output = {};
    output.level = level;
    let total = 0;
    for (let i = 0; i < level; i++) {
        total += FourSquares.levelRequirements[i];
    }
    output.scoreLeft = total - Stats.rowsCleared;
    return output;
}
FourSquares.draw = function () {
    if (GameBoard.mainMenu) {
        return;
    }
    let newTime = new Date();
    if (newTime - FourSquares.frameTime > 250) {
        FourSquares.pauseGame();
        Windows.displayScreen('pause');
    }
    if (GameBoard.areYouDead) {
        Windows.displayScreen('death');
    }
    Graphics.context.clearRect(0, 0, GameBoard.canvas.width, GameBoard.canvas.height);
    Graphics.drawGhost(GameBoard.currentPiece, GameBoard.currentX, GameBoard.currentY)
    Graphics.drawBoard(GameBoard.content);
    let shouldStay = FourSquares.checkIfItShouldStay(GameBoard.currentPiece, GameBoard.currentX, GameBoard.currentY);
    if (shouldStay) {
        Graphics.drawPiece(Graphics.context, GameBoard.currentPiece, GameBoard.currentX, GameBoard.currentY, Graphics.addOpacityToColor(GameBoard.currentPiece.color, 0.6 + (0.4 * (FourSquares.frameTime - FourSquares.timeStamp) / 1500)));
    } else {
        Graphics.drawPiece(Graphics.context, GameBoard.currentPiece, GameBoard.currentX, GameBoard.currentY);
    }
    HoldPiece.context.clearRect(0, 0, HoldPiece.canvas.width, HoldPiece.canvas.height);
    if (HoldPiece.piece != undefined) {
        positionOffset = Pieces.findCenterPoints(HoldPiece.piece);
        Graphics.drawPiece(HoldPiece.context, HoldPiece.piece, positionOffset.x, positionOffset.y, 'rgba(0,0,0,0.5)');
    }

    NextThree.context.clearRect(0, 0, NextThree.canvas.width, NextThree.canvas.height);
    yOffset = 0;
    for (let piece of NextThree.pieces) {
        positionOffset = Pieces.findCenterPoints(piece);
        if (yOffset == 0) {
            NextThree.context.fillStyle = Graphics.addOpacityToColor(piece.color, 0.6);
            NextThree.context.fillRect(0, 0, 120, 120);
        }
        Graphics.drawPiece(NextThree.context, piece, positionOffset.x, positionOffset.y + yOffset);
        yOffset += 5;
    }
    if (GameBoard.paused || GameBoard.areYouDead) {
        return;
    }
    FourSquares.frameTime = newTime;
    if (FourSquares.frameTime - FourSquares.timeStamp >= FourSquares.currentInterval) {
        let moveIt = true;
        if (shouldStay) {
            if (FourSquares.frameTime - FourSquares.timeStamp <= 1500) {
                moveIt = false;
            }
        }
        if (moveIt) {
            Controls.moveDown();
            FourSquares.timeStamp = FourSquares.frameTime;
        }
    }
    requestAnimationFrame(FourSquares.draw);
}
FourSquares.checkIfItShouldStay = function (piece, currentX, currentY) {
    for (let i = 0; i < 4; i++) {
        let x = piece.squares[i][0] + currentX;
        let y = piece.squares[i][1] + currentY;
        if (GameBoard.content.length - 1 == y) {
            return true;
        }
        if (0 <= y + 1 && y + 1 < GameBoard.content.length && 0 <= x && x < 10 && GameBoard.content[y + 1][x].length != 0) {
            return true;
        }
    }
    return false;
}
FourSquares.isNewPieceOk = function (newPiece, currentX, currentY) {
    for (let coord of newPiece.squares) {
        if (coord[0] + currentX < 0 || coord[0] + currentX >= 10 || coord[1] + currentY >= GameBoard.content.length) {
            return false;
        }
        if (coord[1] + currentY < 0) {
            continue;
        }
        if (GameBoard.content[coord[1] + currentY][coord[0] + currentX].length > 0) {
            return false;
        }
    }
    return true;
}

const Controls = {};
Controls.rotatePiece = function (rotationDirection) {
    let newPiece = {};
    newPiece.type = GameBoard.currentPiece.type;
    newPiece.color = GameBoard.currentPiece.color;
    newPiece.squares = [];
    for (let i = 0; i < 4; i++) {
        if (rotationDirection === 'counterClockwise') {
            newPiece.squares.push([GameBoard.currentPiece.squares[i][1], -GameBoard.currentPiece.squares[i][0]]); // counter-clockwise
        } else {
            newPiece.squares.push([-GameBoard.currentPiece.squares[i][1], GameBoard.currentPiece.squares[i][0]]); // clock-wise
        }
    }
    let weight = 0;
    if (newPiece.type === 'o'
        || newPiece.type === 'j'
        || newPiece.type === 'l') {
        // now make it start at -1 x
        let min = 0;
        for (let i = 0; i < 4; i++) {
            min = Math.min(newPiece.squares[i][0], min);
        }
        let diff = min - (-1);
        for (let i = 0; i < 4; i++) {
            newPiece.squares[i][0] -= diff;
            weight += newPiece.squares[i][0];
        }
    }
    let isNewPieceOk = FourSquares.isNewPieceOk(newPiece, GameBoard.currentX, GameBoard.currentY);
    if (!isNewPieceOk) {
        for (let xyOffset of FourSquares.xyOffsetsToCheckForRotation) {
            isNewPieceOk = FourSquares.isNewPieceOk(newPiece, GameBoard.currentX + xyOffset[0], GameBoard.currentY + xyOffset[1]);
            if (isNewPieceOk) {
                GameBoard.currentX += xyOffset[0];
                GameBoard.currentY += xyOffset[1];
                break;
            }
        }
    }

    if (!isNewPieceOk) {
        return;
    }

    GameBoard.currentPiece = newPiece;
    // if its next move is being stuck, reset the timer
    let shouldStay = FourSquares.checkIfItShouldStay(GameBoard.currentPiece, GameBoard.currentX, GameBoard.currentY);
    if (shouldStay) {
        FourSquares.timeStamp = new Date();
    }
}
Controls.moveDownUntilYouCant = function () {
    let shouldStay = FourSquares.checkIfItShouldStay(GameBoard.currentPiece, GameBoard.currentX, GameBoard.currentY);
    if (shouldStay) {
        return;
    }
    Controls.moveDown();
    FourSquares.timeStamp = new Date();
}
Controls.snapDown = function () {
    for (let i = 0; i < GameBoard.content.length; i++) {
        if (Controls.moveDown()) {
            break;
        }
    }
}
Controls.moveHorizontal = function (direction) {
    if (direction === 'left') {
        FourSquares.xyOffsetsToCheckForRotation = [[-1, 1], [0, 1]
            , [-1, 0]
            , [-1, -1], [0, -1]
            , [-1, -2], [0, -2]
            , [1, 1], [1, 0], [1, -1], [1, -2]];
    } else {
        FourSquares.xyOffsetsToCheckForRotation = [[1, 1], [0, 1]
            , [1, 0]
            , [1, -1], [0, -1]
            , [1, -2], [0, -2]
            , [-1, 1], [-1, 0], [-1, -1], [-1, -2]];
    }
    for (let i = 0; i < 4; i++) {
        let x = GameBoard.currentPiece.squares[i][0] + GameBoard.currentX;
        let y = GameBoard.currentPiece.squares[i][1] + GameBoard.currentY;
        // verify it won't go off board
        let limit = 0;
        if (direction === 'right') {
            limit = 10 - 1
        }
        if (x == limit) {
            return;
        }
        if (y < 0) {
            continue;
        }
        // verify it won't hit anything
        let index = x - 1;
        if (direction === 'right') {
            index = x + 1;
        }
        if (GameBoard.content[y][index].length > 0) {
            return;
        }
    }
    GameBoard.currentX -= 1;
    if (direction === 'right') {
        GameBoard.currentX += 2;
    }
    // if its next move is being stuck, reset the timer
    let shouldStay = FourSquares.checkIfItShouldStay(GameBoard.currentPiece, GameBoard.currentX, GameBoard.currentY);
    if (shouldStay) {
        FourSquares.timeStamp = new Date();
    }
}

Controls.pauseHandler = function (keyboardEvent) {
    if (keyboardEvent.code === 'Escape' || keyboardEvent.key === '*') {
        if (GameBoard.paused) {
            FourSquares.resumeGame();
        } else {
            FourSquares.pauseGame();
            Windows.displayScreen('pause');
        }
    }
}

Controls.keyboardHandler = function (keyboardEvent) {
    if (keyboardEvent.code === 'ArrowUp' || keyboardEvent.key === '9' || keyboardEvent.key === '2') {
        Controls.rotatePiece('clockwise');
    } else if (keyboardEvent.code === 'KeyX' || keyboardEvent.code === 'KeyW' || keyboardEvent.code === 'KeyZ' || keyboardEvent.code === 'KeyX' || keyboardEvent.code === 'KeyA' || keyboardEvent.key === '7') {
        Controls.rotatePiece('counterClockwise');
    } else if (keyboardEvent.code === 'ArrowDown' || keyboardEvent.key === '8') {
        Controls.moveDownUntilYouCant();
    } else if (keyboardEvent.code === 'ArrowLeft' || keyboardEvent.key === '4') {
        Controls.moveHorizontal('left');
    } else if (keyboardEvent.code === 'ArrowRight' || keyboardEvent.key === '6') {
        Controls.moveHorizontal('right');
    } else if (keyboardEvent.code === 'Space' || keyboardEvent.key === '0') {
        Controls.snapDown();
    } else if (keyboardEvent.code === 'ControlLeft' || keyboardEvent.code === 'ShiftLeft' || keyboardEvent.key === 'Call') {
        HoldPiece.swapHoldPiece();
    } else {
        Controls.pauseHandler(keyboardEvent);
    }
}

// code taken from here https://stackoverflow.com/a/23230280
let xDown = null;
let yDown = null;
let handleTouchCalled = false;
let movedDown = false;
let downTimestamp = undefined;
let intervalId = undefined;

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

Controls.handleTouchStart = function (evt) {
    evt.preventDefault();
    handleTouchCalled = false;
    movedDown = false;
    if (evt.touches.length > 1) {
        FourSquares.pauseGame();
        Windows.displayScreen('pause');
    }
    downTimestamp = new Date();
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
    return false;
};

Controls.handleTouchEnd = function (evt) {
    evt.preventDefault();
    clearInterval(intervalId);
    intervalId = undefined;
    let diff = new Date() - downTimestamp;
    if (!handleTouchCalled && diff < 200) {
        if (parseInt(HoldPiece.canvas.style.left) < xDown && xDown < parseInt(HoldPiece.canvas.style.left) + parseInt(HoldPiece.canvas.style.width)
            && parseInt(HoldPiece.canvas.style.top) < yDown && yDown < parseInt(HoldPiece.canvas.style.top) + parseInt(HoldPiece.canvas.style.height)) {
            HoldPiece.swapHoldPiece();
        } else if (xDown < window.innerWidth / 2) {
            Controls.rotatePiece('counterClockwise');
        } else {
            Controls.rotatePiece('clockwise');
        }
    }
    if (movedDown && diff < 250) {
        Controls.snapDown();
    }
    downTimestamp = undefined;
    return false;
}

Controls.horizontalDivisions = 10.5;
Controls.verticalDivisions = 5.0;

Controls.handleTouchMove = function (evt) {
    evt.preventDefault();
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(yDiff) > parseInt(GameBoard.canvas.style.width) / Controls.verticalDivisions) {
        if (intervalId == undefined && yDiff < 0) {
            xDown = xUp;
            yDown = yUp;
            intervalId = setInterval(Controls.moveDownUntilYouCant, 35);
            movedDown = true;
            handleTouchCalled = true;
            downTimestamp = new Date();
        }
    }
    let angle = Math.atan2(yDiff, xDiff) * (180 / Math.PI);
    let isValidAngle = (-60 < angle && angle < 60)
        || (120 < angle && angle <= 180)
        || (-180 <= angle && angle < -120);
    if (isValidAngle &&
        Math.abs(xDiff) > parseInt(GameBoard.canvas.style.width) / Controls.horizontalDivisions) {
        clearInterval(intervalId);
        if (xDiff > 0) {
            Controls.moveHorizontal('left');
            xDown = xUp;
            yDown = yUp;
        } else {
            Controls.moveHorizontal('right');
            xDown = xUp;
            yDown = yUp;
        }
        handleTouchCalled = true;
    }
    return false;
};

Controls.emptyTouchStart = function(evt) {
	evt.preventDefault();
	return false;
}

Controls.emptyTouchEnd = function(evt) {
	evt.preventDefault();
	return false;
}

Controls.addListeners = function () {
    Controls.removeListeners();
    FourSquares.timeStamp = new Date();
    document.addEventListener('keydown', Controls.keyboardHandler);
    setTimeout(function() { document.addEventListener('touchstart', Controls.handleTouchStart, { passive: false }); }, 100);
    setTimeout(function() { document.addEventListener('touchmove', Controls.handleTouchMove, { passive: false }); }, 100);
    setTimeout(function() { document.addEventListener('touchend', Controls.handleTouchEnd, { passive: false }); }, 100);
}

Controls.addPauseListeners = function () {
    Controls.removeListeners();
    document.addEventListener('keydown', Controls.pauseHandler);
}


Controls.removeListeners = function () {
    document.removeEventListener('keydown', Controls.keyboardHandler);
    document.removeEventListener('touchstart', Controls.handleTouchStart, { passive: false });
    document.removeEventListener('touchmove', Controls.handleTouchMove, { passive: false });
    document.removeEventListener('touchend', Controls.handleTouchEnd, { passive: false });
    document.removeEventListener('keydown', Controls.pauseHandler);
}
Controls.moveDown = function () {
    if (GameBoard.areYouDead || GameBoard.paused) {
        return;
    }
    // check whether it should stay
    let shouldStay = FourSquares.checkIfItShouldStay(GameBoard.currentPiece, GameBoard.currentX, GameBoard.currentY);
    if (shouldStay) {
        for (let i = 0; i < 4; i++) {
            let x = GameBoard.currentPiece.squares[i][0] + GameBoard.currentX;
            let y = GameBoard.currentPiece.squares[i][1] + GameBoard.currentY;
            if (y < 0) {
                continue;
            }
            GameBoard.content[y][x] = GameBoard.currentPiece.color;
        }
        GameBoard.currentPiece = NextThree.popAndAdd();
        GameBoard.currentX = 4;
        GameBoard.currentY = 0 + (GameBoard.contentHeight - GameBoard.visualHeight);
        // check and see if next piece has collided with any other pieces
        for (let i = 0; i < 4; i++) {
            let x = GameBoard.currentPiece.squares[i][0] + GameBoard.currentX;
            let y = GameBoard.currentPiece.squares[i][1] + GameBoard.currentY;
            if (y < 0) {
                continue;
            }
            if (GameBoard.content[y][x].length > 0) {
                GameBoard.areYouDead = true;
                Controls.removeListeners();
                return;
            }
        }
        FourSquares.timeStamp = new Date();
        let rowsToClear = [];
        for (let y = 0; y < GameBoard.content.length; y++) {
            let anyEmpty = false;
            for (let x = 0; x < 10; x++) {
                anyEmpty = anyEmpty || GameBoard.content[y][x].length == 0;
            }
            if (!anyEmpty) {
                rowsToClear.push(y);
            }
        }
        for (let idx = rowsToClear.length - 1; idx >= 0; idx--) {
            let y = rowsToClear[idx];
            GameBoard.content.splice(y, 1);
            Stats.rowsCleared++;
            let levelInfo = FourSquares.checkLevel();
            if (levelInfo.scoreLeft == 0) {
                FourSquares.pauseGame();
                Windows.displayScreen('win');
            } else if (levelInfo.scoreLeft < 0) {
                ScoreBoard.text.innerText = "Level " + levelInfo.level + "+";
                ScoreBoard.score.innerText = Stats.rowsCleared;
                ScoreBoard.flavorText.innerText = "total lines"
            } else {
                ScoreBoard.text.innerText = "Level " + levelInfo.level;
                ScoreBoard.score.innerText = levelInfo.scoreLeft;
                ScoreBoard.flavorText.innerText = "to level up";
            }
        }
        for (let row of rowsToClear) {
            GameBoard.content.unshift(['', '', '', '', '', '', '', '', '', '']);
        }
        if (rowsToClear.length >= 4) {
            Stats.quads++;
        } else if (rowsToClear.length == 3) {
            Stats.triples++;
        } else if (rowsToClear.length == 2) {
            Stats.doubles++;
        } else if (rowsToClear.length == 1) {
            Stats.singles++;
        }
        HoldPiece.movedDownWithoutUsing = false;
        return true;
    }
    // move it 
    GameBoard.currentY += 1;
    return false;
}
FourSquares.decreaseHorizontal = function () {
    let parsed = (Math.round(parseFloat(Windows.horizontalDisplay.value * 10)) - 1) / 10;
    if(isNaN(parsed)) {
        Windows.horizontalDisplay.value = Controls.horizontalDivisions.toString();
    } else if (FourSquares.minHorizontalSensitivity <= parsed
            && parsed <= FourSquares.maxHorizontalSensitivity) {
        Windows.horizontalDisplay.value = parsed.toString();
    }
}
FourSquares.increaseHorizontal = function () {
    let parsed = (Math.round(parseFloat(Windows.horizontalDisplay.value * 10)) + 1) / 10;
    if(isNaN(parsed)) {
        Windows.horizontalDisplay.value = Controls.horizontalDivisions.toString();
    } else if (FourSquares.minHorizontalSensitivity <= parsed
            && parsed <= FourSquares.maxHorizontalSensitivity) {
        Windows.horizontalDisplay.value = parsed.toString();
    }
}
FourSquares.decreaseVertical = function () {
    let parsed = (Math.round(parseFloat(Windows.verticalDisplay.value * 10)) - 1) / 10;
    if(isNaN(parsed)) {
        Windows.verticalDisplay.value = Controls.verticalDivisions.toString();
    } else if (FourSquares.minVerticalSensitivity <= parsed
            && parsed <= FourSquares.maxVerticalSensitivity) {
        Windows.verticalDisplay.value = parsed.toString();
    }
}
FourSquares.increaseVertical = function () {
    let parsed = (Math.round(parseFloat(Windows.verticalDisplay.value * 10)) + 1) / 10;
    if(isNaN(parsed)) {
        Windows.verticalDisplay.value = Controls.verticalDivisions.toString();
    } else if (FourSquares.minVerticalSensitivity <= parsed
            && parsed <= FourSquares.maxVerticalSensitivity) {
        Windows.verticalDisplay.value = parsed.toString();
    }
}
FourSquares.maxHorizontalSensitivity = 20;
FourSquares.minHorizontalSensitivity = 5;
FourSquares.maxVerticalSensitivity = 20;
FourSquares.minVerticalSensitivity = 1;
FourSquares.applySensitivities = function () {
    try {
        let horizParsed = parseFloat(Windows.horizontalDisplay.value);
        if (!isNaN(horizParsed) 
                && FourSquares.minHorizontalSensitivity <= horizParsed 
                && horizParsed <= FourSquares.maxHorizontalSensitivity) {
            Controls.horizontalDivisions = horizParsed;
        }
        let vertParsed = parseFloat(Windows.verticalDisplay.value);
        if (!isNaN(vertParsed)
                && FourSquares.minVerticalSensitivity <= vertParsed 
                && vertParsed <= FourSquares.maxVerticalSensitivity) {
            Controls.verticalDivisions = vertParsed;
        }
    } catch (e) {
        console.log(e);
    }
    Windows.displayScreen('pause');
}
FourSquares.sensitivityWindow = function () {
    Windows.displayScreen('sensitivity-window');
}