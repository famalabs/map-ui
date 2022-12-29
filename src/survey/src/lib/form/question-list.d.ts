import { IDataSource } from './form-data';
import { Question, QuestionData, QuestionOptions } from './question';
/**
 * Interface which represent the optional parameters that can be specified
 * @interface
 */
export interface QuestionListOptions extends QuestionOptions<any[]> {
    /**
     * source id
     */
    source?: string;
    /**
     * minimum answers count
     */
    min?: number;
    /**
     * maximum answers count
     */
    max?: number;
}
/**
 * Fields list question
 */
export declare class QuestionList extends Question<any[], QuestionListOptions> {
    static readonly TYPE: string;
    /**
     * @override
     */
    isValid(): boolean;
    /**
     * @override
     */
    setAnswer(answers: any[]): boolean;
    /**
     * Gets the DataSource instance from the resolver
     * @returns
     */
    source(): IDataSource;
    /**
     * @override
     */
    toJSON(): QuestionData<QuestionListOptions>;
    values(): any[];
}
