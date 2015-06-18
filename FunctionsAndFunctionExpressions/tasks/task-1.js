/* Task Description */
/* 
 Write a function that sums an array of numbers:
 numbers must be always of type Number
 returns `null` if the array is empty
 throws Error if the parameter is not passed (undefined)
 throws if any of the elements is not convertible to Number

 */
function solve() {
    return function sum(arr) {

        if (arr == undefined || arr.constructor !== Array) {
            throw new TypeError('arr must be an Array');
        }

        if (arr.length === 0) {
            return null;
        }

        return arr.reduce(function (prev, current) {
            current = parseFloat(current);
            if (isNaN(current)) {
                throw new TypeError('The values in arr must be numbers');
            }
            return prev + current;
        }, 0);
    }
}

module.exports = sum;