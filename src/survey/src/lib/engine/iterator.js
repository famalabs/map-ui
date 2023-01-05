"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemIterator = exports.IteratorMode = void 0;
var IteratorMode;
(function (IteratorMode) {
    IteratorMode[IteratorMode["DFS"] = 0] = "DFS";
    IteratorMode[IteratorMode["BFS"] = 1] = "BFS";
})(IteratorMode = exports.IteratorMode || (exports.IteratorMode = {}));
class ItemIterator {
    constructor(item, mode) {
        this.item = item;
        this.mode = mode;
        this.i = 0;
        this.entries = [this.item];
    }
    next() {
        const item = this.entries[this.i++];
        if (item && item.items instanceof Array) {
            if (this.mode === IteratorMode.BFS)
                Array.prototype.push.apply(this.entries, item.items);
            // DFS
            else
                this.entries.splice(this.i, 0, ...item.items);
        }
        return {
            done: item === undefined,
            value: item,
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
exports.ItemIterator = ItemIterator;
//# sourceMappingURL=iterator.js.map