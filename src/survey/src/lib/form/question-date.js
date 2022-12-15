"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionDate = void 0;
const question_1 = require("./question");
/**
 * Represent a question whose answer is a date
 * */
class QuestionDate extends question_1.Question {
    /**
     * @override
     */
    setAnswer(answer) {
        if (answer === null) {
            if (this.required)
                return false;
        }
        else {
            if (!(answer instanceof Date))
                return false;
            if (isNaN(answer.getTime()))
                return false;
            if (this.options.min && answer.getTime() < this.options.min.getTime())
                return false;
            if (this.options.max && answer.getTime() > this.options.max.getTime())
                return false;
        }
        this._answer = answer;
        return true;
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
        return schema;
    }
}
exports.QuestionDate = QuestionDate;
QuestionDate.TYPE = 'date';
//# sourceMappingURL=question-date.js.map