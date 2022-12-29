import { Question, QuestionData, QuestionOptions } from './question';
/**
 * Interface which represent the optional parameters that can be specified
 * @interface
 */
export interface QuestionTextOptions extends QuestionOptions<string> {
    /**
     * minimum answer length (inclusive)
     */
    min?: number;
    /**
     * maximum answer length (inclusive)
     */
    max?: number;
    /**
     * format validation
     */
    format?: RegExp;
}
/**
 * Open ended question
 */
export declare class QuestionText extends Question<string, QuestionTextOptions> {
    static readonly TYPE: string;
    constructor(data: Partial<QuestionData<QuestionTextOptions>>);
    /**
     * @override
     */
    isValid(): boolean;
    /**
     * @override
     */
    setAnswer(answer: string): boolean;
    /**
     * @override
     */
    toJSON(): QuestionData<QuestionTextOptions>;
}
