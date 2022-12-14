/**
 * This function compares each element of args with value using the specified comparison operator
 * @param operator the operator used to compare: <, >, ==, !=, >=, <=
 * @param value the value to be compared with each element
 * @param args the elements to compare
 * @returns the number of the elements which satisfied the comparison
 */
export declare function CountIf(operator: string, value: any, ...args: number[]): number;
