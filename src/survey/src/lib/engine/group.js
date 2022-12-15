"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const item_1 = require("./item");
// Not used yet
// TODO: merge ConditionalItem
/**
 * Represents an item containing other items
 */
class Group extends item_1.Item {
    // set items(value: Item[]) { this._data.items = value; }
    constructor(data) {
        super(data);
        this._data.items = (data.items instanceof Array) ? data.items : [];
    }
    get items() { return this._data.items; } // FIX: can we avoid cast?
    /**
     * Returns true if all hierarchy is valid
     * @returns {boolean}
     */
    isValid() {
        if (this.items instanceof Array) {
            for (let i = 0; i < this.items.length; i++) {
                if (!this.items[i].isValid())
                    return false;
            }
        }
        return true;
    }
    /**
     * @override
     */
    getSchema() {
        const schema = super.getSchema();
        schema.items = this.items.map((el) => el.getSchema()); //TODO: not recursive
        return schema;
    }
    /**
     * Apply iterator to element and all its child in a Depth-First manner
     * @param iterator
     * @param context
     */
    iterate(iterator, context = {}) {
        iterator(this, context);
        if (this.items instanceof Array) {
            for (const child of this.items) {
                child.iterate(iterator, Object.assign({}, context)); // clone context before passing
            }
        }
    }
}
exports.Group = Group;
Group.TYPE = 'group';
//# sourceMappingURL=group.js.map