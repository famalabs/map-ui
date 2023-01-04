"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = exports.execute = exports.validate = exports.call = exports.compute = exports.resolve = exports.ExecutionError = void 0;
const operators = {
    // arithmetic
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
    // logical
    '>': (x, y) => x > y,
    '<': (x, y) => x < y,
    '>=': (x, y) => x >= y,
    '<=': (x, y) => x <= y,
    '==': (x, y) => x === y,
    '!=': (x, y) => x !== y,
    '&&': (x, y) => x && y,
    '||': (x, y) => x || y,
};
class ExecutionError extends Error {
}
exports.ExecutionError = ExecutionError;
/**
 * Resolves ExpressionValue
 * @param st
 * @param ctx
 * @returns
 */
function resolve(st, ctx) {
    switch (st.type) {
        case 'v':
            return st.value;
        case 'id':
            return ctx[st.name]; // global
        case 'exp':
            return compute(st, ctx);
        case 'call':
            return call(st, ctx);
    }
    throw new ExecutionError();
}
exports.resolve = resolve;
/**
 * Computes Expression
 * @param exp
 * @param ctx
 * @returns
 */
function compute(exp, ctx) {
    const op = operators[exp.operator];
    if (!op)
        throw new ExecutionError();
    const left = resolve(exp.left, ctx);
    const right = resolve(exp.right, ctx);
    return op(left, right);
}
exports.compute = compute;
/**
 * Call function
 * @param exp
 * @param ctx
 * @returns
 */
function call(exp, ctx) {
    const fn = resolve(exp.call, ctx);
    if (!fn)
        throw new ExecutionError();
    const args = exp.arguments.map((arg) => resolve(arg, ctx));
    // should not call if validating
    return fn.apply(null, args);
}
exports.call = call;
function validate(statement) {
    resolve(statement, {});
}
exports.validate = validate;
function execute(statement, ctx) {
    return resolve(statement, ctx);
}
exports.execute = execute;
// TODO: implement instance methods
class AST {
    constructor() {
        this._global = {};
    }
    validate(statement) {
        this._validating = true;
        resolve(statement, {});
    }
    execute(statement, ctx) {
        this._validating = false;
        return resolve(statement, ctx);
    }
}
exports.AST = AST;
//# sourceMappingURL=ast.js.map