"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionNumber = void 0;
const question_1 = require("./question");
/**
 * Represent a questions whose answer is a number
 */
class QuestionNumber extends question_1.Question {
    /**
     * @override
     */
    setAnswer(answer) {
        if (answer === null) {
            if (this.required)
                return false;
        }
        else {
            if (typeof answer !== 'number' || isNaN(answer))
                return false;
            if (this.options.max !== undefined && answer > this.options.max)
                return false;
            if (this.options.min !== undefined && answer < this.options.min)
                return false;
        }
        this._answer = answer;
        return true;
    }
    /**
     * @override
     */
    getScore() {
        return (typeof this.answer === 'number') ? this.answer : undefined;
    }
    /**
     * @override
     */
    getSchema() {
        const schema = super.getSchema();
        if (this.options.min !== undefined)
            schema.options.min = this.options.min;
        if (this.options.max !== undefined)
            schema.options.max = this.options.max;
        if (this.options.step !== undefined)
            schema.options.step = this.options.step;
        if (this.options.unit !== undefined)
            schema.options.unit = this.options.unit;
        return schema;
    }
}
exports.QuestionNumber = QuestionNumber;
QuestionNumber.TYPE = 'num';
//# sourceMappingURL=question-number.js.map