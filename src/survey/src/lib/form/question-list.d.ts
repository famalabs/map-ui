import { IDataSource } from './form-data';
import { Question, QuestionData, QuestionOptions } from './question';
/**
 * Interface which represent the optional parameters that can be specified
 * @interface
 */
export interface QuestionListOptions extends QuestionOptions<[]> {
    /**
     * minimum number of answers
     */
    min?: number;
    /**
     * maximum number of answers
     */
    max?: number;
    /**
     * source id
     */
    source?: string;
}
/**
 * Open ended question
 */
export declare class QuestionList extends Question<[], QuestionListOptions> {
    static readonly TYPE: string;
    /**
     * @override
     */
    setAnswer(answers: []): boolean;
    /**
     * Gets the DataSource instance from the resolver
     * @returns
     */
    source(): IDataSource;
    /**
     * @override
     */
    getSchema(): QuestionData<QuestionListOptions>;
}
