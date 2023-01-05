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
export declare type ExecutionContext = Record<string, any>;
export interface IExecutor {
    execute(statement: ExpressionStatement, ctx?: ExecutionContext): any;
}
export declare class AST implements IExecutor {
    protected _globals: ExecutionContext;
    get globals(): ExecutionContext;
    execute(statement: ExpressionStatement, ctx?: ExecutionContext): any;
    resolve(st: ExpressionValue, ctx: ExecutionContext): any;
    /**
     * Compute Expression
     * @param exp
     * @param ctx
     * @returns
     */
    compute(exp: Expression, ctx: ExecutionContext): any;
    /**
     * Call function
     * @param exp
     * @param ctx
     * @returns
     */
    invoke(exp: CallExpression, ctx: ExecutionContext): any;
    /**
     * Get identifier in context
     * @param id
     * @param ctx
     * @returns
     */
    identifier(id: Identifier, ctx: ExecutionContext): any;
}
