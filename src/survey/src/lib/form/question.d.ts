import { DBAnswer, DBSchema } from '../db';
import { FormItem } from './form-item';
/**
 * @interface
 */
export interface QuestionOptions<TAnswer = any> {
    /**
     * Required: if true the answer is required (default), otherwise it's optional
     */
    required?: boolean;
    /**
     * Answer default value
     */
    default?: TAnswer;
}
/**
 * Schema representing the serialization of the question
 * @interface
 */
export interface QuestionData<TOptions extends QuestionOptions = QuestionOptions> extends DBSchema {
    options?: TOptions;
}
/**
 * Abstract class to create form questions
 */
export declare abstract class Question<TAnswer = any, TOptions extends QuestionOptions<TAnswer> = QuestionOptions<TAnswer>> extends FormItem implements QuestionData<TOptions> {
    protected _data: QuestionData<TOptions>;
    /**
     * Answer
     */
    protected _answer: TAnswer;
    get answer(): TAnswer;
    /**
     * configuration parameters
     */
    get options(): TOptions;
    /**
     * Shortcut for options.required
     * True by default
     */
    get required(): boolean;
    constructor(data: Partial<QuestionData<TOptions>>);
    setOption<K extends keyof TOptions>(key: K, value: TOptions[K]): void;
    /**
     * Method used to set the answer from input.
     * Note: null should be considered a valid value (required option)
     * @virtual
     * @param answer value to set
     * @returns true if answer was updated, false otherwise
     */
    abstract setAnswer(answer: TAnswer): boolean;
    /**
     * Checks if the question has a valid answer
     * @returns true if answer is valid, false otherwise
     */
    isValid(): boolean;
    /**
     * @override
     */
    getSchema(): QuestionData<TOptions>;
    /**
     * This method returns the user answer
     * @returns the answer of the user
     */
    getAnswer(): DBAnswer;
    /**
     * @returns the numeric score of the question or undefined if it doesn't have any
     */
    getScore(): number | undefined;
    reset(): void;
}
