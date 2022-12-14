"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountIf = void 0;
const functions_1 = require("./functions");
const operators = {
    '>': (x, y) => x > y,
    '<': (x, y) => x < y,
    '>=': (x, y) => x >= y,
    '<=': (x, y) => x <= y,
    '==': (x, y) => x == y,
    '!=': (x, y) => x != y,
};
/**
 * This function compares each element of args with value using the specified comparison operator
 * @param operator the operator used to compare: <, >, ==, !=, >=, <=
 * @param value the value to be compared with each element
 * @param args the elements to compare
 * @returns the number of the elements which satisfied the comparison
 */
function CountIf(operator, value, ...args) {
    const fn = operators[operator];
    if (args instanceof Array && args.length > 0 && fn) {
        let r = 0;
        for (let i = 0; i < args.length; i++) {
            r += Number(fn(args[i], value));
        }
        return r;
    }
}
exports.CountIf = CountIf;
functions_1.registerFn(CountIf, 'CountIf');
//# sourceMappingURL=conditional.js.map