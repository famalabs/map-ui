"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executable = void 0;
/**
 * Class that wraps a function
 */
class Executable {
    constructor(data) {
        this.fn = data.fn;
        this.name = data.name;
        this.required = data.required;
        this.validators = data.validators;
    }
    call(...args) {
        return this.fn.call(this, ...args);
    }
    apply(args) {
        return this.fn.apply(this, args);
    }
    validate(args) {
        if (this.required > 0 && args.length !== this.required)
            return false;
        if (this.validators instanceof Array) {
            for (let i = 0; i < this.validators.length; i++) {
                const v = this.validators[i];
                if (typeof v === 'function') {
                    if (v(args[i], i, args) !== true)
                        return false;
                }
            }
        }
        return true;
    }
}
exports.Executable = Executable;
//# sourceMappingURL=executable.js.map