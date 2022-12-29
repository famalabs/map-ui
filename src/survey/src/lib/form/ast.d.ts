/**
 * Operators allowed
 */
export declare type Operator = '+' | '-' | '*' | '/' | '>' | '<' | '>=' | '<=' | '==' | '!=' | '&&' | '||';
export declare type OperatorFn = (...args: any) => any;
export interface Expression {
    type: 'exp';
    operator: Operator;
    left: ExpressionValue;
    right: ExpressionValue;
}
export interface CallExpression {
    type: 'call';
    call: Identifier;
    arguments: ExpressionValue[];
}
export declare type ExpressionStatement = Expression | CallExpression;
export declare type ExpressionValue = Expression | Parameter | CallExpression;
export interface Identifier {
    type: 'id';
    name: string;
}
export interface Literal {
    type: 'v';
    value: any;
}
export declare type Parameter = Identifier | Literal;
export declare class ExecutionError extends Error {
}
export declare type ExecutionContext = any;
/**
 * Resolves ExpressionValue
 * @param st
 * @param ctx
 * @returns
 */
export declare function resolve(st: ExpressionValue, ctx: ExecutionContext): any;
/**
 * Computes Expression
 * @param exp
 * @param ctx
 * @returns
 */
export declare function compute(exp: Expression, ctx: ExecutionContext): any;
/**
 * Call function
 * @param exp
 * @param ctx
 * @returns
 */
export declare function call(exp: CallExpression, ctx: ExecutionContext): any;
export declare function validate(statement: ExpressionStatement): void;
export declare function execute(statement: ExpressionStatement, ctx: ExecutionContext): any;
export declare class AST {
    _validating: boolean;
    _global: ExecutionContext;
    validate(statement: ExpressionStatement): void;
    execute(statement: ExpressionStatement, ctx: ExecutionContext): any;
}
