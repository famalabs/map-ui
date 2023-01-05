import { ParseContext } from './context';
export declare class ParseError extends Error {
    protected readonly target: string;
    protected readonly context: ParseContext;
    protected readonly index: number;
    constructor(msg: string, target: string, context: ParseContext, index: number);
}
export declare class ContextParseError extends ParseError {
    constructor(c: string, ctx: ParseContext, i: number);
}
export declare class InvalidOperatorError extends ParseError {
    constructor(op: string, i: number);
}
export declare class ExecutionError extends Error {
    protected readonly target: string;
    protected readonly context: ParseContext;
    constructor(msg: string, target: string, context: ParseContext);
}
export declare class UndefinedSymbolError extends ExecutionError {
    constructor(s: string, ctx?: ParseContext);
}
