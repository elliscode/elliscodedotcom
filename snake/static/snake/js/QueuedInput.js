const QueuedInput = {};
QueuedInput.list = [];

QueuedInput.createListeners = function () {
	QueuedInput.removeListeners();
	xDown = null;
	yDown = null;
	QueuedInput.list = [];
	document.addEventListener('keydown', QueuedInput.keyboardHandler);
	GameBoard.canvas.addEventListener('touchstart', handleTouchStart, {passive: false});
	GameBoard.canvas.addEventListener('touchmove', handleTouchMove, {passive: false});
	GameBoard.canvas.addEventListener('touchend', emptyTouchEnd, {passive: false});
}

QueuedInput.removeListeners = function () {
	document.removeEventListener('keydown', QueuedInput.keyboardHandler);
	document.removeEventListener('keydown', QueuedInput.resumeHandler);
	document.removeEventListener('keydown', QueuedInput.restartHandler);
	GameBoard.canvas.removeEventListener('touchstart', handleTouchStart, {passive: false});
	GameBoard.canvas.removeEventListener('touchmove', handleTouchMove, {passive: false});
}

QueuedInput.resumeHandler = function (keyboardEvent) {
	if (keyboardEvent.code === 'Space') {
		Snake.resumeGame();
	}
}

QueuedInput.restartHandler = function (keyboardEvent) {
	if (keyboardEvent.code === 'Space') {
		Snake.startGame();
	}
}

QueuedInput.keyboardHandler = function (keyboardEvent) {
	let oldDirection = undefined;
	for(let item of QueuedInput.list) {
		oldDirection = item;
	}
	if(undefined === oldDirection) {
		oldDirection = Snake.currentDirection;
	}
	let newDirection = undefined;
	if (keyboardEvent.code === 'ArrowUp') {
		newDirection = Direction.UP;
	} else if (keyboardEvent.code === 'ArrowDown') {
		newDirection = Direction.DOWN;
	} else if (keyboardEvent.code === 'ArrowLeft') {
		newDirection = Direction.LEFT;
	} else if (keyboardEvent.code === 'ArrowRight') {
		newDirection = Direction.RIGHT;
	} else if (keyboardEvent.code === 'Space') {
		Snake.pauseGame();
	}
	let definedResult = undefined != newDirection;
	let validCommand = true;
	if(undefined != oldDirection) {
		let magnitude = Math.abs(newDirection - oldDirection);
		if(magnitude === Math.PI || magnitude === 0) {
			validCommand = false;
		}
	}
	if (definedResult && validCommand) {
		QueuedInput.list.push(newDirection);
	}
	if(!Interface.footerTypeKeyboard) {
		Interface.footerText.innerText = "Press Space to Pause";
		Interface.footerTypeKeyboard = true;
		Interface.footerTypeTouch = false;
	}
}

// code taken from here https://stackoverflow.com/a/23230280
var xDown = null;
var yDown = null;

function getTouches(evt) {
	return evt.touches ||             // browser API
		evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
	if(evt.touches.length > 1) {
		Snake.pauseGame();
	}
	const firstTouch = getTouches(evt)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
	if(!Interface.footerTypeTouch) {
		Interface.footerText.innerText = "Tap with two fingers to pause";
		Interface.footerTypeKeyboard = false;
		Interface.footerTypeTouch = true;
	}
	evt.preventDefault();
	return false;
};

function handleTouchMove(evt) {
	if (!xDown || !yDown) {
		return;
	}

	var xUp = evt.touches[0].clientX;
	var yUp = evt.touches[0].clientY;

	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	let length = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

	if (length > 10) {
		// check angle
		let angle = Math.atan2(yDiff, xDiff) * (180 / Math.PI);
		let isValidAngle = (-30 < angle && angle < 30)
			|| (-120 < angle && angle < -60)
			|| (60 < angle && angle < 120)
			|| (150 < angle && angle <= 180)
			|| (-180 <= angle && angle < -150);
		if (isValidAngle) {
			let oldDirection = undefined;
			for(let item of QueuedInput.list) {
				oldDirection = item;
			}
			if(undefined === oldDirection) {
				oldDirection = Snake.currentDirection;
			}
			let newDirection = undefined;
			if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
				if (xDiff > 0) {
					newDirection = Direction.LEFT;
				} else {
					newDirection = Direction.RIGHT;
				}
			} else {
				if (yDiff > 0) {
					newDirection = Direction.UP;
				} else {
					newDirection = Direction.DOWN;
				}
			}

			let definedResult = undefined != newDirection;
			let validCommand = true;
			if(undefined != oldDirection) {
				let magnitude = Math.abs(newDirection - oldDirection);
				if(magnitude === Math.PI || magnitude === 0) {
					validCommand = false;
				}
			}
			if (definedResult && validCommand) {
				QueuedInput.list.push(newDirection);
			}
		}
	}
	/* reset values */
	xDown = null;
	yDown = null;
	setTimeout(function () {
		if (xDown === null && yDown === null) {
			xDown = this.lastUpX;
			yDown = this.lastUpY;
		}
	}.bind({ 'lastUpX': xUp, 'lastUpY': yUp, }), 25);
	evt.preventDefault();
	return false;
};

function emptyTouchStart(evt) {
	evt.preventDefault();
	return false;
}

function emptyTouchEnd(evt) {
	evt.preventDefault();
	return false;
}