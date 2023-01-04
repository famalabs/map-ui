import { Question, QuestionData, QuestionOptions } from './question';
/**
 * Interface which represent the optional parameters that can be specified
 * @interface
 */
export interface QuestionDateOptions extends QuestionOptions<Date> {
    /**
     * minimum date allowed (included)
     */
    min?: Date;
    /**
     * maximum date allowed (included)
     */
    max?: Date;
    unit?: DateTimeUnit;
}
export declare type DateUnit = 'day' | 'week' | 'month' | 'year';
export declare type TimeUnit = 'second' | 'minute' | 'hour';
export declare type DateTimeUnit = DateUnit | TimeUnit;
/**
 * Represent a question whose answer is a date
 * */
export declare class QuestionDate extends Question<Date, QuestionDateOptions> {
    static readonly TYPE: string;
    constructor(data: Partial<QuestionData<QuestionDateOptions>>);
    /**
     * @override
     */
    isValid(): boolean;
    /**
     * @override
     */
    setAnswer(answer: Date): boolean;
    /**
     * @override
     */
    toJSON(): QuestionData<QuestionDateOptions>;
}
