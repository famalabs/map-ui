import { Formula } from './formula';
export interface Score extends Formula {
    name: string;
    description: string;
    category: string;
    usage: Usage;
    outputs: Output[];
    unit: string;
}
export interface Usage {
    instructions: string;
    when: string;
    why: string;
    evidence: string;
}
export interface Output {
    from: number;
    to: number;
    result: string;
    content: string;
    severity: number;
}
