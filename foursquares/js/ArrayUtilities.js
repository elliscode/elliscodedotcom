const ArrayUtilities = [];
// code taken from here https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
ArrayUtilities.shuffleArray = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array;
}

ArrayUtilities.sum = function (array) {
    let output = 0;
    for (let item of array) {
        output += item;
    }
    return output;
}