import { Question, QuestionData, QuestionOptions } from './question';
/**
 * Interface which represent the optional parameters that can be specified
 * @interface
 */
export interface QuestionSelectOptions extends QuestionOptions<number> {
    /**
     * list of all the possible options the user can choose from
     */
    select?: TextScore[];
}
/**
 * Interface which represent the element than can be selected
 * @interface
 */
export interface TextScore {
    text: string;
    score: number;
}
export declare class QuestionSelect extends Question<number, QuestionSelectOptions> {
    static readonly TYPE: string;
    protected get select(): TextScore[];
    constructor(data: Partial<QuestionData<QuestionSelectOptions>>);
    /**
     * @override
     */
    isValid(): boolean;
    /**
     * @returns the selected option, undefined otherwise
     */
    selectedOption(): TextScore;
    /**
     * @override
     */
    setAnswer(answer: number): boolean;
    /**
     * @override
     */
    getScore(): number | undefined;
    isValidIndex(index: number): boolean;
    /**
     * @override
     */
    toJSON(): QuestionData<QuestionSelectOptions>;
    /**
     * Add a new TextOption at a specified index if valid or at the end of the list
     * @param opt
     * @param index
     */
    addSelect(opt: TextScore, index?: number): void;
    /**
     * Updates the TextScore at the specified index
     * @param index of the TextScore to update
     * @param opt
     */
    updateSelect(index: number, opt: TextScore): void;
    /**
     * Removes the TextScore at the specified index
     * @param index of the TextScore to remove
     */
    removeSelect(index: number): void;
}
