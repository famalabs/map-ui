import { Item } from './item';
export declare enum IteratorMode {
    DFS = 0,
    BFS = 1
}
export declare class ItemIterator implements IterableIterator<Item> {
    private readonly item;
    private readonly mode?;
    private entries;
    private i;
    constructor(item: Item, mode?: IteratorMode);
    next(): IteratorResult<Item>;
    [Symbol.iterator](): IterableIterator<Item>;
}
