import { DBAnswer, DBSchema } from '../db';
import { FormItem } from './form-item';
export interface ComputableData extends DBSchema {
    /**
     * The ids of the item parameters
     */
    parameters: string[];
}
export declare abstract class Computable<TResult> extends FormItem {
    protected _data: ComputableData;
    /**
     * Cached result of the computation
     */
    protected _result: TResult;
    get result(): TResult;
    get parameters(): string[];
    set parameters(value: string[]);
    constructor(data: Partial<ComputableData>);
    /**
     * Resolves parameters and returns result of computation
     * @returns
     */
    compute(): TResult;
    /**
     * Invokes computation
     * @param params resolved parameters
     * @return result
     */
    abstract _compute(params: any[]): TResult;
    /**
     * Checks if all parameters are valid items
     * @returns {boolean} true if params are valid false otherwise
     */
    hasValidParams(): boolean;
    /**
     * Gets the list of resolved parameters
     * @returns
     */
    params(): any[];
    /**
     * Resolves a parameter returning its score
     * @param parameter
     * @returns parameter value
     */
    protected resolve(parameter: string): any;
    /**
     * @override
     */
    isValid(): boolean;
    /**
     * @override
     */
    toJSON(): ComputableData;
    /**
     * @override
     */
    isSubmitted(): boolean;
    /**
     * @override
     */
    reset(): void;
    /**
     * @override
     * @returns the serialization of the result
     */
    getAnswer(): DBAnswer;
}
