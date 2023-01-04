import { DBAnswer } from '../db';
import { Item } from '../engine';
import { IFormDataResolver } from './form-data';
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
    protected _resolver: IFormDataResolver;
}
/**
 * Utility function to get the score from an item
 * @param item
 * @returns
 */
export declare function getScore(item: Item): number;
