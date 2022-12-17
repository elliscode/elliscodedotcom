const Snake = {};
Snake.lastMovedTimeStamp = new Date();
Snake.pause = false;
Snake.dead = false;
Snake.won = false;
Snake.killAnimationFrame = false;
Snake.framePeriod = 200; // ms
Snake.startGame = function () {
	Snake.pause = false;
	Snake.dead = false;
	Snake.won = false;
	Snake.killAnimationFrame = false;
	Snake.lastMovedTimeStamp = new Date();
	while (QueuedInput.list.shift() != undefined) {
		// keep popping the list until its empty
	}
	Snake.clear();
	Interface.hidePopup();
	Snake.increaseLength();
	GameBoard.movePellet();
	Snake.isAutoPlayOn = false;
	setTimeout(function () {
		Snake.createListeners();
		QueuedInput.createListeners();
	}, 200);
	Interface.headerDiv.style.display = 'block';
}

Snake.mainMenu = function () {
	Snake.pause = false;
	Snake.dead = false;
	Snake.won = false;
	Snake.killAnimationFrame = false;
	Snake.lastMovedTimeStamp = new Date();
	while (QueuedInput.list.shift() != undefined) {
		// keep popping the list until its empty
	}
	Snake.clear();
	Interface.hidePopup();
	Interface.displayPopup('menu');
	Snake.increaseLength();
	GameBoard.movePellet();
	setTimeout(function () {
		Snake.createListeners();
	}, 200);
	Interface.headerDiv.style.display = 'none';
	QueuedInput.list.push(Direction.RIGHT);
	Snake.isAutoPlayOn = true;
	GameBoard.removePellet();
	for (let i = 0; i < 5; i++) {
		Snake.increaseLength()
	}
}

Snake.clear = function () {
	Snake.parts = [];
	Snake.currentDirection = undefined;
}

Snake.pauseGame = function () {
	Snake.pause = true;
	QueuedInput.removeListeners();
	Interface.displayPopup('pause');
	document.addEventListener('keydown', QueuedInput.resumeHandler);
}

Snake.resumeGame = function () {
	Snake.pause = false;
	Snake.lastMovedTimeStamp = new Date();
	while (QueuedInput.list.shift() != undefined) {
		// keep popping the list until its empty
	}
	Interface.hidePopup();
	QueuedInput.createListeners();
}

Snake.createListeners = function () {
	Snake.setDirection();
}

Snake.createSnake = function () {
	Snake.currentDirection = undefined;
	Snake.parts = [];
	Snake.isAutoPlayOn = false;
}

Snake.move = function () {
	let head = Snake.popTailAndMoveToFront();
	if (head === undefined) {
		return;
	}

	// check if you hit anything and died
	let currentParts = new Map();
	for (let part of Snake.parts) {
		if (!currentParts.has(part.xPosition)) {
			currentParts.set(part.xPosition, []);
		}
		currentParts.get(part.xPosition).push(part.yPosition);
	}
	Snake.parts.unshift(head);
	if (currentParts.has(head.xPosition)
		&& currentParts.get(head.xPosition).indexOf(head.yPosition) > -1) {
		Snake.die();
	}

	// check if you are outside the map bounds
	if (!(0 <= head.xPosition && head.xPosition < GameBoard.width)) {
		Snake.die();
	}
	if (!(0 <= head.yPosition && head.yPosition < GameBoard.height)) {
		Snake.die();
	}
	// check if you ate anything
	for (let part of Snake.parts) {
		if (GameBoard.pelletX === part.xPosition
			&& GameBoard.pelletY === part.yPosition) {
			Snake.increaseLength();
			GameBoard.movePellet();
			break;
		}
	}
}

Snake.popTailAndMoveToFront = function () {
	let x = 0;
	let y = 0;
	if (Snake.currentDirection === Direction.UP) {
		y -= 1;
	} else if (Snake.currentDirection === Direction.DOWN) {
		y += 1;
	} else if (Snake.currentDirection === Direction.LEFT) {
		x -= 1;
	} else if (Snake.currentDirection === Direction.RIGHT) {
		x += 1;
	} else {
		return;
	}
	let snakeHead = Snake.parts[0];
	let snakeEnd = Snake.parts.pop();
	snakeEnd.xPosition = snakeHead.xPosition + x;
	snakeEnd.yPosition = snakeHead.yPosition + y;
	return snakeEnd;
}

Snake.increaseLength = function () {
	let newPart = {};
	newPart.xPosition = 0;
	newPart.yPosition = 0;
	for (let part of Snake.parts) {
		newPart.xPosition = part.xPosition;
		newPart.yPosition = part.yPosition;
	}
	this.parts.push(newPart);
	let scoreSpan = document.getElementById('score');
	scoreSpan.innerText = Snake.parts.length - 1;
}

Snake.setDirection = function () {
	GameBoard.draw();
	if (Snake.killAnimationFrame) {
		return;
	}
	let frameTime = new Date();
	if (frameTime - Snake.lastMovedTimeStamp > Snake.framePeriod && !Snake.pause) {
		if (frameTime - Snake.lastMovedTimeStamp > (3 * Snake.framePeriod) && Snake.currentDirection != undefined && !Snake.isAutoPlayOn) {
			Snake.pauseGame();
		} else {
			let value = undefined;
			while (value === undefined && QueuedInput.list.length > 0) {
				value = QueuedInput.list.shift();
			}
			if (undefined != value) {
				Snake.currentDirection = value;
			}
			if (Snake.isAutoPlayOn === true) {
				Snake.autoPlay();
			}
			Snake.move(Snake.currentDirection);
			Snake.lastMovedTimeStamp = frameTime;
		}
	}
	requestAnimationFrame(Snake.setDirection);
}

Snake.autoPlay = function () {
	let head = undefined;
	for (let part of Snake.parts) {
		head = part;
		break;
	}
	if (Snake.currentDirection == Direction.RIGHT
		&& head.xPosition == GameBoard.width - 1) {
		Snake.currentDirection = Direction.DOWN;
		{
			QueuedInput.list.push(Direction.LEFT);
		}
	} else if (Snake.currentDirection == Direction.LEFT
		&& head.xPosition == 0
		&& head.yPosition == (Math.floor(GameBoard.height / 2) * 2) - 1) {
		Snake.currentDirection = Direction.UP;
	} else if (Snake.currentDirection == Direction.LEFT
		&& head.xPosition == 1
		&& head.yPosition != (Math.floor(GameBoard.height / 2) * 2) - 1) {
		Snake.currentDirection = Direction.DOWN;
		{
			QueuedInput.list.push(Direction.RIGHT);
		}
	} else if (Snake.currentDirection == Direction.UP
		&& head.xPosition == 0
		&& head.yPosition == 0) {
		Snake.currentDirection = Direction.RIGHT;
	}
}

Snake.die = function () {
	if (Snake.isAutoPlayOn) {
		for(let i = 0; i < Snake.parts.length; i++) {
			Snake.parts[i].xPosition = 0;
			Snake.parts[i].yPosition = 0;
			Snake.currentDirection = Direction.RIGHT;
		}
	} else {
		QueuedInput.removeListeners();
		Snake.killAnimationFrame = true;
		Snake.dead = true;
		Interface.displayPopup('restart');
		document.addEventListener('keydown', QueuedInput.restartHandler);
	}
}

Snake.win = function () {
	let head = Snake.popTailAndMoveToFront();
	Snake.parts.unshift(head);
	Snake.killAnimationFrame = true;
	Snake.won = true;
}

Snake.setPeriod = function (value) {
	Snake.framePeriod = value;
}