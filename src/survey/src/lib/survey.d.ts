import { DBAnswer, ExtendedSchema } from './db';
import { Tree, TreeException } from './engine';
import { ItemFunction, Question, DataSourceRepository, IFormResolver } from './form';
import { IExecutor } from './form/ast';
export declare enum SurveyMode {
    EDIT = 0,
    COMPILE = 1
}
export declare class SurveyModeException extends TreeException {
    readonly current: SurveyMode;
    readonly required?: SurveyMode;
    constructor(current: SurveyMode, required?: SurveyMode);
}
export declare class Survey extends Tree implements IFormResolver {
    protected _questions: Question[];
    protected _functions: ItemFunction[];
    protected _sources: DataSourceRepository;
    protected _executor: IExecutor;
    protected _mode: SurveyMode;
    get questions(): Question<any, import("./form").QuestionOptions<any>>[];
    get functions(): ItemFunction<any>[];
    get sources(): DataSourceRepository;
    get executor(): IExecutor;
    /**
     * Survey current mode. Enables functionalities based on this value
     */
    get mode(): SurveyMode;
    constructor(schema?: ExtendedSchema);
    /**
     * Sets answers from a list returning questions
     * @param answers
     * @returns list of questions set
     * @throws {SurveyModeException}
     */
    setAnswers(answers: Array<DBAnswer>): Question[];
    /**
     * Get answers from all questions
     * @returns
     * @throws {SurveyModeException}
     */
    getAnswers(): Array<DBAnswer>;
    /**
     * Compute all functions
     * @returns
     * @throws {SurveyModeException}
     */
    compute(): void;
    /**
     * Reset all submittable or dynamic fields
     */
    reset(): void;
    /**
     * Caches tree informations for faster lookups.
     * NOTE: this implies that no more tree operations are allowed
     */
    prepare(): void;
    /**
     * Checks if an item and it's parent hierarchy is active
     * @param id
     * @param activeMap cached results
     * @returns
     */
    isActive(id: string, activeMap?: Record<string, boolean>): boolean;
    /**
     * Checks if all the active questions has been submitted
     * @returns
     * @throws {SurveyModeException}
     */
    isSumbitted(): boolean;
}
