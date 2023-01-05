"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.CircularPathException = exports.InvalidOperationException = exports.ItemNotFoundException = exports.TreeException = void 0;
const engine_1 = require("./engine");
const operation_1 = require("./operation");
class TreeException extends Error {
}
exports.TreeException = TreeException;
class ItemNotFoundException extends TreeException {
    constructor(id) {
        super(`Item '${id}' not found`);
        this.id = id;
    }
}
exports.ItemNotFoundException = ItemNotFoundException;
class InvalidOperationException extends TreeException {
    constructor(operation) {
        super(`Invalid operation`);
        this.operation = operation;
    }
}
exports.InvalidOperationException = InvalidOperationException;
class CircularPathException extends TreeException {
    constructor() {
        super(`Circual path`);
    }
}
exports.CircularPathException = CircularPathException;
class Tree {
    constructor(schema) {
        this._engine = engine_1.engine;
        this._items = {};
        this._parents = {};
        // protected child: Record<string, string[]> = {};
        this._id = 0;
        this.load(schema || { id: '0', type: 'item' });
    }
    get root() {
        return this._items['0'];
    }
    get size() {
        return Object.keys(this._items).length;
    }
    /**
     * Get an item by its id
     * @param id of the item
     * @returns item
     * @throws {ItemNotFoundException}
     */
    get(id) {
        if (!this._items[id])
            throw new ItemNotFoundException(id);
        return this._items[id];
    }
    /**
     * Get the parent of an item by its id
     * @param id of the item
     * @returns parent
     * @throws {ItemNotFoundException}
     */
    parent(id) {
        if (!this._items[id])
            throw new ItemNotFoundException(id);
        return this._items[this._parents[id]];
    }
    /**
     * Loads the schema of the tree, replacing items if already present
     * @param schema
     * @returns the root of the loaded schema
     */
    load(schema) {
        const root = this.build(schema);
        this._items[root.id] = root;
        this._parents[root.id] = undefined;
        const queue = [root];
        while (queue.length > 0) {
            const p = queue.shift();
            // ensure id points correctly to last item id
            const idnum = Number(p.id);
            if (idnum > this._id) {
                this._id = idnum;
            }
            if (p.items instanceof Array) {
                for (let i = 0; i < p.items.length; i++) {
                    const x = this.build(p.items[i]);
                    p.items[i] = x;
                    this._items[x.id] = x;
                    this._parents[x.id] = p.id;
                    queue.push(x);
                }
            }
        }
        return root;
    }
    /**
     * Creates a new item or one of its subtypes given the data
     * @param data of the new otem
     * @returns the new item
     * @throws {Error}
     */
    build(data) {
        const item = this._engine.build(data);
        item.resolver = this;
        return item;
    }
    /**
     * Execute an operation returning the result Item
     * @param op the operation to be executed: Add, Update, Remove
     * @returns the added/updated/removed item
     * @throws {InvalidOperationException}
     */
    execute(op) {
        if (!op) {
            // do nothing
        }
        else if (op.type === operation_1.OperationType.ADD && op) {
            return this.add(op.id, op.data, op.index);
        }
        else if (op.type === operation_1.OperationType.UPDATE && op) {
            return this.update(op.id, op.data);
        }
        else if (op.type === operation_1.OperationType.REMOVE && op) {
            return this.remove(op.id);
        }
        else if (op.type === operation_1.OperationType.MOVE && op) {
            return this.move(op.id, op.index, op.parent);
        }
        throw new InvalidOperationException(op);
    }
    /**
     * Adds an item to the tree assigning it a unique id
     * @param id of the parent
     * @param data of the new item
     * @param index position
     * @returns the new item
     * @throws {ItemNotFoundException}
     */
    add(id, data, index) {
        const parent = this.get(id);
        if (this._engine.isRegistered(data === null || data === void 0 ? void 0 : data.type)) {
            Object.assign(data, { id: (++this._id).toString(), items: [] });
            const item = this.build(data);
            index = index >= 0 ? index : parent.items.length;
            parent.items.splice(index, 0, item);
            this._parents[item.id] = parent.id;
            this._items[item.id] = item;
            return item;
        }
    }
    /**
     * Update an item data
     * @param id of the item to update
     * @param data the new data of the item
     * @returns the item
     * @throws {ItemNotFoundException}
     */
    update(id, data) {
        const item = this.get(id);
        if (data) {
            // remove sensitive data
            delete data.id;
            delete data.type;
            delete data.items;
            item.update(data);
        }
        return item;
    }
    /**
     * Remove an item hierarchy from the tree
     * @param id of the item
     * @returns the removed item hierarchy
     * @throws {ItemNotFoundException}
     */
    remove(id) {
        const item = this.get(id);
        const parent = this.parent(item.id);
        const i = parent.items.findIndex((c) => c.id === item.id);
        parent.items.splice(i, 1);
        const queue = [item];
        while (queue.length > 0) {
            const x = queue.shift();
            delete this._items[x.id];
            delete this._parents[x.id];
            if (x.items) {
                Array.prototype.push.apply(queue, x.items);
            }
        }
        return item;
    }
    /**
     * Moves an item hierarchy to a new position or parent
     * @param id of the item
     * @param index position
     * @param parent new parent
     * @throws {ItemNotFoundException}
     * @throws {CircularPathException}
     * @returns the item
     */
    move(id, index, parent) {
        const item = this.get(id);
        const prev = this.parent(id);
        const next = parent !== undefined ? this.get(parent) : prev;
        if (prev !== next && next.isChildOf(item))
            throw new CircularPathException();
        const i = prev.items.findIndex((c) => c.id === item.id);
        prev.items.splice(i, 1);
        index = index >= 0 ? index : next.items.length;
        next.items.splice(index, 0, item);
        this._parents[item.id] = next.id;
        return item;
    }
    /**
     * This function returns the array of all items matching a predicate
     * @param predicate a function with boolean return type which will be executed on all the items
     * @returns the array of the items which match the predicate
     */
    filter(predicate) {
        const res = [];
        for (const key in this._items) {
            const x = this._items[key];
            const match = predicate(x);
            if (match) {
                res.push(x);
            }
        }
        return res;
    }
    /**
     * Gets the serialization of the tree
     * @returns the schema of the tree
     */
    toJSON() {
        return this.root.toJSON();
    }
    /**
     * Gets the shared root of two items (inverse DFS)
     * @param id1
     * @param id2
     * @returns id
     * @throws {ItemNotFoundException}
     */
    rootOf(id1, id2) {
        this.get(id1);
        this.get(id2);
        const nodes = {};
        const q = [id1, id2];
        while (q.length > 0) {
            const id = q.shift();
            if (nodes[id])
                return id;
            nodes[id] = true;
            const pid = this._parents[id];
            if (pid !== undefined) {
                q.push(pid);
            }
        }
    }
    /**
     * Gets the path between two items
     * @param id1
     * @param id2
     * @returns id path
     * @throws {ItemNotFoundException}
     */
    path(id1, id2) {
        const root = this.rootOf(id1, id2);
        const p1 = [], p2 = [];
        while (id1 !== root) {
            p1.push(id1);
            id1 = this._parents[id1];
        }
        while (id2 !== root) {
            p2.unshift(id2);
            id2 = this._parents[id2];
        }
        return p1.concat(root, p2);
    }
}
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map