const GameBoard = {};
GameBoard.width = 1;
GameBoard.height = 1;
GameBoard.pelletX = 10;
GameBoard.pelletY = 10;
GameBoard.canvas = document.getElementById('game-board');
GameBoard.context = GameBoard.canvas.getContext('2d');
GameBoard.div = document.getElementById('visual-gameboard-div');
GameBoard.ghostShown = false;
GameBoard.movePellet = function () {
    if (Snake.parts.length >= (GameBoard.width * GameBoard.height)) {
        Snake.win();
        GameBoard.removePellet();
    } else {
        let currentParts = new Map();
        for (let part of Snake.parts) {
            if (!currentParts.has(part.xPosition)) {
                currentParts.set(part.xPosition, []);
            }
            currentParts.get(part.xPosition).push(part.yPosition);
        }
        let allParts = [];
        for (let x = 0; x < GameBoard.width; x++) {
            for (let y = 0; y < GameBoard.height; y++) {
                if (currentParts.has(x) && currentParts.get(x).indexOf(y) > -1) {

                } else {
                    allParts.push({ 'x': x, 'y': y, });
                }
            }
        }
        let newPosition = allParts[Math.round(Math.random() * (allParts.length - 1))];
        GameBoard.pelletX = Math.floor(newPosition.x);
        GameBoard.pelletY = Math.floor(newPosition.y);
    }
}
GameBoard.removePellet = function () {
    GameBoard.pelletX = -2;
    GameBoard.pelleyY = -2;
}
GameBoard.draw = function () {
    GameBoard.context.clearRect(0, 0, GameBoard.canvas.width, GameBoard.canvas.height);
    let headPart = undefined;
    for (let part of Snake.parts) {
        headPart = part;
        break;
    }
    GameBoard.context.fillStyle = '#333';
    if (Snake.won) {
        GameBoard.context.fillStyle = '#0f0';
    }
    let previousPart = undefined;
    for (let part of Snake.parts) {
        GameBoard.context.fillRect((part.xPosition + 1) * 20 + 1, (part.yPosition + 1) * 20 + 1, 18, 18);
        if (previousPart != undefined) {
            if (part.xPosition - previousPart.xPosition > 0) {
                GameBoard.context.fillRect((previousPart.xPosition + 1) * 20 + 1, (previousPart.yPosition + 1) * 20 + 1, 18 + 2 + 18, 18);
            } else if (part.xPosition - previousPart.xPosition < 0) {
                GameBoard.context.fillRect((part.xPosition + 1) * 20 + 1, (part.yPosition + 1) * 20 + 1, 18 + 2 + 18, 18);
            } else if (part.yPosition - previousPart.yPosition > 0) {
                GameBoard.context.fillRect((previousPart.xPosition + 1) * 20 + 1, (previousPart.yPosition + 1) * 20 + 1, 18, 18 + 2 + 18);
            } else if (part.yPosition - previousPart.yPosition < 0) {
                GameBoard.context.fillRect((part.xPosition + 1) * 20 + 1, (part.yPosition + 1) * 20 + 1, 18, 18 + 2 + 18);
            }
        }
        previousPart = {};
        previousPart.xPosition = part.xPosition;
        previousPart.yPosition = part.yPosition;
    }
    if (Snake.dead) {
        GameBoard.context.fillStyle = '#f00';
        GameBoard.context.fillRect((headPart.xPosition + 1) * 20 + 1, (headPart.yPosition + 1) * 20 + 1, 18, 18);
    }
    GameBoard.context.fillStyle = '#dd3';
    GameBoard.context.fillRect((GameBoard.pelletX + 1) * 20 + 1, (GameBoard.pelletY + 1) * 20 + 1, 18, 18);
    if (QueuedInput.list.length > 2) {
        GameBoard.ghostShown = true;
    } else if (QueuedInput.list.length == 0) {
        GameBoard.ghostShown = false;
    }
    if (GameBoard.ghostShown) {
        let prevPointX = headPart.xPosition;
        let prevPointY = headPart.yPosition;
        GameBoard.context.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let item of QueuedInput.list) {
            prevPointX += Math.cos(item);
            prevPointY -= Math.sin(item);
            GameBoard.context.fillRect((prevPointX + 1) * 20 + 1, (prevPointY + 1) * 20 + 1, 18, 18);
        }
    }
}