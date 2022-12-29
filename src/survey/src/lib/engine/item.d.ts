import { DBSchema } from '../db';
import { IResolver, ItemConstructor } from './engine';
import { Validatable } from './validatable';
export declare enum IteratorMode {
    DFS = 0,
    BFS = 1
}
export interface Item extends Required<DBSchema> {
    constructor: ItemConstructor<Item>;
}
/**
 * Represents a node of the Tree
 */
export declare class Item implements Validatable {
    protected _data: DBSchema;
    protected _resolver: IResolver;
    static readonly TYPE: string;
    get id(): string;
    get type(): string;
    get name(): string;
    set name(value: string);
    get text(): string;
    set text(value: string);
    get description(): string;
    set description(value: string);
    get items(): Item[];
    get layout(): import("../db").Layout;
    set layout(value: import("../db").Layout);
    get resolver(): IResolver;
    set resolver(value: IResolver);
    constructor(data: Partial<DBSchema>);
    /**
     * Checks if item should be considered active
     * @returns true if the item is active
     * @virtual
     */
    isActive(): boolean;
    /**
     * Checks if the item should be considered valid
     * @returns true if the item is valid
     * @virtual
     */
    isValid(): boolean;
    /**
     * Serializes the item
     * @returns an object representing the schema of the item
     * @virtual
     */
    toJSON(): DBSchema;
    update(data: Partial<DBSchema>): void;
    protected get(id: string): Item;
    parent(): Item;
    /**
     * Recursively checks if parent is a certain item
     * @param item
     * @returns true if inside parent hierarchy
     */
    isChildOf(item: Item): boolean;
    /**
     * Iterate item and all its child
     * @param mode depth-first-search by default
     */
    hierarchy(mode?: IteratorMode): IterableIterator<Item>;
}
