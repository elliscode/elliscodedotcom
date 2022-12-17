const Graphics = {};
Graphics.colors = {};
Graphics.colors.blue = 'rgb(0,0,255)';
Graphics.colors.yellow = 'rgb(255,255,0)';
Graphics.colors.green = 'rgb(0,255,0)';
Graphics.colors.red = 'rgb(255,0,0)';
Graphics.colorArray = [Graphics.colors.blue, Graphics.colors.yellow, Graphics.colors.green, Graphics.colors.red];
Graphics.stevenText = document.getElementById('steven-text');
Graphics.startButton = document.getElementById('start-button');
Graphics.score = document.getElementById('score');
Graphics.scoreText = document.getElementById('score-text');
Graphics.onResize = function () {
    var viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0')
    StevenStates.canvas.style.width = window.innerWidth + 'px';
    StevenStates.canvas.style.height = window.innerHeight + 'px';
    StevenStates.canvas.width = window.innerWidth;
    StevenStates.canvas.height = window.innerHeight;
    Graphics.stevenText.style.bottom = (window.innerHeight / 2) - (Math.min(window.innerWidth, window.innerHeight) / 90) + 'px';
    Graphics.stevenText.style.fontSize = Math.min(window.innerWidth, window.innerHeight) / 15 + 'px';
    Graphics.startButton.style.bottom = (window.innerHeight / 2) - (Math.min(window.innerWidth, window.innerHeight) / 10) + 'px';
    Graphics.startButton.style.fontSize = Math.min(window.innerWidth, window.innerHeight) / 25 + 'px';
}
Graphics.displayScore = function () {
    Graphics.score.style.display = 'block';
    Graphics.scoreText.innerText = 0;
}
Graphics.setScore = function (value) {
    Graphics.scoreText.innerText = value;
}
Graphics.draw = function () {
    let width = window.innerWidth;
    let height = window.innerHeight;

    StevenStates.context.clearRect(0, 0, width, height);
    Graphics.drawBoard(width, height, StevenStates.selectedColor);
    Graphics.drawButton(width, height);
    if(StevenStates.startPushed) {
        Graphics.drawButton(width, height, 'rgba(255,255,255,0.6)');
    }
    requestAnimationFrame(Graphics.draw);
}
Graphics.drawButton = function (width, height, optionalColor) {
    let buttonStart = height - ((height / 2) - (Math.min(width, height) / 12.75));
    let buttonWidth = Math.min(width, height) / 9;
    let buttonHeight = Math.min(width, height) / 34;

    let xOffset = 0.5;
    if(optionalColor != undefined) {
        StevenStates.context.fillStyle = optionalColor;
        xOffset = 0;
    } else {
        StevenStates.context.fillStyle = '#777';   
    }
    StevenStates.context.beginPath();
    StevenStates.context.arc((width / 2) - (buttonWidth / 2) + xOffset, buttonStart, buttonHeight, 0.5 * Math.PI, 1.5 * Math.PI);
    StevenStates.context.fill();

    StevenStates.context.beginPath();
    StevenStates.context.arc((width / 2) + (buttonWidth / 2) - xOffset, buttonStart, buttonHeight, 1.5 * Math.PI, 0.5 * Math.PI);
    StevenStates.context.fill();

    StevenStates.context.fillRect((width / 2) - (buttonWidth / 2), buttonStart - buttonHeight, buttonWidth, buttonHeight * 2);
}
Graphics.drawBoard = function (width, height, optionalColorToHighlight) {
    let centerX = width / 2;
    let centerY = height / 2;

    let fullLength = Math.min(centerX, centerY);
    let length = Math.min(centerX, centerY) * 0.91;

    let a = Math.PI * 0.02;
    let endRatio = 0.8;

    StevenStates.context.fillStyle = 'black';
    StevenStates.context.beginPath();
    StevenStates.context.moveTo(centerX, centerY);
    StevenStates.context.arc(centerX, centerY, fullLength, 0, 2.0 * Math.PI);
    StevenStates.context.fill();

    StevenStates.context.fillStyle = Graphics.colors.blue;
    StevenStates.context.beginPath();
    StevenStates.context.arc(centerX, centerY, length, 0 + (a * endRatio), (0.5 * Math.PI) - (a * endRatio));
    StevenStates.context.arc(centerX, centerY, length / 2.25, (0.5 * Math.PI) - (a * 2.25), 0 + (a * 2.25), true);
    StevenStates.context.fill();

    StevenStates.context.fillStyle = Graphics.colors.yellow;
    StevenStates.context.beginPath();
    StevenStates.context.arc(centerX, centerY, length, (0.5 * Math.PI) + (a * endRatio), (1.0 * Math.PI) - (a * endRatio));
    StevenStates.context.arc(centerX, centerY, length / 2.25, (1.0 * Math.PI) - (a * 2.25), (0.5 * Math.PI) + (a * 2.25), true);
    StevenStates.context.fill();

    StevenStates.context.fillStyle = Graphics.colors.green;
    StevenStates.context.beginPath();
    StevenStates.context.arc(centerX, centerY, length, (1.0 * Math.PI) + (a * endRatio), (1.5 * Math.PI) - (a * endRatio));
    StevenStates.context.arc(centerX, centerY, length / 2.25, (1.5 * Math.PI) - (a * 2.25), (1.0 * Math.PI) + (a * 2.25), true);
    StevenStates.context.fill();

    StevenStates.context.fillStyle = Graphics.colors.red;
    StevenStates.context.beginPath();
    StevenStates.context.arc(centerX, centerY, length, (1.5 * Math.PI) + (a * endRatio), (2.0 * Math.PI) - (a * endRatio));
    StevenStates.context.arc(centerX, centerY, length / 2.25, (2.0 * Math.PI) - (a * 2.25), (1.5 * Math.PI) + (a * 2.25), true);
    StevenStates.context.fill();

    StevenStates.context.fillStyle = 'rgba(255,255,255,0.6)';
    if (optionalColorToHighlight === Graphics.colors.red) {
        StevenStates.context.beginPath();
        StevenStates.context.arc(centerX, centerY, length, (1.5 * Math.PI) + (a * endRatio), (2.0 * Math.PI) - (a * endRatio));
        StevenStates.context.arc(centerX, centerY, length / 2.25, (2.0 * Math.PI) - (a * 2.25), (1.5 * Math.PI) + (a * 2.25), true);
        StevenStates.context.fill();
    } else if (optionalColorToHighlight === Graphics.colors.blue) {
        StevenStates.context.beginPath();
        StevenStates.context.arc(centerX, centerY, length, 0 + (a * endRatio), (0.5 * Math.PI) - (a * endRatio));
        StevenStates.context.arc(centerX, centerY, length / 2.25, (0.5 * Math.PI) - (a * 2.25), 0 + (a * 2.25), true);
        StevenStates.context.fill();
    } else if (optionalColorToHighlight === Graphics.colors.green) {
        StevenStates.context.beginPath();
        StevenStates.context.arc(centerX, centerY, length, (1.0 * Math.PI) + (a * endRatio), (1.5 * Math.PI) - (a * endRatio));
        StevenStates.context.arc(centerX, centerY, length / 2.25, (1.5 * Math.PI) - (a * 2.25), (1.0 * Math.PI) + (a * 2.25), true);
        StevenStates.context.fill();
    } else if (optionalColorToHighlight === Graphics.colors.yellow) {
        StevenStates.context.beginPath();
        StevenStates.context.arc(centerX, centerY, length, (0.5 * Math.PI) + (a * endRatio), (1.0 * Math.PI) - (a * endRatio));
        StevenStates.context.arc(centerX, centerY, length / 2.25, (1.0 * Math.PI) - (a * 2.25), (0.5 * Math.PI) + (a * 2.25), true);
        StevenStates.context.fill();
    }
}