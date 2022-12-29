"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFn = exports.getFn = void 0;
/**
 * This function returns the function registered with fnName
 * @param fnName the name used to register the function
 * @returns the function registered with fnName or null if none is found
 */
function getFn(fnName) {
    if (typeof functions[fnName] === 'function')
        return functions[fnName];
}
exports.getFn = getFn;
/**
 * This function registers a new function with the specified name
 * @param fn the function to register
 * @param fnName the name to use
 */
function registerFn(fn, ...fnName) {
    for (const name of fnName) {
        // if (typeof functions[fnName] !== 'function') {
        functions[name] = fn;
        // }
    }
}
exports.registerFn = registerFn;
const functions = Object.assign({}, Math);
registerFn(Object, 'Object');
registerFn(Array, 'Array');
registerFn(Number, 'Number');
//# sourceMappingURL=functions.js.map