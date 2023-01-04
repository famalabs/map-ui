import { Expression } from './ast';
import { Computable, ComputableData } from './computable';
/**
 * Data used to serialize an instance of ConditionalItem
 */
export interface ItemConditionalData extends ComputableData {
    /**
     * Expression to be computed
     */
    expression: Expression;
}
/**
 *
 */
export declare class ItemConditional extends Computable<boolean> implements Required<ItemConditionalData> {
    static readonly TYPE: string;
    protected _data: ItemConditionalData;
    get expression(): Expression;
    set expression(value: Expression);
    constructor(data: Partial<ItemConditionalData>);
    /**
     * Checks if item is active: if so its hierarchy will be visible, otherwise it won't.
     * @returns true if the item is active, false otherwise
     * @override
     */
    isActive(): boolean;
    /**
     * @override
     */
    isValid(): boolean;
    _compute(params: any[]): boolean;
    /**
     * @override
     */
    toJSON(): ItemConditionalData;
}
