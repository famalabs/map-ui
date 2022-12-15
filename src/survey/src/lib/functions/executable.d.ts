export declare type IValidator = (value: any, index?: number, args?: any[]) => boolean;
/**
 * Class that wraps a function
 */
export declare class Executable {
    /**
     * Function itself
     */
    fn: Function;
    /**
     * name id of the executable
     */
    name: string;
    /**
     * Required number of arguments
     */
    required: number;
    /**
     *
     */
    validators: IValidator[];
    constructor(data: Partial<Executable>);
    call(...args: any[]): any;
    apply(args: any[]): any;
    validate(args: any[]): boolean;
}
