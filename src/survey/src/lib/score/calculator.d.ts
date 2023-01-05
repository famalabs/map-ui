import { Formula, Parameter } from './formula';
import { ExecFunction, ExecArgs } from './parser';
interface FormulaArgs {
    [key: string]: FormulaParam;
}
declare type FormulaParam = number | [number, number] | null;
export declare class Calculator implements Formula {
    text: string;
    params: Parameter[];
    executor: ExecFunction;
    constructor(formula: Formula);
    compute(args: FormulaArgs): number;
    validate(args: FormulaArgs): ExecArgs;
}
export declare class ValidationError extends Error {
    constructor(msg: string);
}
export {};
