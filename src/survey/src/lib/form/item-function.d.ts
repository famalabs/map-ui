import { Computable, ComputableData } from './computable';
/**
 * Data used to serialize an instance of ItemFunction
 */
export interface ItemFunctionData extends ComputableData {
    /**
     * The name used to register the function to use as fnCompute
     */
    fnCompute?: string;
    /**
     * The name used to register the function to use as fnReduce
     */
    fnReduce?: string;
    /**
     * The name used to register the function to use as fnInit
     */
    fnInit?: string;
}
export declare enum FunctionType {
    Compute = "Compute",
    Reduce = "Reduce",
    Init = "Init"
}
export declare enum FunctionMode {
}
/**
 * Item that computes functions based on parameters
 * NOTE: parameters are not children
 */
export declare class ItemFunction<TResult = any> extends Computable<TResult> implements Required<ItemFunctionData> {
    static readonly TYPE: string;
    protected _data: ItemFunctionData;
    protected _fn: Record<FunctionType, Function>;
    /**
     * Function used for direct computation
     */
    get fnCompute(): string;
    /**
     * Function used for reduce
     */
    get fnReduce(): string;
    /**
     * Function used to initialize the default value for the reduce function
     */
    get fnInit(): string;
    constructor(data: Partial<ItemFunctionData>);
    /**
     * This method sets 'Compute' , 'Reduce' or 'Init' as fn, storing its name
     * @param fn the function to exec as fnCompute, fnReduce or fnInit
     * @param fnName the name fn is registered with
     */
    setFn(fn: FunctionType, fnName: string): void;
    getFn(fn: FunctionType): Function;
    /**
     * Computes the result according to the function mode
     */
    _compute(params: any[]): TResult;
    /**
     * @override
     */
    toJSON(): ItemFunctionData;
    /**
     *
     * @override
     * @returns true if it is valid, false otherwise
     */
    isValid(): boolean;
}
