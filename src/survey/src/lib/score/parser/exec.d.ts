import { ParseContext } from './context';
export declare type ExecFunction = (args: ExecArgs) => number;
export declare type ExecArgs = {
    [key: string]: number;
};
export declare class ExecNode {
    ctx: ParseContext;
    str: string;
    args: ExecNode[];
    constructor(ctx: ParseContext, str: string);
    compile(): ExecFunction;
}
