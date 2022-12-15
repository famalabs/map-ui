"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionCheck = void 0;
const question_1 = require("./question");
class QuestionCheck extends question_1.Question {
    /**
     * @override
     */
    setAnswer(answer) {
        if (answer === null) {
            if (this.required)
                return false;
        }
        else {
            if (typeof answer !== 'boolean')
                return false;
        }
        this._answer = answer;
        return true;
    }
    /**
     * @override
     */
    getScore() {
        if (this.answer !== undefined) {
            return +this.options.inverted ^ +this.answer;
        }
        return undefined;
    }
    /**
     * @override
     */
    getSchema() {
        const schema = super.getSchema();
        if (this.options.inverted !== undefined)
            schema.options.inverted = this.options.inverted;
        return schema;
    }
}
exports.QuestionCheck = QuestionCheck;
QuestionCheck.TYPE = 'check';
//# sourceMappingURL=question-check.js.map