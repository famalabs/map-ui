export function getFn(fnName: string): any {
  if (typeof functions[fnName] === 'function')
    return functions[fnName];
  return null;
}

export function registerFn(fn: Function, ...fnName: string[]) {
  for (let name of fnName) {
    // if (typeof functions[fnName] !== 'function') {
    functions[name] = fn;
    // }
  }
}

export function Sum(...args: number[]): number {
  if (args instanceof Array && args.length > 0) {
    let r: number = 0;
    for (let i = 0; i < args.length; i++) {
      if (!isNaN(args[i]))
        r += args[i];
    }
    return r;
  }
}

export function Multiply(...args: number[]): number {
  if (args instanceof Array && args.length > 0) {
    let r: number = 0;
    for (let i = 0; i < args.length; i++) {
      if (!isNaN(args[i]))
        r = (r !== 0 ? r : 1) * args[i];
    }
    return r;
  }
}

export function Diff(...args: number[]): number {
  if (args instanceof Array && args.length > 0) {
    let r: number = args[0];
    for (let i = 1; i < args.length; i++) {
      if (!isNaN(args[i]))
        r -= args[i];
    }
    return r;
  }
}

export function Divide(...args: number[]): number {
  if (args instanceof Array && args.length > 0) {
    let r: number = args[0];
    for (let i = 1; i < args.length; i++) {
      if (!isNaN(args[i]))
        r /= args[i];
    }
    return r;
  }
}

export function Average(...args: number[]): number {
  if (args && args.length > 0) {
    let s = 0;
    let n = 0;
    for (let i = 0; i < args.length; i++) {
      if (!isNaN(args[i])) {
        s += args[i];
        n++;
      }
    }
    return s / n;
  }
}


let functions = {...Math};

registerFn(Object, 'Object');
registerFn(Array, 'Array');
registerFn(Number, 'Number');
registerFn(Sum, 'sum');
registerFn(Multiply, 'multiply');
registerFn(Diff, 'diff');
registerFn(Divide, 'divide');
registerFn(Average, 'average');
