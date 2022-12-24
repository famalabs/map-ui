"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
/**
 * Represents a node of the Tree
 */
class Item {
    constructor(data) {
        Object.defineProperty(this, '_data', {
            value: Object.create(null),
            enumerable: false,
        });
        this.update(data);
        this._data.items = (this._data.items instanceof Array) ? this._data.items : [];
    }
    get id() { return this._data.id; }
    get type() { return this.constructor.TYPE; } // FIX: can be improved
    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }
    get text() { return this._data.text; }
    set text(value) { this._data.text = value; }
    get items() { return this._data.items; } // FIX: can we avoid cast?
    // set items(value: Item[]) { this._data.items = value; }
    get layout() { return this._data.layout; }
    set layout(value) { this._data.layout = value; }
    get resolver() { return this._resolver; }
    set resolver(value) { Object.defineProperty(this, '_resolver', { value, enumerable: false }); }
    /**
     * This method checks whether the item is considered active
     * @returns true if the item is active, false otherwise
     * @virtual
     */
    isActive() {
        return true; // !!this.enabled;
    }
    /**
     * Checks if the hierarchy is considered valid
     * @returns {boolean} true if all items are valid
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
     * Serializes the item
     * @returns {DBSchema} on object representing the schema of the item
     */
    getSchema() {
        const s = {
            id: this.id,
            type: this.type,
            items: this.items.map((el) => el ?? el.getSchema()), //TODO: not recursive
        };
        if (this.name !== undefined)
            s.name = this.name;
        if (this.text !== undefined)
            s.text = this.text;
        if (this.layout !== undefined)
            s.layout = this.layout;
        return s;
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
    update(data) {
        Object.assign(this._data, data);
    }
}
exports.Item = Item;
Item.TYPE = 'item';
//# sourceMappingURL=item.js.map