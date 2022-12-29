"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionText = void 0;
const question_1 = require("./question");
/**
 * Open ended question
 */
class QuestionText extends question_1.Question {
    constructor(data) {
        super(data);
        if (typeof this.options.format === 'string')
            this.options.format = new RegExp(this.options.format);
    }
    /**
     * @override
     */
    isValid() {
        if (!super.isValid())
            return false;
        if (typeof this.options.min === 'number' &&
            typeof this.options.max === 'number' &&
            !(this.options.min <= this.options.max))
            return false;
        return true;
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
    toJSON() {
        const schema = super.toJSON();
        if (this.options.min > 0)
            schema.options.min = this.options.min;
        if (this.options.max > 0)
            schema.options.max = this.options.max;
        if (this.options.format)
            schema.options.format = this.options.format; // .source
        return schema;
    }
}
exports.QuestionText = QuestionText;
QuestionText.TYPE = 'txt';
//# sourceMappingURL=question-text.js.map