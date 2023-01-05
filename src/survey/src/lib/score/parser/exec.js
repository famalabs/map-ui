"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecNode = void 0;
const engine_1 = require("./engine");
const context_1 = require("./context");
const errors_1 = require("./errors");
class ExecNode {
    constructor(ctx, str) {
        this.ctx = ctx;
        this.str = str;
        this.args = [];
    }
    compile() {
        switch (this.ctx) {
            case context_1.ParseContext.Number:
                const n = Number(this.str);
                // check valid number
                return ValueExecutor(n);
            case context_1.ParseContext.Operator:
                const op = engine_1.Operations[this.str];
                // check valid operation
                const fns = this.args.map(node => node.compile());
                return OperationExecutor(op, fns);
            case context_1.ParseContext.Param:
                const p = this.str.substring(1);
                return ParamExecutor(p);
            case context_1.ParseContext.Function:
                if (this.args.length === 1 && this.args[0].ctx === context_1.ParseContext.Close) {
                    const scope = this.args[0];
                    const fn = engine_1.Functions[this.str];
                    if (!fn) {
                        throw new Error('invalid function');
                    }
                    if (fn.length !== scope.args.length) {
                        throw new Error('invalid function arguments');
                    }
                    const params = scope.args.map(p => p.compile());
                    return OperationExecutor(fn, params);
                }
                else if (this.args.length === 0) {
                    const k = this.str;
                    if (!(k in engine_1.Constants)) {
                        throw new errors_1.UndefinedSymbolError(k);
                    }
                    const v = engine_1.Constants[this.str];
                    return ValueExecutor(v);
                }
                else {
                    throw new Error('invalid function scope');
                }
            case context_1.ParseContext.Close:
                if (this.args.length !== 1) {
                    throw new Error('scope must have one arg');
                }
                return this.args[0].compile();
        }
        throw new errors_1.ExecutionError('not implemented', this.str, this.ctx);
    }
}
exports.ExecNode = ExecNode;
function ValueExecutor(v) {
    return function value(args) {
        return v;
    };
}
function ParamExecutor(p) {
    return function param(args) {
        if (!(p in args))
            throw new errors_1.UndefinedSymbolError(p);
        const v = args[p];
        // check valid param
        return v;
    };
}
function OperationExecutor(op, fns) {
    return function operation(args) {
        return op.apply(null, fns.map(fn => fn(args)));
    };
}
//# sourceMappingURL=exec.js.map