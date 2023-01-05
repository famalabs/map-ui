export declare type Operation = ((...args: any[]) => any) & {
    precedence?: number;
    associativity?: Associativity;
};
declare enum Associativity {
    LeftToRight = 0,
    RightToLeft = 1
}
export declare const Operations: {
    [key: string]: Operation;
};
export declare const Functions: {
    [key: string]: (...args: any[]) => any;
};
export declare const Constants: {
    [key: string]: number;
};
export declare const Symbols: {
    [key: string]: ((...args: any[]) => any) | any;
};
export {};
