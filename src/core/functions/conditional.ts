import {registerFn} from './common';

const operators = {
  '>': (x, y) => x > y,
  '<': (x, y) => x < y,
  '>=': (x, y) => x >= y,
  '<=': (x, y) => x <= y,
  '==': (x, y) => x == y,
  '!=': (x, y) => x != y
};

export function CountIf(operator, value, ...args: number[]): number {
  let fn = operators[operator];
  if (args instanceof Array && args.length > 0 && fn) {
    let r = 0;
    for (let i = 0; i < args.length; i++) {
      r += Number(fn(args[i], value));
    }
    return r;
  }
}

registerFn(CountIf, 'CountIf');
