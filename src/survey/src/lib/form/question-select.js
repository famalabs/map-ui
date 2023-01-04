"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSelect = void 0;
const question_1 = require("./question");
class QuestionSelect extends question_1.Question {
    constructor(data) {
        super(data);
        if (!(this.options.select instanceof Array))
            this.options.select = [];
    }
    get select() {
        return this._data.options.select;
    }
    /**
     * @override
     */
    isValid() {
        if (!super.isValid())
            return false;
        return true;
    }
    /**
     * @returns the selected option, undefined otherwise
     */
    selectedOption() {
        return this.isValidIndex(this.answer)
            ? this.select[this.answer]
            : undefined;
    }
    /**
     * @override
     */
    setAnswer(answer) {
        if (answer === null) {
            if (this.required)
                return false;
        }
        else {
            if (!this.isValidIndex(answer))
                return false;
        }
        this._answer = answer;
        return true;
    }
    /**
     * @override
     */
    getScore() {
        var _a;
        return (_a = this.selectedOption()) === null || _a === void 0 ? void 0 : _a.score;
    }
    isValidIndex(index) {
        return (typeof index === 'number' &&
            index >= 0 &&
            index < this.select.length &&
            ~~index === index);
    }
    /**
     * @override
     */
    toJSON() {
        const schema = super.toJSON();
        schema.options.select = this.options.select;
        return schema;
    }
    /**
     * Add a new TextOption at a specified index if valid or at the end of the list
     * @param opt
     * @param index
     */
    addSelect(opt, index) {
        if (this.isValidIndex(index)) {
            this.select.splice(index, 0, opt);
        }
        else {
            this.select.push(opt);
        }
    }
    /**
     * Updates the TextScore at the specified index
     * @param index of the TextScore to update
     * @param opt
     */
    updateSelect(index, opt) {
        if (this.isValidIndex(index))
            this.select[index] = opt;
    }
    /**
     * Removes the TextScore at the specified index
     * @param index of the TextScore to remove
     */
    removeSelect(index) {
        if (this.isValidIndex(index))
            this.select.splice(index, 1)[0];
    }
}
exports.QuestionSelect = QuestionSelect;
QuestionSelect.TYPE = 'select';
//# sourceMappingURL=question-select.js.map