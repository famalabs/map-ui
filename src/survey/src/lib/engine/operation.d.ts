export declare enum OperationType {
    ADD = 1,
    UPDATE = 2,
    REMOVE = 3
}
export declare type Operation = OperationAdd | OperationUpdate | OperationRemove;
export interface OperationAdd {
    type: OperationType.ADD;
    id: string;
    data: any;
    index?: number;
}
export interface OperationUpdate {
    type: OperationType.UPDATE;
    id: string;
    data?: any;
    index?: number;
    parent?: string;
}
export interface OperationRemove {
    type: OperationType.REMOVE;
    id: string;
}
