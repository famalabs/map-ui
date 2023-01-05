import { Computable, ComputableData } from './computable';
/**
 * Data used to serialize an instance of ItemFunction
 */
export interface ItemFunctionData extends ComputableData {
    /**
     * The name used to register the function to use as compute
     */
    fn?: string;
}
/**
 * Item that computes functions based on parameters
 */
export declare class ItemFunction<TResult = any> extends Computable<TResult> implements Required<ItemFunctionData> {
    static readonly TYPE: string;
    protected _data: ItemFunctionData;
    protected _fn: Function;
    get fn(): string;
    constructor(data: Partial<ItemFunctionData>);
    getFn(): Function;
    setFn(value: string): void;
    /**
     * Computes the result according to the function mode
     * @param params
     * @returns
     */
    _compute(params: any[]): TResult;
    /**
     * @override
     */
    toJSON(): ItemFunctionData;
    /**
     * @override
     */
    isValid(): boolean;
}
