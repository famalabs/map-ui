"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionText = void 0;
const question_1 = require("./question");
/**
 * Open ended question
 */
class QuestionText extends question_1.Question {
    /**
     * @override
     */
    setAnswer(answer) {
        if (answer === null) {
            if (this.required)
                return false;
        }
        else {
            if (typeof answer !== 'string')
                return false;
            if (this.options.min !== undefined && answer.length < this.options.min)
                return false;
            if (this.options.max !== undefined && answer.length > this.options.max)
                return false;
            if (this.options.format && !this.options.format.test(answer))
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
        if (this.options.min > 0)
            schema.options.min = this.options.min;
        if (this.options.max > 0)
            schema.options.max = this.options.max;
        if (this.options.format)
            schema.options.format = this.options.format;
        return schema;
    }
}
exports.QuestionText = QuestionText;
QuestionText.TYPE = 'txt';
//# sourceMappingURL=question-text.js.map