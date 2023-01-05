"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionDate = void 0;
const question_1 = require("./question");
/**
 * Represent a question whose answer is a date
 * */
class QuestionDate extends question_1.Question {
    constructor(data) {
        super(data);
        this.options.min = QuestionDate.parse(this.options.min);
        this.options.max = QuestionDate.parse(this.options.max);
    }
    /**
     * @override
     */
    isValid() {
        if (!super.isValid())
            return false;
        if (this.options.min &&
            this.options.max &&
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
            answer = QuestionDate.parse(answer);
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
    toJSON() {
        const schema = super.toJSON();
        if (this.options.min)
            schema.options.min = this.options.min;
        if (this.options.max)
            schema.options.max = this.options.max;
        if (this.options.unit)
            schema.options.unit = this.options.unit;
        return schema;
    }
    /**
     * Converts a valid primitive to date
     * @param value
     * @returns
     */
    static parse(value) {
        return (typeof value === 'string' || typeof value === 'number') ? new Date(value) : value;
    }
}
exports.QuestionDate = QuestionDate;
QuestionDate.TYPE = 'date';
//# sourceMappingURL=question-date.js.map