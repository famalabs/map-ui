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
        this._data.items = data.items instanceof Array ? data.items : [];
    }
    get items() {
        return this._data.items;
    } // FIX: can we avoid cast?
    /**
     * Returns true if all hierarchy is valid
     * @override
     * @returns {boolean}
     */
    isValid() {
        if (!super.isValid())
            return false;
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
    toJSON() {
        const schema = super.toJSON();
        schema.items = this.items.map((el) => el.toJSON()); //TODO: not recursive
        return schema;
    }
}
exports.Group = Group;
Group.TYPE = 'group';
//# sourceMappingURL=group.js.map