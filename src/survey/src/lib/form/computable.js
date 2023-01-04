"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Computable = void 0;
const form_item_1 = require("./form-item");
class Computable extends form_item_1.FormItem {
    constructor(data) {
        super(data);
        this.parameters = this.parameters instanceof Array ? this.parameters : [];
    }
    get result() {
        return this._result;
    }
    get parameters() {
        return this._data.parameters;
    }
    set parameters(value) {
        this._data.parameters = value;
    }
    /**
     * Resolves parameters and returns result of computation
     * @returns
     */
    compute() {
        const params = this.params();
        // can't compute if a parameter is unresolved
        if (!(params instanceof Array) || params.includes(undefined))
            this._result = undefined;
        else
            this._result = this._compute(params);
        return this._result;
    }
    /**
     * Checks if all parameters are valid items
     * @returns {boolean} true if params are valid false otherwise
     */
    hasValidParams() {
        if (!(this.parameters instanceof Array))
            return false;
        const parent = this.parent();
        const dependencies = [];
        for (const id of this.parameters) {
            const item = this.get(id);
            if (!item)
                return false;
            if (!(item instanceof form_item_1.FormItem))
                return false;
            if (item.parent() !== parent)
                return false;
            if (item instanceof Computable) {
                dependencies.push(item);
            }
        }
        const check = {};
        while (dependencies.length > 0) {
            const item = dependencies.shift();
            if (item.id === this.id) {
                // circular dependency
                return false;
            }
            if (check[item.id])
                continue;
            check[item.id] = true;
            const deps = item.parameters
                .map((id) => item.get(id))
                .filter((x) => x instanceof Computable);
            Array.prototype.push.apply(dependencies, deps);
        }
        return true;
    }
    /**
     * Gets the list of resolved parameters
     * @returns
     */
    params() {
        const params = [];
        if (this.parameters instanceof Array) {
            for (const id of this.parameters) {
                const value = this.resolve(id);
                params.push(value);
            }
        }
        return params;
    }
    /**
     * Resolves a parameter returning its score
     * @param parameter
     * @returns parameter value
     */
    resolve(parameter) {
        const item = this.get(parameter);
        return form_item_1.getScore(item);
    }
    /**
     * @override
     */
    isValid() {
        if (!super.isValid())
            return false;
        if (!this.hasValidParams())
            return false;
        return true;
    }
    /**
     * @override
     */
    toJSON() {
        const schema = super.toJSON();
        schema.parameters = this.parameters;
        return schema;
    }
    /**
     * @override
     */
    isSubmitted() {
        return this.result !== undefined;
    }
    /**
     * @override
     */
    reset() {
        this._result = undefined;
    }
    /**
     * @override
     * @returns the serialization of the result
     */
    getAnswer() {
        return {
            id: this.id,
            answer: undefined,
            score: this.compute(), // FIX this
        };
    }
}
exports.Computable = Computable;
//# sourceMappingURL=computable.js.map