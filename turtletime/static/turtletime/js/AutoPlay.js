const AutoPlay = {};
AutoPlay.run = function () {
    let anyItems = false;
    for (let item of Food.foodItems) {
        let timeDiff = (frameTime - item.startTime) / 1000;
        let percentage = timeDiff / item.lifeTime;
        if (0.98 < percentage && percentage < 1.02) {
            if ('good' === item.type) {
                Turtle.isOpen = true;
                anyItems = true;
            }
        }
    }
    if (!anyItems) {
        Turtle.isOpen = false;
    }
}