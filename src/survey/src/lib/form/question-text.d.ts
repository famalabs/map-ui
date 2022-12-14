import { Question, QuestionData, QuestionOptions } from './question';
/**
 * Interface which represent the optional parameters that can be specified
 * @interface
 */
export interface QuestionTextOptions extends QuestionOptions<string> {
    /**
     * minimum answer characters length (inclusive)
     */
    min?: number;
    /**
     * maximum answer characters length (inclusive)
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
    /**
     * @override
     */
    setAnswer(answer: string): boolean;
    /**
     * @override
     */
    getSchema(): QuestionData<QuestionTextOptions>;
}
