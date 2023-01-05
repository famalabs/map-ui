export interface Formula {
    text: string;
    params: Parameter[];
}
export interface Parameter {
    /** Parameter id MUST be unique */
    name: string;
    description?: string;
    optional?: boolean;
    metric?: ParameterMetric[];
    values?: ParameterValue[];
}
export interface ParameterMetric {
    unit: string;
    text?: string;
    min?: number;
    max?: number;
}
export interface ParameterValue {
    value: number;
    text?: string;
}
