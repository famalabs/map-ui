"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemConditional = void 0;
const ast_1 = require("./ast");
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
            ast_1.validate(this.expression);
        }
        catch (err) {
            return false;
        }
        return true;
    }
    _compute(params) {
        params = params.reduce((obj, value, index) => {
            const parameter = this.parameters[index];
            obj[parameter] = value;
            return obj;
        }, {});
        this._result = ast_1.execute(this.expression, params);
        return this._result;
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