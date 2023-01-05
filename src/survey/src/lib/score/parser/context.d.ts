export declare enum ParseContext {
    Scope = 0,
    Number = 1,
    Operator = 2,
    Param = 3,
    Function = 4,
    Shift = 5,
    Close = 6,
    Skip = 7
}
export declare function getContext(c: string, current: ParseContext, skipped: boolean): ParseContext;
