"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.TYPEKEY = exports.engine = exports.ItemFactory = void 0;
const item_1 = require("./item");
const group_1 = require("./group");
class ItemFactory {
    constructor() {
        this.constructors = {};
    }
    register(fn) {
        this.constructors[fn[exports.TYPEKEY]] = fn;
    }
    isRegistered(fn) {
        if (typeof fn === 'string')
            return !!this.constructors[fn];
        else if (fn && typeof fn[exports.TYPEKEY] === 'string')
            return this.constructors[fn[exports.TYPEKEY]] === fn;
        return false;
    }
    build(data) {
        if (!data)
            throw new Error('Data must be an object');
        const fn = this.constructors[data.type];
        if (!fn)
            throw new Error(`Invalid type '${data.type}'`);
        const item = new fn(data);
        return item;
    }
}
exports.ItemFactory = ItemFactory;
/**
 * default engine
 */
exports.engine = new ItemFactory();
exports.TYPEKEY = 'TYPE';
function register(fn) {
    return exports.engine.register(fn);
}
exports.register = register;
register(item_1.Item);
register(group_1.Group);
//# sourceMappingURL=engine.js.map