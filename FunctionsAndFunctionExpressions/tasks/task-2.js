/* Task description */
/*
 Write a function that finds all the prime numbers in a range
 1) it should return the prime numbers in an array
 2) it must throw an Error if any on the range params is not convertible to `Number`
 3) it must throw an Error if any of the range params is missing
 */

function solve() {
    return function findPrimes(from, to) {
        var number,
            sqrt,
            isPrime,
            i,
            primes = [];

        function isNumber(n) {
            return !isNaN(n) && isFinite(n);
        }

        if (to == undefined) {
            throw new TypeError('findPrimes takes 2 numbers')
        }

        from = Math.ceil(from);
        to = Math.floor(to);

        if (!(isNumber(from) && isNumber(to))) {
            throw new TypeError('from and to must be numbers');
        }

        for (number = from; number <= to; number += 1) {
            if (number < 2) {
                continue;
            }

            isPrime = true;
            sqrt = Math.sqrt(number);

            for (i = 2; i <= sqrt; i += 1) {
                if (!(number % i)) {
                    isPrime = false;
                }
            }

            if (isPrime) {
                primes.push(number);
            }
        }
        return primes;
    }
}


module.exports = findPrimes;
