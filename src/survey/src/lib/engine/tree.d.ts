import { IEngine, IResolver } from './engine';
import { Operation } from './operation';
import { Item } from './item';
import { ExtendedSchema } from '../db';
export declare class TreeException extends Error {
}
export declare class ItemNotFoundException extends TreeException {
    readonly id: string;
    constructor(id: string);
}
export declare class InvalidOperationException extends TreeException {
    readonly operation: any;
    constructor(operation: any);
}
export declare class CircularPathException extends TreeException {
    constructor();
}
export declare class Tree implements IEngine, IResolver {
    protected _engine: import("./engine").ItemFactory;
    protected _items: Record<string, Item>;
    protected _parents: Record<string, string>;
    protected _id: number;
    get root(): Item;
    get size(): number;
    constructor(schema?: ExtendedSchema);
    /**
     * Get an item by its id
     * @param id of the item
     * @returns item
     */
    get<T extends Item = Item>(id: string): T;
    /**
     * Get the parent of an item by its id
     * @param id of the item
     * @returns parent
     */
    parent<T extends Item = Item>(id: string): T;
    /**
     * Loads the schema of the tree, replacing items if already present
     * @param schema
     * @returns the root of the loaded schema
     */
    protected load(schema: ExtendedSchema): Item;
    /**
     * Creates a new item or one of its subtypes given the data
     * @param data of the new otem
     * @returns the new item
     */
    build<T extends Item>(data: Omit<ExtendedSchema, 'id'>): T;
    /**
     * Execute an operation returning the result Item
     * @param op the operation to be executed: Add, Update, Remove
     * @returns the added/updated/removed item
     * @throws {InvalidOperationException}
     */
    execute(op: Operation): Item;
    /**
     * Adds an item to the tree assigning it a unique id
     * @param id of the parent
     * @param data of the new item
     * @param index position
     * @returns the new item
     */
    add(id: string, data: Omit<ExtendedSchema, 'id' | 'items'>, index?: number): Item;
    /**
     * Update an item data
     * @param id of the item to update
     * @param data the new data of the item
     * @returns the item
     * @throws {ItemNotFoundException}
     */
    update(id: string, data: Omit<ExtendedSchema, 'id' | 'type' | 'items'>): Item;
    /**
     * Remove an item hierarchy from the tree
     * @param id of the item
     * @returns the removed item hierarchy
     * @throws {ItemNotFoundException}
     */
    remove(id: string): Item;
    /**
     * Moves an item hierarchy to a new position or parent
     * @param id of the item
     * @param index position
     * @param parent new parent
     * @throws {ItemNotFoundException}
     * @throws {CircularPathException}
     * @returns the item
     */
    move(id: string, index?: number, parent?: string): Item;
    /**
     * This function returns the array of all items matching a predicate
     * @param predicate a function with boolean return type which will be executed on all the items
     * @returns the array of the items which match the predicate
     */
    filter<TItem extends Item = Item>(predicate: (x: TItem) => boolean): TItem[];
    /**
     * Gets the serialization of the tree
     * @returns the schema of the tree
     */
    toJSON(): ExtendedSchema;
    /**
     * Gets the shared root of two items (inverse DFS)
     * @param id1
     * @param id2
     * @returns id
     * @throws {ItemNotFoundException}
     */
    rootOf(id1: string, id2: string): string;
    /**
     * Gets the path between two items
     * @param id1
     * @param id2
     * @returns id path
     * @throws {ItemNotFoundException}
     */
    path(id1: string, id2: string): string[];
}
