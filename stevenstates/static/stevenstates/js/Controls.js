const Controls = {};
Controls.timeout = undefined;
Controls.onClickStart = function (e) {
    let color = Controls.getSelectedColor(e.clientX, e.clientY);
    if(color != undefined) {
        StevenStates.setColor(color);
    }
}
Controls.onTouchStart = function (e) {
    let touch = e.touches[e.touches.length - 1];
    let color = Controls.getSelectedColor(touch.clientX, touch.clientY);
    if(color != undefined) {
        StevenStates.setColor(color);
    }
    e.preventDefault();
}
Controls.onClickStartGameMenu = function (e) {
    Controls.startGameMenuCallback(e.clientX, e.clientY);
}
Controls.onTouchStartGameMenu = function (e) {
    let touch = e.touches[0];
    Controls.startGameMenuCallback(touch.clientX, touch.clientY);
    e.preventDefault();
}
Controls.deadTouchCallback = function (e) {
    e.preventDefault();
}
Controls.addDeadListeners = function () {
    Controls.removeListeners();
    document.addEventListener('touchstart', Controls.deadTouchCallback, { passive: false });
    document.addEventListener('touchmove', Controls.deadTouchCallback, { passive: false });
    document.addEventListener('touchend', Controls.deadTouchCallback, { passive: false });
}
Controls.addMenuListeners = function () {
    Controls.removeListeners();
    document.addEventListener('click', Controls.onClickStartGameMenu);
    document.addEventListener('touchstart', Controls.onTouchStartGameMenu, { passive: false });
    document.addEventListener('touchmove', Controls.deadTouchCallback, { passive: false });
    document.addEventListener('touchend', Controls.deadTouchCallback, { passive: false });
}
Controls.addListeners = function () {
    Controls.removeListeners();
    document.addEventListener('click', Controls.onClickStart);
    document.addEventListener('touchstart', Controls.onTouchStart, { passive: false });
    document.addEventListener('touchmove', Controls.deadTouchCallback, { passive: false });
    document.addEventListener('touchend', Controls.deadTouchCallback, { passive: false });
}
Controls.removeListeners = function () {
    document.removeEventListener('click', Controls.onClickStartGameMenu);
    document.removeEventListener('click', Controls.onClickStart);
    document.removeEventListener('touchstart', Controls.onTouchStart, { passive: false });
    document.removeEventListener('touchstart', Controls.onTouchStartGameMenu, { passive: false });
    document.removeEventListener('touchstart', Controls.deadTouchCallback, { passive: false });
    document.removeEventListener('touchmove', Controls.deadTouchCallback, { passive: false });
    document.removeEventListener('touchend', Controls.deadTouchCallback, { passive: false });
}
Controls.getSelectedColor = function (pointX, pointY) {
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let bigCircleRadius = Math.min(centerX,centerY);
    let circleRadius = Math.min(centerX,centerY) / 2.75;
    let x = pointX - centerX;
    let y = pointY - centerY;
    let radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
    let goodRadius = circleRadius < radius && radius < bigCircleRadius;
    if(goodRadius && pointX < centerX && pointY < centerY) {
        return Graphics.colors.green;
    } else if(goodRadius && pointX < centerX && pointY > centerY) {
        return Graphics.colors.yellow;
    } else if(goodRadius && pointX > centerX && pointY < centerY) {
        return Graphics.colors.red;
    } else if(goodRadius && pointX > centerX && pointY > centerY) {
        return Graphics.colors.blue;
    }
    return undefined;
}
Controls.startGameMenuCallback = function (pointX, pointY) {
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let circleRadius = Math.min(centerX,centerY) / 2.75;
    let x = pointX - centerX;
    let y = pointY - centerY;
    let radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
    let goodRadius = radius < circleRadius;
    if(goodRadius) {
        Controls.addDeadListeners();
        StevenStates.startPushed = true;
        setTimeout(function () { StevenStates.startPushed = false; }, 400);
        setTimeout(StevenStates.startGame, 1500);
        Graphics.displayScore();
    }
}