"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemFunction = void 0;
const functions_1 = require("../functions");
const computable_1 = require("./computable");
/**
 * Item that computes functions based on parameters
 */
class ItemFunction extends computable_1.Computable {
    constructor(data) {
        super(data);
        this.setFn(this.fn);
    }
    get fn() {
        return this._data.fn;
    }
    getFn() {
        return this._fn;
    }
    setFn(value) {
        this._data.fn = value;
        this._fn = functions_1.getFn(value);
    }
    /**
     * Computes the result according to the function mode
     * @param params
     * @returns
     */
    _compute(params) {
        const fn = this._fn;
        if (typeof fn === 'function') {
            return fn.apply(null, params);
        }
        return undefined;
    }
    /**
     * @override
     */
    toJSON() {
        const schema = super.toJSON();
        schema.fn = this.fn;
        return schema;
    }
    /**
     * @override
     */
    isValid() {
        if (!super.isValid())
            return false;
        if (this.fn === undefined)
            return false;
        return true;
    }
}
exports.ItemFunction = ItemFunction;
ItemFunction.TYPE = 'fn';
//# sourceMappingURL=item-function.js.map