import { IEngine, IResolver } from './engine';
import { Operation } from './operation';
import { Item } from './item';
import { DBSchema } from '../db';
export declare class TreeException extends Error {
}
export declare class InvalidOperationException extends TreeException {
}
export declare class Tree implements IEngine, IResolver {
    protected engine: import("./engine").ItemFactory;
    protected root: Item | null;
    protected items: Record<string, Item>;
    protected parents: Record<string, string>;
    protected _id: number;
    constructor();
    /**
     * Get an item by its id
     * @param id of the item
     * @returns item if exists
     */
    get<T extends Item = Item>(id: string): T;
    parent<T extends Item = Item>(id: string): T;
    /**
     * Loads the schema of the tree: builds the item and assign it to this.root
     * @param schema of the tree
     * @returns the root
     */
    load(schema: DBSchema): Item;
    /**
     * This function executes one ore more operation on the tree
     * @param ops the operation or an array of operation to be executed: Add, Update, Remove
     * @returns the item(s) added/updated/removed by this operation
     */
    exec(ops: Operation | Operation[]): Item | Item[];
    /**
     * Creates a new item or one of its subtypes given the data
     * @param data of the new otem
     * @returns the new item
     */
    build<T extends Item>(data: Partial<DBSchema>): T;
    /**
     * This function execute a single operation and returns the result (item)
     * @param op the operation to be executed: Add, Update, Remove
     * @returns the added/updated/removed item
     */
    execute(op: Operation): Item;
    /**
     * Add an item to tree assigning it a unique id
     * @param id of the parent of the new item
     * @param data of the new item
     * @param index
     * @returns the new item
     */
    add(id: string, data: Partial<DBSchema>, index?: number): Item;
    /**
     * Update an item with new data and position
     * @param id of the item to update
     * @param data the new data of the item
     * @param index of the new position
     * @returns the updated item
     */
    update(id: string, data?: Partial<DBSchema>, index?: number): Item;
    /**
     * Remove an item and all its child from the tree
     * @param id of the item to be removed
     * @returns the removed item
     */
    remove(id: string): Item;
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
    getSchema(): DBSchema;
    /**
     * Returns the first shared parent of two nodes (inverse DFS)
     * @param id1
     * @param id2
     * @returns parent id
     */
    parentOf(id1: string, id2: string): string;
    /**
     * Checks if an item is child of a parent
     * @param id
     * @param parent
     * @returns true if id is in parent hierarchy
     */
    isChild(id: string, parent: string): boolean;
}
