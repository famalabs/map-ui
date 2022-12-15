import { Question, QuestionData, QuestionOptions } from './question';
/**
 * Interface which represent the optional parameters that can be specified
 * @interface
 */
export interface QuestionCheckOptions extends QuestionOptions<boolean> {
    /**
     * Wheter the score should be inverted from answer
     */
    inverted?: boolean;
}
export declare class QuestionCheck extends Question<boolean, QuestionCheckOptions> {
    static readonly TYPE: string;
    /**
     * @override
     */
    setAnswer(answer: boolean): boolean;
    /**
     * @override
     */
    getScore(): number | undefined;
    /**
     * @override
     */
    getSchema(): QuestionData<QuestionCheckOptions>;
}
