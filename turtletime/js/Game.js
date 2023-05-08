const Game = {};
Game.body = document.getElementById('body');
Game.roundStart = new Date();
Game.levelNumberSpan = document.getElementById('level-number');
Game.levelInfoDiv = document.getElementById('level-info');
Game.progressBar = document.getElementById('food-progress');
Game.deathDiv = document.getElementById('death-div');
Game.winDiv = document.getElementById('win-window');
Game.totalNeeded = document.getElementById('total-needed');
Game.amountEaten = document.getElementById('amount-eaten');
Game.pauseButton = document.getElementById('pause-button');
Game.pauseDiv = document.getElementById('pause-window');
Game.windowBackground = document.getElementById('window-background-div');
Game.menuDiv = document.getElementById('menu-div');
Game.helpScreenDiv = document.getElementById('help-screen-div');
Game.eatCount = 0;
Game.requiredCount = 0;
Game.currentLevel = 0;
Game.pauseTime = new Date();
Game.won = false;
Game.autoPlay = false;
Game.isStartMenuOpen = false;
Game.setTurtleMouthOpenTouch = function (e) {
    Game.setTurtleMouthOpen();
    e.preventDefault();
    return false;
}
Game.setTurtleMouthClosedTouch = function (e) {
    Game.setTurtleMouthClosed();
    e.preventDefault();
    return false;
}
Game.setTurtleMouthOpen = function () {
    Turtle.isOpen = true;
}
Game.setTurtleMouthClosed = function () {
    Turtle.isOpen = false;
    Turtle.lastShutTime = frameTime;
}
Game.addListeners = function () {
    Game.removeListeners();
    Turtle.canvas.addEventListener('touchstart', Game.setTurtleMouthOpenTouch, {passive: false});
    Turtle.canvas.addEventListener('touchend', Game.setTurtleMouthClosedTouch, {passive: false});
    Turtle.canvas.addEventListener('mousedown', Game.setTurtleMouthOpen);
    Turtle.canvas.addEventListener('mouseup', Game.setTurtleMouthClosed);
}
Game.removeListeners = function () {
    Turtle.canvas.removeEventListener('touchstart', Game.setTurtleMouthOpenTouch, {passive: false});
    Turtle.canvas.removeEventListener('touchend', Game.setTurtleMouthClosedTouch, {passive: false});
    Turtle.canvas.removeEventListener('mousedown', Game.setTurtleMouthOpen);
    Turtle.canvas.removeEventListener('mouseup', Game.setTurtleMouthClosed);
}
Game.displayDeathScreen = function () {
    Game.pauseButton.style.display = 'none';
    Game.deathDiv.style.zIndex = '4';
    Game.onResize(true);
    setTimeout(function () {
        Game.onResize(true);
    }, 100);
}
Game.displayHelpScreen = function () {
    Game.menuDiv.style.zIndex = '0';
    Game.helpScreenDiv.style.zIndex = '4';
}
Game.displayWinScreen = function () {
    Game.pauseButton.style.display = 'none';
    Game.levelNumberSpan.classList.add('win');
    Game.winDiv.style.zIndex = '4';
    setTimeout(function () {
        Game.onResize(true);
    }, 100);
}
Game.displayMenuScreen = function () {
    Game.pauseButton.style.display = 'none';
    Game.helpScreenDiv.style.zIndex = '0';
    Game.menuDiv.style.zIndex = '4';
    Game.onResize(true);    
}
Game.hideMenu = function () {
    Game.menuDiv.style.zIndex = '0';
}
Game.hideScreens = function (hidePauseButton) {
    Game.deathDiv.style.zIndex = '0';
    Game.winDiv.style.zIndex = '0';
    Game.pauseDiv.style.zIndex = '0';
    Game.windowBackground.style.zIndex = '0';
    if(!hidePauseButton) {
        Game.pauseButton.style.display = 'block';
    }
}
Game.startGame = function () {
    frameTime = new Date();
    Game.levelNumberSpan.classList.remove('win');
    Game.addListeners();
    Game.setTurtleMouthClosed();
    Game.hideScreens();
    Game.hideMenu();
    Game.pause = false;
    Game.levelInfoDiv.style.zIndex = '10';
    Food.foodItems = [];
    Food.foodItemsToBounce = [];
    Game.autoPlay = false;
    Game.eatCount = 0;
    Game.requiredCount = 0;
    Game.currentLevel = 0;
    Game.won = false;
    Game.isStartMenuOpen = false;
    Game.drawFrame();
}

Game.startMenu = function () {
    frameTime = new Date();
    Game.levelNumberSpan.classList.remove('win');
    Game.removeListeners();
    Game.setTurtleMouthClosed();
    Game.hideScreens(true);
    Game.displayMenuScreen();
    Game.pause = false;
    Game.levelInfoDiv.style.zIndex = '0';
    Food.foodItems = [];
    Food.foodItemsToBounce = [];
    Game.autoPlay = true;
    Game.eatCount = 0;
    Game.requiredCount = 0;
    Game.currentLevel = 20;
    Game.won = false;
    Game.isStartMenuOpen = true;
    Game.drawFrame();
}

Game.pauseGame = function () {
    Game.pauseButton.onclick = undefined;
    Game.pause = true;
    Game.pauseButton.blur();
    Game.pauseButton.innerHTML = '&#9658;';
    Game.pauseTime = new Date(frameTime);
    Game.pauseDiv.style.zIndex = '4';
    Game.windowBackground.style.zIndex = '3';
    setTimeout(function () {
        Game.pauseButton.onclick = Game.resumeGame;
    }, 400);
    setTimeout(function () {
        Game.onResize(true);
    }, 100);
}
Game.resumeGame = function (hidePauseButton) {
    Game.pauseButton.onclick = undefined;
    frameTime = new Date();
    Game.pauseButton.innerHTML = '&#10074;&#10074;'
    for (let item of Food.foodItemsToBounce) {
        item.startTime = new Date(item.startTime.getTime() + (frameTime.getTime() - Game.pauseTime.getTime()));
    }
    for (let item of Food.foodItems) {
        item.startTime = new Date(item.startTime.getTime() + (frameTime.getTime() - Game.pauseTime.getTime()));
    }
    Game.pause = false;
    Game.hideScreens(hidePauseButton);
    Game.drawFrame();
    setTimeout(function () {
        Game.pauseButton.onclick = Game.pauseGame;
    }, 400);
}
Game.drawFrame = function () {
    let newTime = new Date();
    if (newTime - frameTime > 100) {
        if(Game.isStartMenuOpen) {
            Game.pauseGame();
            Game.resumeGame(true);
        } else {
            Game.pauseGame();
        }
    }
    if (Game.pause) {
        return;
    }
    if (Game.autoPlay) {
        AutoPlay.run();
    }
    context.clearRect(0, 0, Turtle.canvas.width, Turtle.canvas.height);
    frameTime = new Date();
    // check if you need to load another level
    if (Food.foodItems.length == 0 && Food.foodItemsToBounce.length == 0) {
        if (Game.eatCount < Game.requiredCount) {
            Game.displayDeathScreen();
            Game.pause = true;
            return;
        }
        if (Game.currentLevel == (20 - 1) && !Game.won) {
            Game.won = true;
            Game.levelNumberSpan.innerText = (Game.currentLevel + 1).toString();
            Game.displayWinScreen();
            Game.pause = true;
            return;
        }
        Game.currentLevel++;
        let level = Levels.array[Math.min(Game.currentLevel - 1, Levels.array.length - 1)]
        Game.roundStart = frameTime;
        Game.eatCount = 0;
        Game.requiredCount = level.amountRequired;
        Game.levelNumberSpan.innerText = (Game.currentLevel).toString();
        Game.progressBar.setAttribute('value', '0');
        Game.progressBar.style.width = '0';
        Game.progressBar.classList.remove('complete');
        Game.amountEaten.innerText = (0).toString();
        Game.totalNeeded.innerText = Game.requiredCount.toString();
        Food.createFoodsForLevel(level);
    }

    let progress = Math.floor((Game.eatCount / Game.requiredCount) * 100).toString();
    if (Game.progressBar.getAttribute('value') != progress) {
        Game.amountEaten.innerText = Game.eatCount.toString();
        Game.progressBar.setAttribute('value', progress);
        if (progress >= 100) {
            Game.progressBar.classList.add('complete');
        }
        Game.progressBar.style.width = Math.min(Math.floor(progress * 1.7), 170) + 'px'
    }

    let centerX = Turtle.canvas.width / 2;
    Food.calculateFoodPosition(centerX);
    Turtle.drawTurtleHead(Game.currentLevel, centerX);

    // loop
    requestAnimationFrame(Game.drawFrame);
}

Game.onResize = function (force) {
    if (force || Turtle.canvas.width != window.innerWidth || Turtle.canvas.height != window.innerHeight) {
        Turtle.canvas.width = window.innerWidth;
        Turtle.canvas.style.width = window.innerWidth + 'px';
        Turtle.canvas.height = window.innerHeight;
        Turtle.canvas.style.height = window.innerHeight + 'px';

        Game.deathDiv.style.left = ((window.innerWidth - Game.deathDiv.offsetWidth) / 2) + 'px';
        Game.deathDiv.style.top = ((window.innerHeight - Game.deathDiv.offsetHeight) / 2) + 'px';

        Game.winDiv.style.left = ((window.innerWidth - Game.winDiv.offsetWidth) / 2) + 'px';
        Game.winDiv.style.top = ((window.innerHeight - Game.winDiv.offsetHeight) / 2) + 'px';

        Game.pauseDiv.style.left = ((window.innerWidth - Game.pauseDiv.offsetWidth) / 2) + 'px';
        Game.pauseDiv.style.top = ((window.innerHeight - Game.pauseDiv.offsetHeight) / 2) + 'px';

        Game.menuDiv.style.left = ((window.innerWidth - Game.menuDiv.offsetWidth) / 2) + 'px';
        Game.menuDiv.style.top = ((window.innerHeight - Game.menuDiv.offsetHeight) / 2) + 'px';

        Game.helpScreenDiv.style.left = ((window.innerWidth - Game.helpScreenDiv.offsetWidth) / 2) + 'px';
        Game.helpScreenDiv.style.top = ((window.innerHeight - Game.helpScreenDiv.offsetHeight) / 2) + 'px';

        Game.pauseButton.style.top = '0';
        Game.pauseButton.style.right = '0';

        Game.levelInfoDiv.style.left = ((window.innerWidth - Game.levelInfoDiv.offsetWidth) / 2) + 'px';
        Game.levelInfoDiv.style.bottom = '0px';

        document.body.style.width = window.innerWidth + 'px';
        document.body.style.height = window.innerHeight + 'px';

        window.scrollTo(0, 0);
    }
}