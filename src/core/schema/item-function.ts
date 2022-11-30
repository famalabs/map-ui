import {SurveyItem} from './survey-item';
import {Question} from './question';
import {getFn} from '../functions';
import {isId} from './config';
import {DBAnswer} from './answer';

export interface FunctionNamed<T> {
  (...args: T[]): T;

  fnName: string;
}

export function getFunctionNamed<T>(fnName: string): FunctionNamed<T> {
  const fn = getFn(fnName);
  if (typeof fn === 'function') {
    let FN = <FunctionNamed<T>>function (...args) {
      return fn(...args);
    };
    FN.fnName = fnName;
    return FN;
  }
}

export class ItemFunction<T> extends SurveyItem {

  // direct computation
  fnCompute: FunctionNamed<T>;
  fnReduce: FunctionNamed<T>;
  fnInit: FunctionNamed<T>;
  parameters: Array<string>;
  result: T;
  staticParams: Array<any>;

  static readonly FNS = ['Compute', 'Reduce', 'Init'];

  constructor(data: any = {}) {
    super(data);
    if (data.fnCompute) {
      this.setFnCompute(data.fnCompute);
    } else if (data.fnReduce && data.fnInit) {
      this.setFn('Reduce', data.fnReduce);
      this.setFn('Init', data.fnInit);
    }
    if (data.parameters instanceof Array)
      this.parameters = data.parameters.map((id) => (isId(id)) ? id.toString() : null);
    else
      this.parameters = [];
    this.staticParams = data.staticParams instanceof Array ? data.staticParams : [];
    // this.result = this.compute();
  }

  setFnCompute(fnName: string) {
    return this.setFn('Compute', fnName);
  }

  setFn(fn: string, fnName: string) {
    if (ItemFunction.FNS.indexOf(fn) >= 0)
      return this['fn' + fn] = getFunctionNamed(fnName);
  }

  compute(): T {
    if (this.parameters instanceof Array) {
      if (typeof this.fnCompute === 'function') {
        let params = this.parameters.map((id) => this.getParam(id));
        params = this.staticParams.concat(params);
        return this.result = this.fnCompute.apply(this, params);
      }
      if (typeof this.fnReduce === 'function' && typeof this.fnInit === 'function') {
        return this.result = this.parameters.reduce((result, id) => {
          return this.fnReduce.apply(this, [result, this.getParam(id)].concat(this.staticParams));
        }, this.fnInit());
      }
    }
    return this.result = undefined;
  }

  computeWithValues(values:any[]): T {
    if (typeof this.fnCompute === 'function') {
      let params = values;
      params = this.staticParams.concat(params);
      return this.result = this.fnCompute.apply(this, params);
    }
    return this.result = undefined;
  }

  getResult(): DBAnswer {
    return {
      id: this.id,
      answer: undefined,
      score: this.compute()
    };
  }

  hasValidParams(): boolean {
    if (!(this.parameters instanceof Array))
      return false;
    if (!(this.parameters.length > 0))
      return false;
    for (let i = 0; i < this.parameters.length; i++) {
      let item = this.renderer.get(this.parameters[i]);
      if (!(item instanceof SurveyItem && item.isValid()))
        return false;
    }
    return true;
  }

  removeNotValidParams(): string[] {
    for (let i = 0; i < this.parameters.length; i++) {
      let item = this.renderer.get(this.parameters[i]);
      if (!(item instanceof SurveyItem && item.isValid()))
        this.parameters.splice(i, 1);
    }
    return this.parameters;
  }

  getParam(id) {
    let item = this.renderer.get(id);
    if (item instanceof Question) {
      return item.getScore();
    } else if (item instanceof ItemFunction) {
      return item.compute();
    }
  }
  setParams(ids:Array<string>) {
    this.parameters = ids;
  }

  getSchema(): any {
    let schema = super.getSchema();
    schema.parameters = this.parameters;
    if (this.fnCompute) {
      schema.fnCompute = this.fnCompute.fnName;
    }
    else if (this.fnReduce && this.fnInit) {
      schema.fnReduce = this.fnReduce && this.fnReduce.fnName;
      schema.fnInit = this.fnInit && this.fnInit.fnName;
    }
    if (this.staticParams instanceof Array && this.staticParams.length > 0) {
      schema.staticParams = this.staticParams;
    }
    return schema;
  }

  duplicate(): any {
    let schema = super.duplicate();
    schema.parameters = []; // remove ids
    return schema;
  }

  isValid(): boolean {
    console.log('isValid fn',super.isValid(), this.result);
    if (!super.isValid())
      return false;
    return (this.result !== undefined);
  }

  toUseFormState() {
    return {
      type: 'node',
      value: 'string'
    } 
  }

}
