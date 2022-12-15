import { DBSchema } from '../db';
import { Item } from '../engine';
export declare class ConditionalItemException extends Error {
}
/**
 * The operation allowed
 */
export declare type Operator = '>' | '<' | '==' | '>=' | '<=' | '!=' | '&&' | '||' | '!';
/**
 * When multiple parameters present, specify if a property should be true for one or for all elements
 */
export declare type CheckType = 'forAll' | 'forOne';
/**
 * This interface represent the data a BranchItem needs to be created
 */
export interface ConditionalItemData extends DBSchema {
    /**
     * The optional value compared to each element of this.params
     * The order will be: value [operation] this.param[i]
     */
    value?: any;
    /**
     * The optional type of check done when there are multiple parameter to compare with a single value: if true the property must be true for each one, otherwise it is enought one for which the property is true to deactivate the hierarchy
     */
    forAll?: boolean;
    /**
     * The operator which will be performed on this
     */
    operator?: Operator;
    /**
     * The parameters of the operation
     */
    params?: Array<any>;
}
export interface IActivable {
    isActive(): boolean;
}
/**
 * This class represent a branch item: an item whose children interaction can be activated or disactivated depending on certain conditions.
 */
export declare class ConditionalItem extends Item implements ConditionalItemData, IActivable {
    static readonly TYPE: string;
    forAll?: boolean;
    value?: any;
    params: Array<any>;
    operator: Operator;
    constructor(data: Partial<ConditionalItemData>);
    /**
     * This method check whether the item is active: if so its hierarchy will be visible, otherwise it won't.
     * @returns true if the item is active, false otherwise
     * @override
     */
    isActive(): boolean;
    /**
     * @override
     */
    isValid(): boolean;
    /**
     * @ovverride
     */
    getSchema(): ConditionalItemData;
}
