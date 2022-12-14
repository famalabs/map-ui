import { DBSchema } from '../db';
import { Item } from './item';
/**
 * Represents an item containing other items
 */
export declare class Group extends Item {
    static readonly TYPE: string;
    protected _data: DBSchema;
    get items(): Item[];
    constructor(data: Partial<DBSchema>);
    /**
     * Returns true if all hierarchy is valid
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * @override
     */
    getSchema(): DBSchema;
    /**
     * Apply iterator to element and all its child in a Depth-First manner
     * @param iterator
     * @param context
     */
    iterate(iterator: (item: Item, context: any) => void, context?: any): void;
}
