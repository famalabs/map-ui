"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionList = void 0;
const question_1 = require("./question");
/**
 * Open ended question
 */
class QuestionList extends question_1.Question {
    /**
     * @override
     */
    setAnswer(answers) {
        if (answers === null) {
            if (this.required)
                return false;
        }
        else {
            if (!(answers instanceof Array))
                return false;
            if (this.options.min !== undefined && answers.length < this.options.min)
                return false;
            if (this.options.max !== undefined && answers.length > this.options.max)
                return false;
            if (this.options.source) {
                const source = this.source();
                for (const x of answers) {
                    if (!source.has(x))
                        return false;
                }
            }
        }
        this._answer = answers;
        return true;
    }
    /**
     * Gets the DataSource instance from the resolver
     * @returns
     */
    source() {
        const resolver = this.resolver; // can improve from form-item
        return resolver
            && resolver.sources
            && resolver.sources.get(this.options.source);
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
        if (this.options.source)
            schema.options.source = this.options.source;
        return schema;
    }
}
exports.QuestionList = QuestionList;
QuestionList.TYPE = 'array';
//# sourceMappingURL=question-list.js.map