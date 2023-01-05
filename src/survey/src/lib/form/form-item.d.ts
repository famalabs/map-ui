import { DBAnswer } from '../db';
import { IResolver, Item } from '../engine';
import { IExecutor } from './ast';
import { DataSourceRepository } from './form-data';
/**
 * Class representing dynamic items (e.g: can receive inputs from user)
 */
export declare abstract class FormItem extends Item {
    /**
     * @returns the serialization of the result
     */
    abstract getAnswer(): DBAnswer;
    /**
     * Resets item state
     */
    abstract reset(): void;
    /**
     * Checks if item state is submitted
     */
    abstract isSubmitted(): boolean;
    protected _resolver: IFormResolver;
}
export interface ISourcesResolver {
    sources: DataSourceRepository;
}
export interface IExecutorResolver {
    executor: IExecutor;
}
export interface IFormResolver extends IResolver, ISourcesResolver, IExecutorResolver {
}
/**
 * Utility function to get the score from an item
 * @param item
 * @returns
 */
export declare function getScore(item: Item): number;
