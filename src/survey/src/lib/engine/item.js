"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const tslib_1 = require("tslib");
const iterator_1 = require("./iterator");
/* class decorator */
function staticImplements() {
    return (constructor) => {
        constructor;
    };
}
/**
 * Represents a node of the Tree
 */
let Item = class Item {
    constructor(data) {
        Object.defineProperties(this, {
            _data: {
                value: Object.create(null),
                enumerable: true,
            },
        });
        this._data.type = this.constructor.TYPE;
        this.update(data);
        this._data.items =
            this._data.items instanceof Array ? this._data.items : [];
    }
    get id() {
        return this._data.id;
    }
    get type() {
        return this._data.type;
    }
    get name() {
        return this._data.name;
    }
    set name(value) {
        this._data.name = value;
    }
    get text() {
        return this._data.text;
    }
    set text(value) {
        this._data.text = value;
    }
    get description() {
        return this._data.description;
    }
    set description(value) {
        this._data.description = value;
    }
    get items() {
        return this._data.items;
    } // FIX: can we avoid cast?
    // set items(value: Item[]) { this._data.items = value; }
    get layout() {
        return this._data.layout;
    }
    set layout(value) {
        this._data.layout = value;
    }
    get resolver() {
        return this._resolver;
    }
    set resolver(value) {
        Object.defineProperty(this, '_resolver', { value, enumerable: false });
    }
    /**
     * Checks if item should be considered active
     * @returns true if the item is active
     * @virtual
     */
    isActive() {
        return true; // !!this.enabled;
    }
    /**
     * Checks if the item should be considered valid
     * @returns true if the item is valid
     * @virtual
     */
    isValid() {
        return true;
    }
    /**
     * Serializes the item
     * @returns an object representing the schema of the item
     * @virtual
     */
    toJSON() {
        const schema = {
            id: this.id,
            type: this.type,
            items: this.items.map((el) => el.toJSON()), //TODO: not recursive
        };
        if (this.name !== undefined)
            schema.name = this.name;
        if (this.text !== undefined)
            schema.text = this.text;
        if (this.description !== undefined)
            schema.description = this.description;
        if (this.layout !== undefined)
            schema.layout = this.layout;
        return schema;
    }
    update(data) {
        if (data) {
            delete data.type; // avoid type overwriting
            Object.assign(this._data, data);
        }
    }
    get(id) {
        return this.resolver && this.resolver.get(id);
    }
    parent() {
        return this.resolver && this.resolver.parent(this.id);
    }
    // childs(): Item[] {
    //   return this._data.items as any[]; // this.resolver.childs(this.id);
    // }
    /**
     * Recursively checks if parent is a certain item
     * @param item
     * @returns true if inside parent hierarchy
     */
    isChildOf(item) {
        let parent = this;
        if (!item)
            return false;
        while (parent) {
            parent = parent.parent();
            if (parent === item)
                return true;
        }
        return false;
    }
    /**
     * Iterate item and all its child
     * @param mode depth-first-search by default
     */
    hierarchy(mode) {
        return new iterator_1.ItemIterator(this, mode);
    }
};
Item.TYPE = 'item';
Item = tslib_1.__decorate([
    staticImplements(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Item);
exports.Item = Item;
//# sourceMappingURL=item.js.map