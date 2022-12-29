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
     * @override
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * @override
     */
    toJSON(): DBSchema;
}
