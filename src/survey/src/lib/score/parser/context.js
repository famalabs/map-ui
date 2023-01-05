"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = exports.ParseContext = void 0;
var ParseContext;
(function (ParseContext) {
    ParseContext[ParseContext["Scope"] = 0] = "Scope";
    ParseContext[ParseContext["Number"] = 1] = "Number";
    ParseContext[ParseContext["Operator"] = 2] = "Operator";
    ParseContext[ParseContext["Param"] = 3] = "Param";
    ParseContext[ParseContext["Function"] = 4] = "Function";
    ParseContext[ParseContext["Shift"] = 5] = "Shift";
    ParseContext[ParseContext["Close"] = 6] = "Close";
    ParseContext[ParseContext["Skip"] = 7] = "Skip";
    // Literal
    // Identifier
})(ParseContext = exports.ParseContext || (exports.ParseContext = {}));
const Name = /[a-zA-Z_]/;
const Operator = /[+\-*/><=!&|^%]/;
const UnaryOperator = /[+\-]/;
const ParamChar = '$';
const Param = /[a-zA-Z_0-9]/;
const Whitespace = /[\s]/;
function getContext(c, current, skipped) {
    if (Whitespace.test(c))
        return ParseContext.Skip;
    switch (current) {
        case ParseContext.Scope:
            if (c === '(')
                return ParseContext.Scope;
            if ((c >= '0' && c <= '9'))
                return ParseContext.Number;
            if (Name.test(c))
                return ParseContext.Function;
            if (c === ParamChar)
                return ParseContext.Param;
            if (UnaryOperator.test(c))
                return ParseContext.Operator;
            break;
        case ParseContext.Number:
            if (((c >= '0' && c <= '9') || (c === '.')) && !skipped)
                return ParseContext.Number;
            if (Operator.test(c))
                return ParseContext.Operator;
            if (c === ',')
                return ParseContext.Shift;
            if (c === ')')
                return ParseContext.Close;
            break;
        case ParseContext.Operator:
            if (Operator.test(c))
                return ParseContext.Operator;
            if (c >= '0' && c <= '9')
                return ParseContext.Number;
            if (Name.test(c))
                return ParseContext.Function;
            if (c === ParamChar)
                return ParseContext.Param;
            if (c === '(')
                return ParseContext.Scope;
            break;
        case ParseContext.Function:
            if (Name.test(c) && !skipped)
                return ParseContext.Function;
            if (c === '(')
                return ParseContext.Scope;
            // in case it is a constant
            if (Operator.test(c))
                return ParseContext.Operator;
            if (c === ',')
                return ParseContext.Shift;
            if (c === ')')
                return ParseContext.Close;
            break;
        case ParseContext.Param:
            if (Param.test(c) && !skipped)
                return ParseContext.Param;
            if (Operator.test(c))
                return ParseContext.Operator;
            if (c === ',')
                return ParseContext.Shift;
            if (c === ')')
                return ParseContext.Close;
            break;
        case ParseContext.Close:
            if (Operator.test(c))
                return ParseContext.Operator;
            if (c === ',')
                return ParseContext.Shift;
            if (c === ')')
                return ParseContext.Close;
            break;
    }
    return undefined;
}
exports.getContext = getContext;
//# sourceMappingURL=context.js.map