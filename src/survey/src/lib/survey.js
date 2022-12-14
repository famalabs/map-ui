"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = exports.SurveyModeException = exports.SurveyException = exports.SurveyMode = void 0;
const engine_1 = require("./engine");
const form_1 = require("./form");
var SurveyMode;
(function (SurveyMode) {
    SurveyMode[SurveyMode["EDIT"] = 0] = "EDIT";
    SurveyMode[SurveyMode["COMPILE"] = 1] = "COMPILE";
    SurveyMode[SurveyMode["READONLY"] = 2] = "READONLY";
})(SurveyMode = exports.SurveyMode || (exports.SurveyMode = {}));
class SurveyException extends Error {
}
exports.SurveyException = SurveyException;
class SurveyModeException extends SurveyException {
    constructor(current, required) {
        super('Invalid Survey Mode');
        this.current = current;
        this.required = required;
    }
}
exports.SurveyModeException = SurveyModeException;
/**
 * TODO:
 * Item represents a single item -> Questions, ItemFunction (are always leaves)
 * Group is a ConditionalItem with childs (recursive)
 * Add caching (question lookups)
 *
 * - select other <- conditionalItem?
 * dynamic (non input) should have constraints on how far they can fetch values
 *
 * Scores lib -> functions executable
 */
class Survey extends engine_1.Tree {
    constructor() {
        super();
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
        return this.mode;
    }
    /**
     * @override
     * @param schema
     * @returns
     */
    load(schema, mode) {
        if (this._mode !== undefined) {
            throw new SurveyModeException(this._mode, undefined);
        }
        const root = super.load(schema);
        Object.defineProperty(this, '_mode', { value: mode, enumerable: false });
        return root;
    }
    /**
     * Sets answers from a list returning questions
     * @param answers
     * @returns list of questions set
     */
    setAnswers(answers) {
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
        for (const id in this.items) {
            const item = this.items[id];
            if (item instanceof form_1.FormItem) {
                item.reset();
            }
        }
    }
    /**
     * Caches tree informations for faster lookups.
     * NOTE: this implies that no subsequent modifications will happen
     */
    _cache() {
        if (!(this.mode === SurveyMode.COMPILE || this.mode === SurveyMode.READONLY))
            return;
        // load answerables
        if (!this._questions) {
            Object.freeze(this.items);
            Object.defineProperty(this, '_questions', {
                value: [],
                enumerable: false,
            });
            for (const id in this.items) {
                const item = this.items[id];
                if (item instanceof form_1.Question) {
                    this._questions.push(item);
                }
            }
            Object.freeze(this._questions);
        }
        // load sources
        if (!this._sources) {
            Object.freeze(this._sources);
        }
    }
    /**
     * Checks if an item and it's parent hierarchy is active
     * @param id
     * @param activeMap cached results
     * @returns
     */
    isActive(id, activeMap = {}) {
        let item = this.get(id);
        if (!item)
            return undefined;
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
}
exports.Survey = Survey;
// export type LookupMap = Record<string, boolean>;
//# sourceMappingURL=survey.js.map