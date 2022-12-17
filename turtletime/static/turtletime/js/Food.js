const Food = {};
Food.foodItems = [];
Food.foodItemsToBounce = [];
Food.createFoodsForLevel = function (level) {
    let currentTime = new Date(frameTime);
    let typeArray = [];
    for (let i = 0; i < level.finishTimes.length; i++) {
        if (i < level.amountGood) {
            typeArray.push('good');
        } else {
            typeArray.push('bad');
        }
    }
    typeArray = ArrayUtilities.shuffleArray(typeArray);
    for (let i = 0; i < level.finishTimes.length; i++) {
        let finishTime = level.finishTimes[i];
        let type = typeArray[i];
        let startPercent = (Math.random() * (level.startPoint.max - level.startPoint.min)) + level.startPoint.min;
        let duration = (Math.random() * (level.duration.max - level.duration.min)) + level.duration.min;

        let endTime = new Date(currentTime.getTime() + (finishTime * 1000))
        let startTime = new Date(endTime.getTime() - (duration * 1000));

        Food.foodItems.push({ 'type': type, 'startTime': startTime, 'lifeTime': duration, 'startPercentX': startPercent, 'enteredMouth': false, });
        currentTime = new Date(endTime);
    }
}

const PI_DIVIDED_BY_TWO = (Math.PI / 2);
const length = 40;

Food.calculateFoodPosition = function (centerX) {
    const lengthToTravel = Turtle.canvas.height - 200;
    const percentageItIsEaten = (lengthToTravel + length) / lengthToTravel;
    let itemsLeft = [];
    while (Food.foodItems.length != 0) {
        let item = Food.foodItems.pop();
        let timeDiff = (frameTime - item.startTime) / 1000;
        let percentage = timeDiff / item.lifeTime;
        item.foodX = (centerX - (length / 2)) + ((item.startPercentX - 0.5) * Turtle.canvas.width * (1 - (percentage / percentageItIsEaten)));
        item.foodY = (lengthToTravel * percentage) - 40;
        if (percentage < 1) {
            itemsLeft.push(item);
        } else if (1 <= percentage && percentage <= percentageItIsEaten) {
            if (Turtle.isFrozen() || (!Turtle.isOpen && !('good' === item.type && item.enteredMouth))) {
                item.startTime = frameTime;
                item.angle = ((item.startPercentX - 0.5) * PI_DIVIDED_BY_TWO) + PI_DIVIDED_BY_TWO;
                item.startX = item.foodX;
                item.startY = item.foodY;
                Food.foodItemsToBounce.push(item);
            } else {
                item.enteredMouth = true;
                itemsLeft.push(item);
            }
        } else {
            if ('good' === item.type) {
                Game.eatCount++;
            } else {
                Turtle.freezeTime = frameTime;
            }
        }
    }
    Food.foodItems = itemsLeft.reverse();
    let itemsToBounce = [];
    while (Food.foodItemsToBounce.length != 0) {
        let item = Food.foodItemsToBounce.pop();
        let timeDiff = (frameTime - item.startTime) / 1000;
        let percentage = timeDiff / item.lifeTime;
        item.foodX = item.startX + (lengthToTravel * Math.cos(item.angle) * percentage);
        item.foodY = item.startY - (lengthToTravel * Math.sin(item.angle) * percentage);
        item.alphaChannel = 1 - (percentage * 2);
        if (0 <= percentage && percentage <= 1) {
            itemsToBounce.push(item);
        }
    }
    Food.foodItemsToBounce = itemsToBounce.reverse();
}

Food.drawFood = function () {
    for (let item of Food.foodItems) {
        context.fillStyle = Food.getItemColor(item);
        context.fillRect(item.foodX, item.foodY, 40, 40);
    }
    for (let item of Food.foodItemsToBounce) {
        context.fillStyle = Food.getBouncedItemColor(item, item.alphaChannel);
        context.fillRect(item.foodX, item.foodY, 40, 40);
    }
}

Food.getItemColor = function (item) {
    if ('good' === item.type) {
        return 'rgb(171, 0, 0)';
    } else {
        return 'rgb(150, 150, 150)';
    }
}

Food.getBouncedItemColor = function (item, percentage) {
    if ('good' === item.type) {
        return 'rgba(171, 0, 0, ' + percentage + ')';
    } else {
        return 'rgba(150, 150, 150, ' + percentage + ')';
    }
}