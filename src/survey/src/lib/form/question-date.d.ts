import { Question, QuestionData, QuestionOptions } from './question';
/**
 * Interface which represent the optional parameters that can be specified
 * @interface
 */
export interface QuestionDateOptions extends QuestionOptions<Date> {
    /**
     * MinValue: the minimum date allowed (included)
     */
    min?: Date;
    /**
     * MinValue: the maximum date allowed (included)
     */
    max?: Date;
}
/**
 * Represent a question whose answer is a date
 * */
export declare class QuestionDate extends Question<Date, QuestionDateOptions> {
    static readonly TYPE: string;
    /**
     * @override
     */
    setAnswer(answer: Date): boolean;
    /**
     * @override
     */
    getSchema(): QuestionData<QuestionDateOptions>;
}
