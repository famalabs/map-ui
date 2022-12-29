"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = exports.SurveyModeException = exports.SurveyMode = void 0;
const engine_1 = require("./engine");
const form_1 = require("./form");
var SurveyMode;
(function (SurveyMode) {
    SurveyMode[SurveyMode["EDIT"] = 0] = "EDIT";
    SurveyMode[SurveyMode["COMPILE"] = 1] = "COMPILE";
})(SurveyMode = exports.SurveyMode || (exports.SurveyMode = {}));
class SurveyModeException extends engine_1.TreeException {
    constructor(current, required) {
        super('Invalid Survey Mode');
        this.current = current;
        this.required = required;
    }
}
exports.SurveyModeException = SurveyModeException;
class Survey extends engine_1.Tree {
    constructor(schema) {
        super(schema);
        this._mode = SurveyMode.EDIT;
        Object.defineProperty(this, '_sources', {
            value: new form_1.DataSourceRepository(),
            enumerable: false,
        });
    }
    get questions() {
        return this._questions;
    }
    get sources() {
        return this._sources;
    }
    /**
     * Survey current mode. Enables functionalities based on this value
     */
    get mode() {
        return this._mode;
    }
    /**
     * Sets answers from a list returning questions
     * @param answers
     * @returns list of questions set
     */
    setAnswers(answers) {
        if (this.mode !== SurveyMode.COMPILE) {
            throw new SurveyModeException(this.mode, SurveyMode.COMPILE);
        }
        const questions = [];
        answers.forEach((a) => {
            const q = this.get(a.id);
            if (q instanceof form_1.Question && q.setAnswer(a.answer)) {
                questions.push(q);
            }
        });
        return questions;
    }
    /**
     * Get all answers
     * @returns
     */
    getAnswers() {
        const items = this.filter((x) => x instanceof form_1.FormItem);
        return items.map((q) => q.getAnswer());
    }
    compute() {
        const functions = this.filter((x) => x instanceof form_1.ItemFunction);
        functions.forEach((fn) => fn.compute());
    }
    /**
     * Reset all submittable or dynamic fields
     */
    reset() {
        for (const id in this._items) {
            const item = this._items[id];
            if (item instanceof form_1.FormItem) {
                item.reset();
            }
        }
    }
    /**
     * Caches tree informations for faster lookups.
     * NOTE: this implies that no more tree operations are allowed
     */
    prepare() {
        // state must be edit?
        // cache values and freeze
        Object.freeze(this._items);
        Object.freeze(this._parents);
        Object.defineProperty(this, '_questions', {
            value: this.filter((item) => item instanceof form_1.Question),
            enumerable: false,
        });
        Object.freeze(this._questions);
        Object.freeze(this._sources);
        this._mode = SurveyMode.COMPILE;
    }
    /**
     * Checks if an item and it's parent hierarchy is active
     * @param id
     * @param activeMap cached results
     * @returns
     */
    isActive(id, activeMap = {}) {
        let item = this.get(id);
        while (item) {
            id = item.id;
            if (activeMap[id] !== undefined)
                return activeMap[id];
            activeMap[id] = item.isActive();
            if (!activeMap[id])
                return false;
            item = this.parent(id);
        }
        return true;
    }
    /**
     * Checks if all the active questions has been submitted
     * @returns
     */
    isSumbitted() {
        if (this.mode !== SurveyMode.COMPILE) {
            throw new SurveyModeException(this.mode, SurveyMode.COMPILE);
        }
        const activeMap = {};
        for (const q of this.questions) {
            if (this.isActive(q.id, activeMap) && !q.isSubmitted())
                return false;
        }
        return true;
    }
}
exports.Survey = Survey;
// export type LookupMap = Record<string, boolean>;
//# sourceMappingURL=survey.js.map