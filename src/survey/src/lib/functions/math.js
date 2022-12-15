"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Average = exports.Divide = exports.Diff = exports.Multiply = exports.Sum = void 0;
const functions_1 = require("./functions");
/**
 * Thi function returns the sum of all the element of args
 * @param args the number to sum
 * @returns the sum
 */
function Sum(...args) {
    if (args instanceof Array && args.length > 0) {
        let r = 0;
        for (let i = 0; i < args.length; i++) {
            if (!isNaN(args[i]))
                r += args[i];
        }
        return r;
    }
}
exports.Sum = Sum;
/**
 * This function returns the product of all the numbers in args
 * @param args the number to multiply
 * @returns the product
 */
function Multiply(...args) {
    if (args instanceof Array && args.length > 0) {
        let r = 0;
        for (let i = 0; i < args.length; i++) {
            if (!isNaN(args[i]))
                r = (r !== 0 ? r : 1) * args[i];
        }
        return r;
    }
}
exports.Multiply = Multiply;
/**
 * This function computes the difference between the first number and the second number in the array,to the result is subtracted the third number and so on.
 * @param args the numbers
 * @returns the difference
 */
function Diff(...args) {
    if (args instanceof Array && args.length > 0 && !isNaN(args[0])) {
        let r = args[0];
        for (let i = 1; i < args.length; i++) {
            if (!isNaN(args[i]))
                r -= args[i];
        }
        return r;
    }
}
exports.Diff = Diff;
/**
 * This function computes the quotient between the first number and the second number in the array, the result is divided by the third number and so on.
 * @param args the numbers
 * @returns the quotient
 */
function Divide(...args) {
    if (args instanceof Array && args.length > 0 && !isNaN(args[0])) {
        let r = args[0];
        for (let i = 1; i < args.length; i++) {
            if (!isNaN(args[i]))
                r /= args[i];
        }
        return r;
    }
}
exports.Divide = Divide;
/**
 * This function retuns the average of args
 * @param args the numbers
 * @returns the average
 */
function Average(...args) {
    if (args && args.length > 0) {
        let s = 0;
        let n = 0;
        for (let i = 0; i < args.length; i++) {
            if (!isNaN(args[i])) {
                s += args[i];
                n++;
            }
        }
        return s / n;
    }
}
exports.Average = Average;
functions_1.registerFn(Sum, 'sum');
functions_1.registerFn(Multiply, 'mul');
functions_1.registerFn(Diff, 'diff');
functions_1.registerFn(Divide, 'div');
functions_1.registerFn(Average, 'avg');
//# sourceMappingURL=math.js.map