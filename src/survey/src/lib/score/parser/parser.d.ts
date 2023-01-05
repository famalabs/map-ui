import { ExecNode, ExecFunction } from './exec';
export declare function parse(formula: string): ExecNode;
export declare function compile(formula: string | ExecNode): ExecFunction;
