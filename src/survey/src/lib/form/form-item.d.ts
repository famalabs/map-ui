import { DBAnswer } from "../db";
import { Item } from "../engine";
import { IFormDataResolver } from "./form-data";
/**
 * Utility class representing dynamic items (e.g: can receive inputs from user)
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
    protected _resolver: IFormDataResolver;
}
