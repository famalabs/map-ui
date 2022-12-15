import { DBSchema, Layout } from '../db';
import { IResolver } from './engine';
/**
 * Represents a node of the Tree
 */
export declare class Item implements Required<DBSchema> {
    protected _data: DBSchema;
    protected _resolver: IResolver;
    static readonly TYPE: string;
    get id(): string;
    get type(): string;
    get name(): string;
    set name(value: string);
    get text(): string;
    set text(value: string);
    get items(): Item[];
    get layout(): Layout;
    set layout(value: Layout);
    get resolver(): IResolver;
    set resolver(value: IResolver);
    constructor(data: Partial<DBSchema>);
    /**
     * This method checks whether the item is considered active
     * @returns true if the item is active, false otherwise
     * @virtual
     */
    isActive(): boolean;
    /**
     * Checks if the hierarchy is considered valid
     * @returns {boolean} true if all items are valid
     */
    isValid(): boolean;
    /**
     * Serializes the item
     * @returns {DBSchema} on object representing the schema of the item
     */
    getSchema(): DBSchema;
    /**
     * Apply iterator to element and all its child in a Depth-First manner
     * @param iterator
     * @param context
     */
    iterate(iterator: (item: Item, context: any) => void, context?: any): void;
    update(data: Partial<DBSchema>): void;
}
