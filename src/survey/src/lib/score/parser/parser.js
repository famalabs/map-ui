"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.parse = void 0;
const engine_1 = require("./engine");
const context_1 = require("./context");
const errors_1 = require("./errors");
const exec_1 = require("./exec");
function parse(formula) {
    let i = 0;
    const stack = [new exec_1.ExecNode(0, '')];
    while (i < formula.length) {
        const node = stack[stack.length - 1];
        let { ctx } = node;
        let c;
        let x;
        let skipped;
        do {
            c = formula[i];
            x = context_1.getContext(c, ctx, skipped);
            if (x === context_1.ParseContext.Skip) {
                i++;
                skipped = true;
            }
        } while (x === context_1.ParseContext.Skip);
        if (i >= formula.length)
            break;
        if (x === undefined) {
            throw new errors_1.ContextParseError(c, ctx, i);
        }
        const arg = new exec_1.ExecNode(x, c);
        if (x === context_1.ParseContext.Scope) {
            resolveOperators(node, i, stack);
            node.args.push(arg);
            stack.push(arg);
        }
        else if (x === context_1.ParseContext.Shift) {
            // resolveOperators(parent, i, stack);
            // move back to scope
            while (stack[stack.length - 1].ctx !== context_1.ParseContext.Scope) {
                stack.pop();
            }
            if (stack.length < 2) {
                throw new errors_1.ContextParseError(c, ctx, i);
            }
        }
        else if (x === context_1.ParseContext.Close) {
            // resolveOperators(parent, i, stack);
            // close scope
            while (stack[stack.length - 1].ctx !== context_1.ParseContext.Scope) {
                stack.pop();
            }
            if (stack.length < 2) {
                throw new errors_1.ContextParseError(c, ctx, i);
            }
            stack[stack.length - 1].ctx = context_1.ParseContext.Close;
            if (stack[stack.length - 2].ctx === context_1.ParseContext.Function) {
                stack.pop();
            }
        }
        else if (x === ctx && !skipped) { // if skipped then it's a new contenxt
            node.str += c;
        }
        else if (x === context_1.ParseContext.Operator) {
            // unary operator (Scope -> Operator)
            if (ctx === context_1.ParseContext.Scope && arg.ctx === context_1.ParseContext.Operator) {
                const t = new exec_1.ExecNode(context_1.ParseContext.Number, '0');
                node.args.push(t);
                stack.push(t);
            }
            const prev = stack[stack.length - 1];
            swap(arg, prev);
            prev.args.push(arg);
        }
        else { // x !== ctx
            if (ctx === context_1.ParseContext.Operator) {
                resolveOperators(node, i, stack);
            }
            node.args.push(arg);
            stack.push(arg);
        }
        i++;
        // step debug
        // console.log(i, stack);
    }
    // console.dir(stack);
    // check last element
    const node = stack[stack.length - 1];
    if (node.ctx === context_1.ParseContext.Scope ||
        node.ctx === context_1.ParseContext.Operator) {
        throw new errors_1.ContextParseError('', node.ctx, formula.length);
    }
    const main = stack[1];
    return main;
}
exports.parse = parse;
function compile(formula) {
    const node = formula instanceof exec_1.ExecNode ? formula : parse(formula);
    return node.compile();
}
exports.compile = compile;
function swap(a, b) {
    const src = Object.assign({}, a);
    Object.assign(a, b);
    Object.assign(b, src);
}
function resolveOperators(node, i, stack) {
    if (node && node.ctx === context_1.ParseContext.Operator) {
        const op = engine_1.Operations[node.str];
        if (!op) {
            throw new errors_1.InvalidOperatorError(node.str, i - node.str.length);
        }
        let sup;
        while ((sup = stack[stack.length - 2]) && (sup && sup.ctx === context_1.ParseContext.Operator)
            && (op.precedence <= engine_1.Operations[sup.str].precedence)) {
            // console.log('resolveOperators', node, sup);
            // swap parent.args[0] with sup (insert arg)
            const left = node.args[0];
            node.args[0] = sup;
            sup.args[1] = left;
            // remove sup operation
            stack.splice(stack.length - 2, 1);
            // console.log('sup', sup, 'parent', parent, 'node', node);
        }
        sup.args[sup.args.length - 1] = node; // ensure right is current operator
    }
}
//# sourceMappingURL=parser.js.map