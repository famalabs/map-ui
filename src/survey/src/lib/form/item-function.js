"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemFunction = exports.FunctionType = void 0;
const engine_1 = require("../engine");
const functions_1 = require("../functions");
const question_1 = require("./question");
const form_item_1 = require("./form-item");
var FunctionType;
(function (FunctionType) {
    FunctionType["Compute"] = "Compute";
    FunctionType["Reduce"] = "Reduce";
    FunctionType["Init"] = "Init";
})(FunctionType = exports.FunctionType || (exports.FunctionType = {}));
/**
 * Item that computes functions based on parameters
 * NOTE: parameters are not children
 */
class ItemFunction extends form_item_1.FormItem {
    /**
     * Initialize a new ItemFunction
     * @param data used to initialize this
     */
    constructor(data) {
        super(data);
        if (data.fnCompute) {
            this.setFn(FunctionType.Compute, data.fnCompute);
        }
        else if (data.fnReduce && data.fnInit) {
            this.setFn(FunctionType.Reduce, data.fnReduce);
            this.setFn(FunctionType.Init, data.fnInit);
        }
        this.parameters = this.parameters instanceof Array ? this.parameters : [];
        this.staticParams =
            this.staticParams instanceof Array ? this.staticParams : [];
    }
    get result() {
        return this.result;
    }
    get fnCompute() {
        return this._fnCompute;
    }
    get fnReduce() {
        return this._fnReduce;
    }
    get fnInit() {
        return this._fnInit;
    }
    /**
     * The ids of the children on which the function shall be executed
     */
    get parameters() {
        return this._data.parameters;
    }
    set parameters(value) {
        this._data.parameters = value;
    }
    /**
     *Additional parameters required
     */
    get staticParams() {
        return this._data.staticParams;
    }
    set staticParams(value) {
        this._data.staticParams = value;
    }
    /**
     * This method sets 'Compute' , 'Reduce' or 'Init' as fn, storing its name
     * @param fn the function to exec as fnCompute, fnReduce or fnInit
     * @param fnName the name fn is registered with
     */
    setFn(fn, fnName) {
        if (!FunctionType[fn])
            throw new Error('Invalid FunctionType');
        this._data['fn' + fn] = fnName;
        this['_fn' + fn] = functions_1.getFn(fnName);
    }
    /**
     * Computes the result according to the functions used as fnCompute alone or fnReduce and fnInit
     * @returns the result of the computation
     */
    compute() {
        if (this.parameters instanceof Array) {
            if (typeof this.fnCompute === 'function') {
                const params = this.resolveParams();
                Array.prototype.push.apply(params, this.staticParams);
                const r = this.fnCompute.apply(null, params);
                return (this._result = r);
            }
            if (typeof this.fnReduce === 'function' &&
                typeof this.fnInit === 'function') {
                // FIX: improve readability
                return (this._result = this.parameters.reduce((result, id) => {
                    const item = this.get(id);
                    return this.fnReduce.apply(null, [result, this.resolve(item)].concat(this.staticParams));
                }, this.fnInit()));
            }
        }
        return (this._result = undefined);
    }
    /**
     * @returns the serialization of the result
     */
    getAnswer() {
        return {
            id: this.id,
            answer: undefined,
            score: this.compute(), // FIX this
        };
    }
    get(id) {
        return this.resolver && this.resolver.get(id);
    }
    /**
     * This method checks if all the elements of this.parameters are id of an item in this.items
     * @returns true if params are valid false otherwise
     */
    hasValidParams() {
        if (!(this.parameters instanceof Array))
            return false;
        // if (!(this.parameters.length > 0)) return false;
        for (const id of this.parameters) {
            const item = this.get(id);
            if (!(item instanceof engine_1.Item))
                return false;
        }
        return true;
    }
    /**
     * Resolves the parameters depending on the respective types
     * @param param index
     * @returns
     */
    resolveParams() {
        const params = [];
        for (const id of this.parameters) {
            const item = this.get(id);
            const p = this.resolve(item);
            params.push(p);
        }
        return params;
    }
    /**
     * Resolves the value of an item
     * @param item
     * @returns value or undefined
     */
    resolve(item) {
        if (item instanceof question_1.Question) {
            return item.getScore();
        }
        else if (item instanceof ItemFunction) {
            return item.compute();
        }
        return undefined;
    }
    /**
     * Method to provide the item schema: a schema is the part of the item which never changes.
     * This method is used for serialization.
     * @returns on object representing the schema of the item
     */
    getSchema() {
        const schema = super.getSchema();
        schema.parameters = this.parameters;
        if (this.fnCompute) {
            schema.fnCompute = this._data.fnCompute;
        }
        else if (this.fnReduce && this.fnInit) {
            schema.fnReduce = this.fnReduce && this._data.fnReduce;
            schema.fnInit = this.fnInit && this._data.fnInit;
        }
        if (this.staticParams instanceof Array && this.staticParams.length > 0) {
            schema.staticParams = this.staticParams;
        }
        return schema;
    }
    /**
     *
     * @returns true if it is valid, false otherwise
     */
    isValid() {
        if (!super.isValid())
            return false;
        return this.result !== undefined;
    }
    reset() {
        this._result = undefined;
    }
}
exports.ItemFunction = ItemFunction;
//implements ItemFunctionData { not possible due to type mismatch
ItemFunction.TYPE = 'fn';
//# sourceMappingURL=item-function.js.map