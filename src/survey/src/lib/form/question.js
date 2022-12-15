"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const form_item_1 = require("./form-item");
/**
 * Abstract class to create form questions
 */
class Question extends form_item_1.FormItem {
    constructor(data) {
        super(data);
        this._data.options = (typeof data.options === 'object' && data.options !== null) ? data.options : Object.create(null);
        Object.defineProperty(this, '_answer', {
            value: undefined,
            enumerable: false,
            writable: true,
        });
        if (this._data.options.default !== undefined)
            this._answer = this._data.options.default;
    }
    get answer() { return this._answer; }
    /**
     * configuration parameters
     */
    get options() { return this._data.options; }
    /**
     * Shortcut for options.required
     * True by default
     */
    get required() { return this.options.required !== false; }
    setOption(key, value) {
        this.options[key] = value;
    }
    /**
     * Checks if the question has a valid answer
     * @returns true if answer is valid, false otherwise
     */
    isValid() {
        if (!super.isValid())
            return false;
        if (this.answer === undefined)
            return false;
        if (this.required && this.answer === null)
            return false;
        return true;
    }
    /**
     * @override
     */
    getSchema() {
        const schema = super.getSchema();
        // schema.options = this.options; // unfiltered
        schema.options = {};
        if (this.options.required !== undefined)
            schema.options.required = this.options.required;
        if (this.options.default !== undefined)
            schema.options.default = this.options.default;
        return schema;
    }
    /**
     * This method returns the user answer
     * @returns the answer of the user
     */
    getAnswer() {
        return {
            id: this.id,
            answer: this.answer,
            score: this.getScore(),
        };
    }
    /**
     * @returns the numeric score of the question or undefined if it doesn't have any
     */
    getScore() {
        return undefined;
    }
    reset() {
        this._answer = undefined;
    }
}
exports.Question = Question;
//# sourceMappingURL=question.js.map