export declare enum OperationType {
    ADD = 1,
    UPDATE = 2,
    REMOVE = 4,
    MOVE = 6
}
export declare type Operation = OperationAdd | OperationUpdate | OperationRemove | OperationMove;
export interface OperationAdd {
    type: OperationType.ADD;
    id: string;
    data: any;
    index?: number;
}
export interface OperationUpdate {
    type: OperationType.UPDATE;
    id: string;
    data: any;
    parent?: string;
}
export interface OperationRemove {
    type: OperationType.REMOVE;
    id: string;
}
export interface OperationMove {
    type: OperationType.MOVE;
    id: string;
    index?: number;
    parent?: string;
}
