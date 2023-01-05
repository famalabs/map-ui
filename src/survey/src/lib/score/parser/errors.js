"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndefinedSymbolError = exports.ExecutionError = exports.InvalidOperatorError = exports.ContextParseError = exports.ParseError = void 0;
const context_1 = require("./context");
class ParseError extends Error {
    constructor(msg, target, context, index) {
        super(msg);
        this.target = target;
        this.context = context;
        this.index = index;
        Error.captureStackTrace(this, ParseError);
    }
}
exports.ParseError = ParseError;
class ContextParseError extends ParseError {
    constructor(c, ctx, i) {
        const msg = `Invalid character '${c}' at index ${i}`;
        super(msg, c, ctx, i);
        Error.captureStackTrace(this, ContextParseError);
    }
}
exports.ContextParseError = ContextParseError;
class InvalidOperatorError extends ParseError {
    constructor(op, i) {
        const msg = `Invalid operator '${op}'`;
        super(msg, op, context_1.ParseContext.Operator, i);
        Error.captureStackTrace(this, InvalidOperatorError);
    }
}
exports.InvalidOperatorError = InvalidOperatorError;
class ExecutionError extends Error {
    constructor(msg, target, context) {
        super(msg);
        this.target = target;
        this.context = context;
        Error.captureStackTrace(this, ParseError);
    }
}
exports.ExecutionError = ExecutionError;
class UndefinedSymbolError extends ExecutionError {
    constructor(s, ctx) {
        const msg = `Undefined symbol '${s}'`;
        super(msg, s, ctx);
        Error.captureStackTrace(this, UndefinedSymbolError);
    }
}
exports.UndefinedSymbolError = UndefinedSymbolError;
//# sourceMappingURL=errors.js.map