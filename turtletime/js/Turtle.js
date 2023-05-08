const Turtle = {};
Turtle.canvas = document.getElementById('game-canvas');
Turtle.eyesClosed = false;
Turtle.isOpen = false;
Turtle.freezeTime = 0;
const context = Turtle.canvas.getContext('2d');
Turtle.drawTurtleHead = function (turtleSize, centerX) {
    let centerY = Turtle.canvas.height;

    let turtleSizeLimited = Math.min(8 + ((turtleSize / 20) * 12), 20);
    let headWidth = 150 * (turtleSizeLimited / 20);
    let headHeight = 160 * (turtleSizeLimited / 20);
    let shellWidth = 600 * (turtleSizeLimited / 20);
    let shellHeight = 800 * (turtleSizeLimited / 20);
    let headOffset = 200;
    let bodyOffset = headOffset - headHeight;

    // head
    if (Turtle.isFrozen()) {
        Turtle.drawFrozen(headOffset, headWidth, headHeight, centerX, centerY);
    } else {
        if (Turtle.isOpen) {
            Turtle.drawTurtleMouthOpen(headOffset, headWidth, headHeight, centerX, centerY);
        } else {
            Turtle.drawTurtleMouthClosed(headOffset, headWidth, headHeight, centerX, centerY);
        }
    }

    // shell
    Turtle.drawTurtleShell(bodyOffset, shellWidth, shellHeight, centerX, centerY, turtleSize);
}

Turtle.isFrozen = function () {
    return ((frameTime - Turtle.freezeTime) / 1000 < 4);
}

Turtle.drawTurtleShell = function (bodyOffset, shellWidth, shellHeight, centerX, centerY, turtleSizeRawNumber) {
    let turtleSize = ((Math.min(20, turtleSizeRawNumber) - 1) / 25) + 1;
    // legs
    context.fillStyle = 'rgb(82,156,91)';
    context.beginPath();
    context.moveTo(centerX - (shellWidth / 2) - (40 * turtleSize), centerY - bodyOffset);
    context.lineTo(centerX - (shellWidth / 2), centerY - bodyOffset - (40 * turtleSize));
    context.lineTo(centerX - (shellWidth / 2) + (100 * turtleSize), centerY - bodyOffset + (60 * turtleSize));
    context.lineTo(centerX - (shellWidth / 2) + (60 * turtleSize), centerY - bodyOffset + (100 * turtleSize));
    context.fill();
    context.beginPath();
    context.moveTo(centerX + (shellWidth / 2) + (40 * turtleSize), centerY - bodyOffset);
    context.lineTo(centerX + (shellWidth / 2), centerY - bodyOffset - (40 * turtleSize));
    context.lineTo(centerX + (shellWidth / 2) - (100 * turtleSize), centerY - bodyOffset + (60 * turtleSize));
    context.lineTo(centerX + (shellWidth / 2) - (60 * turtleSize), centerY - bodyOffset + (100 * turtleSize));
    context.fill();

    // shell bg
    context.fillStyle = 'rgb(102, 145, 107)';
    context.fillRect(centerX - (shellWidth / 2), centerY - bodyOffset, shellWidth, shellHeight);
}

Turtle.drawFrozen = function (headOffset, headWidth, headHeight, centerX, centerY) {
    Food.drawFood();

    // head
    context.fillStyle = 'rgb(82,156,91)';
    context.fillRect(centerX - (headWidth / 2), centerY - headOffset, headWidth, headHeight);

    Turtle.drawTurtleEyesClosed(headOffset, headWidth, headHeight, centerX, centerY);
}

Turtle.drawTurtleMouthClosed = function (headOffset, headWidth, headHeight, centerX, centerY) {
    Food.drawFood();

    // head
    context.fillStyle = 'rgb(82,156,91)';
    context.fillRect(centerX - (headWidth / 2), centerY - headOffset, headWidth, headHeight);

    if (Turtle.isOpen || Turtle.eyesClosed) {
        Turtle.drawTurtleEyesClosed(headOffset, headWidth, headHeight, centerX, centerY);
    } else {
        Turtle.drawTurtleEyesOpen(headOffset, headWidth, headHeight, centerX, centerY);
    }
}

Turtle.drawTurtleMouthOpen = function (headOffset, headWidth, headHeight, centerX, centerY) {
    let width = 150;
    let height = 200;

    // mouth
    context.fillStyle = 'rgb(66, 128, 74)';
    context.fillRect(centerX - ((headWidth - 20) / 2), centerY - headOffset - 5, (headWidth - 20), 50);
    context.fillStyle = 'rgb(255, 64, 118)';
    context.fillRect(centerX - ((headWidth - 30) / 2), centerY - headOffset, (headWidth - 30), 50);

    Food.drawFood();

    // head
    context.fillStyle = 'rgb(82,156,91)';
    context.fillRect(centerX - (headWidth / 2), centerY - headOffset + 3, headWidth, headHeight - 3);

    Turtle.drawTurtleEyesEating(headOffset, headWidth, headHeight, centerX, centerY);
}

Turtle.drawTurtleEyesOpen = function (headOffset, width, height, centerX, centerY) {
    context.fillStyle = 'white';
    context.fillRect(centerX - (width / 2) - 10, centerY - headOffset + 30, 30, 30);
    context.fillRect(centerX + (width / 2) - 20, centerY - headOffset + 30, 30, 30);
    context.fillStyle = 'black';
    context.fillRect(centerX - (width / 2) - 5, centerY - headOffset + 40, 10, 10)
    context.fillRect(centerX + (width / 2) - 5, centerY - headOffset + 40, 10, 10)
}

Turtle.drawTurtleEyesClosed = function (headOffset, headWidth, headHeight, centerX, centerY) {
    // left eye
    context.fillStyle = 'rgb(66, 128, 74)';
    context.fillRect(centerX - (headWidth / 2) - 10, centerY - headOffset + 30, 30, 30);
    context.fillRect(centerX + (headWidth / 2) - 20, centerY - headOffset + 30, 30, 30);
}

Turtle.drawTurtleEyesEating = function (headOffset, headWidth, height, centerX, centerY) {
    // left eye
    context.fillStyle = 'rgb(66, 128, 74)';
    context.fillRect(centerX - (headWidth / 2) - 10, centerY - headOffset + 30 + 6, 30, 30);
    context.fillRect(centerX + (headWidth / 2) - 20, centerY - headOffset + 30 + 6, 30, 30);
}

Turtle.blinkLoop = function () {
    let timeout = 1500 + (Math.random() * 2500);
    setTimeout(function () {
        if (!Turtle.isOpen && frameTime - Turtle.lastShutTime > 1000) {
            Turtle.eyesClosed = true;
        }
        setTimeout(function () {
            Turtle.eyesClosed = false;
            Turtle.blinkLoop();
        }, 300);
    }, timeout);
}