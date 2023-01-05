"use strict";
// map to all operations, functions, constants
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbols = exports.Constants = exports.Functions = exports.Operations = void 0;
var Associativity;
(function (Associativity) {
    Associativity[Associativity["LeftToRight"] = 0] = "LeftToRight";
    Associativity[Associativity["RightToLeft"] = 1] = "RightToLeft";
})(Associativity || (Associativity = {}));
;
/**
 * Creates an operation function with assigned precedence and associativity
 * @param op
 * @param precedence
 * @param associativity
 * @returns
 */
function Operation(op, precedence, associativity) {
    return Object.assign(op, {
        precedence,
        associativity
    });
}
exports.Operations = {
    // arithmetic
    '*': Operation((x, y) => x * y, 12, 0),
    '/': Operation((x, y) => x / y, 12, 0),
    '%': Operation((x, y) => x % y, 12, 0),
    '+': Operation((x, y) => x + y, 11, 0),
    '-': Operation((x, y) => x - y, 11, 0),
    // logical
    '>': Operation((x, y) => x > y, 9, 0),
    '<': Operation((x, y) => x < y, 9, 0),
    '>=': Operation((x, y) => x >= y, 9, 0),
    '<=': Operation((x, y) => x <= y, 9, 0),
    // equality
    '==': Operation((x, y) => x == y, 8, 0),
    '!=': Operation((x, y) => x != y, 8, 0),
    // // bitwise
    // '&': (x, y) => x & y,
    // '^': (x, y) => x ^ y,
    // '|': (x, y) => x | y,
    // logical
    '&&': Operation((x, y) => x && y, 4, 0),
    '||': Operation((x, y) => x || y, 3, 0),
    // // ternary ? :
};
exports.Functions = {
    abs: Math.abs,
    log: Math.log,
    pow: Math.pow,
    sqrt: Math.sqrt,
    min: Math.min,
    max: Math.max
};
exports.Constants = {};
exports.Symbols = {};
// const Engine = Object.assign({}, Operations, Functions, Constants);
//# sourceMappingURL=engine.js.map