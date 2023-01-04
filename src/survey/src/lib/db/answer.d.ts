/**
 * Interface which represents the serialization of an answer
 * @interface
 */
export interface DBAnswer {
    /**
     * Id: of the question
     */
    id: string;
    /**
     * Answer: value of the answer given by the user: its type depends on the question
     */
    answer: any;
    /**
     * Score: score of the answer, number or undefined
     */
    score?: number;
}
