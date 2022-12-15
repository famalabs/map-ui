"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalItem = exports.ConditionalItemException = void 0;
const engine_1 = require("../engine");
class ConditionalItemException extends Error {
}
exports.ConditionalItemException = ConditionalItemException;
const operations = {
    '>': (x, y) => typeof x === typeof y && x > y,
    '<': (x, y) => typeof x === typeof y && x < y,
    '>=': (x, y) => typeof x === typeof y && x >= y,
    '<=': (x, y) => typeof x === typeof y && x <= y,
    '==': (x, y) => typeof x === typeof y && x === y,
    '!=': (x, y) => typeof x === typeof y && x !== y,
    '&&': (x, y) => typeof x === 'boolean' && typeof y === 'boolean' && x && y,
    '||': (x, y) => (typeof x === 'boolean' && typeof y === 'boolean' && x) || y,
};
/**
 * This class represent a branch item: an item whose children interaction can be activated or disactivated depending on certain conditions.
 */
class ConditionalItem extends engine_1.Item {
    constructor(data) {
        super(data);
        if (data.operator !== undefined)
            this.operator = data.operator;
        if (data.params !== undefined)
            this.params = data.params;
        if (data.value !== undefined)
            this.value = data.value;
        data.forAll ? (this.forAll = true) : (this.forAll = false); //if data.forAll is undefined, this.forAll defaults to false
    }
    /**
     * This method check whether the item is active: if so its hierarchy will be visible, otherwise it won't.
     * @returns true if the item is active, false otherwise
     * @override
     */
    isActive() {
        if (!this.operator || !this.params)
            return true; //active
        const fn = operations[this.operator];
        if (this.value !== undefined) {
            let total_result;
            //compare each param with value
            for (const i in this.params) {
                const res = fn(this.value, this.params[i]);
                if (total_result === undefined)
                    total_result = res;
                if (!this.forAll && res)
                    return false; //property true for one el when forAll is false -> not active
                if (this.forAll && !res)
                    return true; //property false for one el when forAll is true -> active
                total_result = total_result && res;
            }
            //only when
            //  - forAll = true and all item are true
            //  - forAll = false and all item are false
            return !total_result;
        }
        if (!fn)
            return true;
        if (this.params.length !== 2)
            return true;
        return !fn(...this.params); //not active if fn is true
    }
    /**
     * @override
     */
    isValid() {
        if (!this.isActive())
            return true;
        return super.isActive();
    }
    /**
     * @ovverride
     */
    getSchema() {
        const schema = super.getSchema();
        schema.operator = this.operator;
        schema.params = this.params;
        schema.value = this.value;
        schema.forAll = this.forAll;
        return schema;
    }
}
exports.ConditionalItem = ConditionalItem;
ConditionalItem.TYPE = 'cond';
//# sourceMappingURL=conditional-item.js.map