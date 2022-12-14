"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.InvalidOperationException = exports.TreeException = void 0;
const engine_1 = require("./engine");
const operation_1 = require("./operation");
class TreeException extends Error {
}
exports.TreeException = TreeException;
class InvalidOperationException extends TreeException {
}
exports.InvalidOperationException = InvalidOperationException;
class Tree {
    constructor() {
        this.engine = engine_1.engine;
        this.root = null;
        this.items = {};
        this.parents = {};
        this.load({ id: '0', type: 'item' });
    }
    /**
     * Get an item by its id
     * @param id of the item
     * @returns item if exists
     */
    get(id) {
        return this.items[id];
    }
    parent(id) {
        return this.get(this.parents[id]);
    }
    /**
     * Loads the schema of the tree: builds the item and assign it to this.root
     * @param schema of the tree
     * @returns the root
     */
    load(schema) {
        if (!schema)
            return null;
        this.items = {};
        this.parents = {};
        this._id = 0;
        this.root = this.build(schema); // could avoid cast if using an item interface
        this.items[this.root.id] = this.root;
        this.parents[this.root.id] = undefined;
        const queue = [this.root];
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
                    this.items[x.id] = x;
                    this.parents[x.id] = p.id;
                    queue.push(x);
                }
            }
        }
        return this.root;
    }
    /**
     * This function executes one ore more operation on the tree
     * @param ops the operation or an array of operation to be executed: Add, Update, Remove
     * @returns the item(s) added/updated/removed by this operation
     */
    exec(ops) {
        if (ops instanceof Array) {
            const res = [];
            for (const op of ops) {
                const item = this.execute(op);
                res.push(item);
            }
            return res;
        }
        else {
            return this.execute(ops);
        }
    }
    /**
     * Creates a new item or one of its subtypes given the data
     * @param data of the new otem
     * @returns the new item
     */
    build(data) {
        const item = this.engine.build(data);
        item.resolver = this;
        return item;
    }
    /**
     * This function execute a single operation and returns the result (item)
     * @param op the operation to be executed: Add, Update, Remove
     * @returns the added/updated/removed item
     */
    execute(op) {
        if (op.type === operation_1.OperationType.ADD && op) {
            return this.add(op.id, op.data, op.index);
        }
        else if (op.type === operation_1.OperationType.UPDATE && op) {
            return this.update(op.id, op.data, op.index);
        }
        else if (op.type === operation_1.OperationType.REMOVE && op) {
            return this.remove(op.id);
        }
        throw new InvalidOperationException();
    }
    /**
     * Add an item to tree assigning it a unique id
     * @param id of the parent of the new item
     * @param data of the new item
     * @param index
     * @returns the new item
     */
    add(id, data, index) {
        if (index === undefined)
            throw new TreeException('Index undefined');
        const parent = this.get(id);
        const dataWithId = Object.assign({}, data, { id: (++this._id).toString() });
        const item = this.build(dataWithId);
        index = index >= 0 ? index : parent.items.length;
        parent.items.splice(index, 0, item);
        this.parents[item.id] = parent.id;
        this.items[item.id] = item;
        // TODO: add items
        return item;
    }
    /**
     * Update an item with new data and position
     * @param id of the item to update
     * @param data the new data of the item
     * @param index of the new position
     * @returns the updated item
     */
    update(id, data, index) {
        if (index === undefined)
            throw new TreeException('Index is undefined');
        const item = this.get(id);
        if (item === undefined)
            throw new TreeException('Item is undefined');
        if (data) {
            item.update(data);
        }
        if (index >= 0) {
            if (!item.id)
                throw new TreeException('Item id undefined');
            const parent = this.get(this.parents[item.id]);
            const i = parent.items.findIndex((c) => c.id === item.id);
            parent.items.splice(i, 1);
            parent.items.splice(index, 0, item);
        }
        return item;
    }
    /**
     * Remove an item and all its child from the tree
     * @param id of the item to be removed
     * @returns the removed item
     */
    remove(id) {
        const item = this.get(id);
        if (!item.id)
            throw new TreeException('Item id undefined');
        const parent = this.parent(item.id);
        const i = parent.items.findIndex((c) => c.id === item.id);
        parent.items.splice(i, 1);
        const queue = [item];
        while (queue.length > 0) {
            const x = queue.splice(0, 1)[0];
            if (!x.id)
                throw new TreeException('Item id undefined');
            delete this.items[x.id];
            delete this.parents[x.id];
            if (x.items) {
                Array.prototype.push.apply(queue, x.items);
            }
        }
        return item;
    }
    /**
     * This function returns the array of all items matching a predicate
     * @param predicate a function with boolean return type which will be executed on all the items
     * @returns the array of the items which match the predicate
     */
    filter(predicate) {
        if (!this.root)
            return [];
        const res = [];
        for (const key in this.items) {
            const x = this.items[key];
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
    getSchema() {
        return this.root.getSchema();
    }
    /**
     * Returns the first shared parent of two nodes (inverse DFS)
     * @param id1
     * @param id2
     * @returns parent id
     */
    parentOf(id1, id2) {
        if (!(this.get(id1) && this.get(id2)))
            return undefined;
        const nodes = {};
        const q = [id1, id2];
        while (q.length > 0) {
            const id = q.splice(0, 1)[0];
            if (nodes[id])
                return id;
            nodes[id] = true;
            const pid = this.parents[id];
            if (pid !== undefined) {
                q.push(pid);
            }
        }
        return undefined;
    }
    /**
     * Checks if an item is child of a parent
     * @param id
     * @param parent
     * @returns true if id is in parent hierarchy
     */
    isChild(id, parent) {
        if (this.get(parent)) {
            while (id !== undefined) {
                if (id === parent)
                    return true;
                id = this.parents[id];
            }
        }
        return false;
    }
}
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map