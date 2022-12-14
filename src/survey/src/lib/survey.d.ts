import { DBAnswer, DBSchema } from './db';
import { Item, Tree } from './engine';
import { IFormDataResolver, Question, DataSourceRepository } from './form';
export declare enum SurveyMode {
    EDIT = 0,
    COMPILE = 1,
    READONLY = 2
}
export declare class SurveyException extends Error {
}
export declare class SurveyModeException extends SurveyException {
    readonly current: SurveyMode;
    readonly required?: SurveyMode;
    constructor(current: SurveyMode, required?: SurveyMode);
}
/**
 * TODO:
 * Item represents a single item -> Questions, ItemFunction (are always leaves)
 * Group is a ConditionalItem with childs (recursive)
 * Add caching (question lookups)
 *
 * - select other <- conditionalItem?
 * dynamic (non input) should have constraints on how far they can fetch values
 *
 * Scores lib -> functions executable
 */
export declare class Survey extends Tree implements IFormDataResolver {
    protected _questions: Question[];
    protected _sources: DataSourceRepository;
    protected _mode: SurveyMode;
    get questions(): Question<any, import("./form").QuestionOptions<any>>[];
    get sources(): DataSourceRepository;
    /**
     * Survey current mode. Enables functionalities based on this value
     */
    get mode(): SurveyMode;
    constructor();
    /**
     * @override
     * @param schema
     * @returns
     */
    load(schema: DBSchema, mode?: SurveyMode): Item;
    /**
     * Sets answers from a list returning questions
     * @param answers
     * @returns list of questions set
     */
    setAnswers(answers: Array<DBAnswer>): Question[];
    /**
     * Get all answers
     * @returns
     */
    getAnswers(): Array<DBAnswer>;
    compute(): void;
    /**
     * Reset all submittable or dynamic fields
     */
    reset(): void;
    /**
     * Caches tree informations for faster lookups.
     * NOTE: this implies that no subsequent modifications will happen
     */
    _cache(): void;
    /**
     * Checks if an item and it's parent hierarchy is active
     * @param id
     * @param activeMap cached results
     * @returns
     */
    isActive(id: string, activeMap?: Record<string, boolean>): boolean;
}
