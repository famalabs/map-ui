"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemFunction = exports.FunctionMode = exports.FunctionType = void 0;
const functions_1 = require("../functions");
const computable_1 = require("./computable");
var FunctionType;
(function (FunctionType) {
    FunctionType["Compute"] = "Compute";
    FunctionType["Reduce"] = "Reduce";
    FunctionType["Init"] = "Init";
})(FunctionType = exports.FunctionType || (exports.FunctionType = {}));
var FunctionMode;
(function (FunctionMode) {
})(FunctionMode = exports.FunctionMode || (exports.FunctionMode = {}));
/**
 * Item that computes functions based on parameters
 * NOTE: parameters are not children
 */
class ItemFunction extends computable_1.Computable {
    constructor(data) {
        super(data);
        Object.defineProperty(this, '_fn', {
            value: {},
            enumerable: false,
        });
        if (this.fnCompute) {
            this.setFn(FunctionType.Compute, this.fnCompute);
        }
        else if (this.fnReduce && this.fnInit) {
            this.setFn(FunctionType.Reduce, this.fnReduce);
            this.setFn(FunctionType.Init, this.fnInit);
        }
    }
    /**
     * Function used for direct computation
     */
    get fnCompute() {
        return this._data.fnCompute;
    }
    /**
     * Function used for reduce
     */
    get fnReduce() {
        return this._data.fnReduce;
    }
    /**
     * Function used to initialize the default value for the reduce function
     */
    get fnInit() {
        return this._data.fnInit;
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
        this._fn[fn] = functions_1.getFn(fnName);
    }
    getFn(fn) {
        return this._fn[fn];
    }
    /**
     * Computes the result according to the function mode
     */
    _compute(params) {
        const { Compute, Reduce, Init } = this._fn;
        if (typeof Compute === 'function') {
            const r = Compute.apply(null, params);
            return (this._result = r);
        }
        if (typeof Reduce === 'function' && typeof Init === 'function') {
            let res = Init.apply(null);
            for (const value of params) {
                res = Reduce.apply(null, [res, value]);
            }
            return (this._result = res);
        }
        return (this._result = undefined);
    }
    /**
     * @override
     */
    toJSON() {
        const schema = super.toJSON();
        if (this.fnCompute) {
            schema.fnCompute = this.fnCompute;
        }
        else if (this.fnReduce && this.fnInit) {
            schema.fnReduce = this.fnReduce;
            schema.fnInit = this.fnInit;
        }
        return schema;
    }
    /**
     *
     * @override
     * @returns true if it is valid, false otherwise
     */
    isValid() {
        if (!super.isValid())
            return false;
        if (!this.getFn(FunctionType.Compute) &&
            !(this.getFn(FunctionType.Reduce) && this.getFn(FunctionType.Init)))
            return false;
        return true;
    }
}
exports.ItemFunction = ItemFunction;
ItemFunction.TYPE = 'fn';
//# sourceMappingURL=item-function.js.map