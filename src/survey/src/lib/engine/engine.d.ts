import { Operation } from './operation';
import { Item } from './item';
import { DBSchema } from '../db';
export interface IEngine {
    build<T extends Item>(data: Partial<DBSchema>): T;
    execute(op: Operation): Item;
}
export declare class ItemFactory {
    private constructors;
    register<T extends Item>(fn: ItemConstructor<T>): void;
    isRegistered<T extends Item>(fn: ItemConstructor<T>): boolean;
    build<T extends Item>(data: Partial<DBSchema>): T;
}
/**
 * default engine
 */
export declare const engine: ItemFactory;
export interface IResolver {
    get<T extends Item>(id: string): T;
}
export declare const TYPEKEY = "TYPE";
export declare type ItemConstructor<T extends Item> = {
    new (data: Partial<DBSchema>): T;
    [TYPEKEY]: string;
};
export declare function register<T extends Item>(fn: ItemConstructor<T>): void;
