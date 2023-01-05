"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.Calculator = void 0;
const parser_1 = require("./parser");
class Calculator {
    constructor(formula) {
        const { text, params } = formula;
        this.text = text;
        this.params = params || [];
        this.executor = parser_1.compile(text);
        // check params match executor
    }
    compute(args) {
        const values = this.validate(args);
        const result = this.executor(values);
        return result;
    }
    validate(args) {
        const { params } = this;
        const exec_args = {};
        for (let i = 0; i < params.length; i++) {
            const { name, metric, values, optional } = params[i];
            const x = args && args[name];
            if (values) {
                const e = values[x];
                if (e) {
                    exec_args[name] = e.value;
                }
                else {
                    // error invalid enum value
                }
            }
            else if (metric) {
                const [j, v] = x instanceof Array ? x : [0, x];
                // assert v null or number
                const m = metric[j];
                if (m) {
                    if (typeof v !== 'number' && !optional) {
                        // error not optional
                    }
                    if (typeof m.min === 'number' && (v < m.min)) {
                        // error min
                    }
                    if (typeof m.max === 'number' && (v > m.max)) {
                        // error max
                    }
                    exec_args[name] = v;
                }
                else {
                    // error invalid metric
                }
            }
            else {
                // invalid formula param
            }
        }
        return exec_args;
    }
}
exports.Calculator = Calculator;
class ValidationError extends Error {
    // arg
    // param
    constructor(msg) {
        super(msg);
        Error.captureStackTrace(this, ValidationError);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=calculator.js.map