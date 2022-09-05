export interface IterationContext {
  name: string,
  index?: number,
  text?: string,
}

export interface Field {
  name: string,
  index: number,
  text: string,
  options?: object,
}

export type FieldsMap = Record<string, Field>;
export type FeaturesMap = Record<string, string>;
