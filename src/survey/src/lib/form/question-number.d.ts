import { Question, QuestionData, QuestionOptions } from './question';
/**
 * Interface which represent the optional parameters that can be specified
 * @interface
 */
export interface QuestionNumberOptions extends QuestionOptions<number> {
    /**
     * MinValue: the minimum number allowed (included)
     */
    min?: number;
    /**
     * MaxValue: the maximum number allowed (included)
     */
    max?: number;
    /**
     * step fixed increment
     */
    step?: number;
    /**
     * Unit of measure used
     */
    unit?: Unit;
}
/**
 * Unit of measure
 */
export declare type Unit = 'kg' | 'm' | undefined;
/**
 * Represent a questions whose answer is a number
 */
export declare class QuestionNumber extends Question<number, QuestionNumberOptions> {
    static readonly TYPE: string;
    /**
     * @override
     */
    setAnswer(answer: number): boolean;
    /**
     * @override
     */
    getScore(): number | undefined;
    /**
     * @override
     */
    getSchema(): QuestionData<QuestionNumberOptions>;
}
