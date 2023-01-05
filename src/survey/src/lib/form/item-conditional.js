"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemConditional = void 0;
const computable_1 = require("./computable");
/**
 *
 */
class ItemConditional extends computable_1.Computable {
    constructor(data) {
        super(data);
    }
    get expression() {
        return this._data.expression;
    }
    set expression(value) {
        this._data.expression = value;
    }
    /**
     * Checks if item is active: if so its hierarchy will be visible, otherwise it won't.
     * @returns true if the item is active, false otherwise
     * @override
     */
    isActive() {
        try {
            return !!this.compute();
        }
        catch (err) {
            return false;
        }
    }
    /**
     * @override
     */
    isValid() {
        if (!super.isValid())
            return false;
        try {
            this._compute([]);
        }
        catch (err) {
            return false;
        }
        return true;
    }
    _compute(params) {
        const ctx = this.parameters.reduce((obj, parameter, index) => {
            const value = params && params[index];
            obj[parameter] = value;
            return obj;
        }, {});
        return this._resolver.executor.execute(this.expression, ctx);
    }
    /**
     * @override
     */
    toJSON() {
        const schema = super.toJSON();
        schema.expression = this.expression;
        return schema;
    }
}
exports.ItemConditional = ItemConditional;
ItemConditional.TYPE = 'cond';
//# sourceMappingURL=item-conditional.js.map