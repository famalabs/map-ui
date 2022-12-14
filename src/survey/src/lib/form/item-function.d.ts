import { Item } from '../engine';
import { DBAnswer, DBSchema } from '../db';
import { FormItem } from './form-item';
/**
 * Data used to serialize an instance of ItemFunction
 */
export interface ItemFunctionData extends DBSchema {
    /**
     * The name used to register the function to use as fnCompute
     */
    fnCompute?: string;
    /**
     * The name used to register the function to use as fnReducr
     */
    fnReduce?: string;
    /**
     * The name used to register the function to use as fnInit
     */
    fnInit?: string;
    /**
     * The ids of the children on which execute the function(s)
     */
    parameters?: Array<string>;
    /**
     * Additional static parameters
     */
    staticParams?: Array<any>;
}
export declare enum FunctionType {
    Compute = "Compute",
    Reduce = "Reduce",
    Init = "Init"
}
/**
 * Item that computes functions based on parameters
 * NOTE: parameters are not children
 */
export declare class ItemFunction<TResult = any> extends FormItem {
    static readonly TYPE: string;
    protected _data: ItemFunctionData;
    /**
     * The result of the computation
     */
    protected _result: TResult;
    get result(): TResult;
    /**
     * Function used for direct computation
     */
    protected _fnCompute: Function;
    get fnCompute(): Function;
    /**
     * Function used for reduce:
     */
    protected _fnReduce: Function;
    get fnReduce(): Function;
    /**
     * Function used to initialize the default value for the reduce function
     */
    protected _fnInit: Function;
    get fnInit(): Function;
    /**
     * The ids of the children on which the function shall be executed
     */
    get parameters(): string[];
    set parameters(value: string[]);
    /**
     *Additional parameters required
     */
    get staticParams(): any[];
    set staticParams(value: any[]);
    /**
     * Initialize a new ItemFunction
     * @param data used to initialize this
     */
    constructor(data: Partial<ItemFunctionData>);
    /**
     * This method sets 'Compute' , 'Reduce' or 'Init' as fn, storing its name
     * @param fn the function to exec as fnCompute, fnReduce or fnInit
     * @param fnName the name fn is registered with
     */
    setFn(fn: FunctionType, fnName: string): void;
    /**
     * Computes the result according to the functions used as fnCompute alone or fnReduce and fnInit
     * @returns the result of the computation
     */
    compute(): TResult;
    /**
     * @returns the serialization of the result
     */
    getAnswer(): DBAnswer;
    protected get(id: string): Item;
    /**
     * This method checks if all the elements of this.parameters are id of an item in this.items
     * @returns true if params are valid false otherwise
     */
    hasValidParams(): boolean;
    /**
     * Resolves the parameters depending on the respective types
     * @param param index
     * @returns
     */
    protected resolveParams(): any[];
    /**
     * Resolves the value of an item
     * @param item
     * @returns value or undefined
     */
    protected resolve(item: Item): any;
    /**
     * Method to provide the item schema: a schema is the part of the item which never changes.
     * This method is used for serialization.
     * @returns on object representing the schema of the item
     */
    getSchema(): ItemFunctionData;
    /**
     *
     * @returns true if it is valid, false otherwise
     */
    isValid(): boolean;
    reset(): void;
}
