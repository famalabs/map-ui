"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = exports.ExecutionError = void 0;
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
class AST {
    constructor() {
        // protected _operators: Record<Operator, OperatorFn> = operators;
        this._globals = {};
    }
    get globals() {
        return this._globals;
    }
    execute(statement, ctx) {
        ctx = Object.assign({}, this.globals, ctx || {});
        return this.resolve(statement, ctx);
    }
    resolve(st, ctx) {
        switch (st.type) {
            case 'v':
                return st.value;
            case 'id':
                return this.identifier(st, ctx);
            case 'exp':
                return this.compute(st, ctx);
            case 'call':
                return this.invoke(st, ctx);
        }
        throw new ExecutionError();
    }
    /**
     * Compute Expression
     * @param exp
     * @param ctx
     * @returns
     */
    compute(exp, ctx) {
        const op = operators[exp.operator];
        if (!op)
            throw new ExecutionError();
        const left = this.resolve(exp.left, ctx);
        const right = this.resolve(exp.right, ctx);
        return op(left, right);
    }
    /**
     * Call function
     * @param exp
     * @param ctx
     * @returns
     */
    invoke(exp, ctx) {
        const fn = this.resolve(exp.call, ctx);
        if (!(typeof fn === 'function'))
            throw new ExecutionError();
        const args = exp.arguments.map((arg) => this.resolve(arg, ctx));
        return fn.apply(fn, args);
    }
    /**
     * Get identifier in context
     * @param id
     * @param ctx
     * @returns
     */
    identifier(id, ctx) {
        const { name } = id;
        if (name in ctx)
            return ctx[name];
        throw new ExecutionError();
    }
}
exports.AST = AST;
//# sourceMappingURL=ast.js.map