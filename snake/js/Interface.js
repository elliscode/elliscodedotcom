const Interface = {};
Interface.background = document.getElementById('popup-background');
Interface.restart = document.getElementById('restart-game-div');
Interface.pause = document.getElementById('pause-game-div');
Interface.menu = document.getElementById('menu-div');
Interface.difficulty = document.getElementById('difficulty-div');
Interface.headerDiv = document.getElementById('header');
Interface.footerText = document.getElementById('footer-span');
Interface.footerTypeKeyboard = false;
Interface.footerTypeTouch = false;
Interface.startGameButton = document.getElementById("start-game-button");
Interface.difficultyButton = document.getElementById("difficulty-button");
Interface.easyButton = document.getElementById("easy");
Interface.mediumButton = document.getElementById("medium");
Interface.hardButton = document.getElementById("hard");
Interface.restartStartGameButton = document.getElementById('restart-start-game-button');
Interface.restartMainMenuButton = document.getElementById('restart-main-menu-button');
Interface.pauseResumeButton = document.getElementById('pause-resume-button');
Interface.onResize = function () {
    GameBoard.width = Math.max(10, Math.floor(window.innerWidth / 20) - 2);
    GameBoard.height = Math.max(10, Math.floor(window.innerHeight / 20) - 2);

    let realWidth = (GameBoard.width + 2) * 20;
    let realHeight = (GameBoard.height + 2) * 20
    if (GameBoard.canvas.width != realWidth || GameBoard.canvas.height != realHeight) {
        GameBoard.canvas.style.width = realWidth + 'px';
        GameBoard.canvas.style.height = realHeight + 'px';
        GameBoard.canvas.width = realWidth;
        GameBoard.canvas.height = realHeight;
    }

    let marginW = (window.innerWidth - (GameBoard.width * 20)) / 2;
    let marginH = (window.innerHeight - (GameBoard.height * 20)) / 2;

    GameBoard.canvas.style.top = marginH - 20 + 'px';
    GameBoard.canvas.style.left = marginW - 20 + 'px';

    GameBoard.div.style.top = marginH + 'px';
    GameBoard.div.style.left = marginW + 'px';
    GameBoard.div.style.width = (GameBoard.width) * 20 + 'px';
    GameBoard.div.style.height = (GameBoard.height) * 20 + 'px';

    let divs = [Interface.restart, Interface.pause, Interface.menu, Interface.difficulty];
    for (let popupDiv of divs) {
        let left = (window.innerWidth - popupDiv.offsetWidth) / 2;
        let top = (window.innerHeight - popupDiv.offsetHeight) / 2;
        if (popupDiv.style.left.length == 0
            || Math.abs(parseInt(popupDiv.style.left) - left) > 5
            || popupDiv.style.top.length == 0
            || Math.abs(parseInt(popupDiv.style.top) - top) > 5) {
            popupDiv.style.left = left + 'px';
            popupDiv.style.top = top + 'px';
        }
    }

    if (GameBoard.width - 1 < GameBoard.pelletX) {
        GameBoard.movePellet();
    }
    if (GameBoard.height - 1 < GameBoard.pelletY) {
        GameBoard.movePellet();
    }
}

Interface.displayPopup = function (value) {
    Interface.hidePopup();
    let background = document.getElementById('popup-background');
    background.style.zIndex = 10;
    if ('restart' === value) {
        Interface.restart.style.zIndex = 11;
        for(let button of Interface.restart.getElementsByTagName('button')) {
            button.disabled = false;
        }
        setTimeout(function () { Interface.restartStartGameButton.addEventListener('touchstart', Snake.startGame, {passive: false}); }, 200);
        setTimeout(function () { Interface.restartMainMenuButton.addEventListener('touchstart', Snake.mainMenu, {passive: false}); }, 200);
    } else if ('pause' === value) {
        Interface.pause.style.zIndex = 11;
        for(let button of Interface.pause.getElementsByTagName('button')) {
            button.disabled = false;
        }
        setTimeout(function () { Interface.pauseResumeButton.addEventListener('touchstart', Snake.resumeGame, {passive: false}); }, 200);
    } else if ('menu' === value) {
        Interface.menu.style.zIndex = 11;
        for(let button of Interface.menu.getElementsByTagName('button')) {
            button.disabled = false;
        }
        setTimeout(function () { Interface.startGameButton.addEventListener('touchstart', Snake.startGame, {passive: false}); }, 200);
        setTimeout(function () { Interface.difficultyButton.addEventListener('touchstart', Interface.displayDifficultyPopup, {passive: false}); }, 200);
    } else if ('difficulty' === value) {
        Interface.difficulty.style.zIndex = 11;
        for(let button of Interface.difficulty.getElementsByTagName('button')) {
            button.disabled = false;
        }
        setTimeout(function () { Interface.easyButton.addEventListener('touchstart', Interface.setEasy, {passive: false}); }, 200);
        setTimeout(function () { Interface.mediumButton.addEventListener('touchstart', Interface.setMedium, {passive: false}); }, 200);
        setTimeout(function () { Interface.hardButton.addEventListener('touchstart', Interface.setHard, {passive: false}); }, 200);
    }
    Interface.onResize()
}

Interface.displayDifficultyPopup = function () {
	Interface.displayPopup('difficulty');
}
Interface.setEasy = function () {Snake.setPeriod(200);Interface.displayPopup('menu');}
Interface.setMedium = function () {Snake.setPeriod(140);Interface.displayPopup('menu');}
Interface.setHard = function () {Snake.setPeriod(80);Interface.displayPopup('menu');}

Interface.hidePopup = function (value) {
    Interface.background.style.zIndex = 0;
    Interface.restart.style.zIndex = 0;
    Interface.pause.style.zIndex = 0;
    Interface.menu.style.zIndex = 0;
    Interface.difficulty.style.zIndex = 0;
    for(let button of document.getElementsByTagName('button')) {
        button.disabled = true;
    }
    Interface.restartStartGameButton.removeEventListener('touchstart', Snake.startGame, {passive: false});
    Interface.restartMainMenuButton.removeEventListener('touchstart', Snake.mainMenu, {passive: false});
    Interface.pauseResumeButton.removeEventListener('touchstart', Snake.resumeGame, {passive: false});
	Interface.startGameButton.removeEventListener('touchstart', Snake.startGame, {passive: false});
	Interface.difficultyButton.removeEventListener('touchstart', Interface.displayDifficultyPopup, {passive: false});
	Interface.easyButton.removeEventListener('touchstart', Interface.setEasy, {passive: false});
	Interface.mediumButton.removeEventListener('touchstart', Interface.setMedium, {passive: false});
	Interface.hardButton.removeEventListener('touchstart', Interface.setHard, {passive: false});
}