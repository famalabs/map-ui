"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScore = exports.FormItem = void 0;
const engine_1 = require("../engine");
/**
 * Class representing dynamic items (e.g: can receive inputs from user)
 */
class FormItem extends engine_1.Item {
}
exports.FormItem = FormItem;
/**
 * Utility function to get the score from an item
 * @param item
 * @returns
 */
function getScore(item) {
    var _a;
    if (item instanceof FormItem) {
        return (_a = item.getAnswer()) === null || _a === void 0 ? void 0 : _a.score;
    }
}
exports.getScore = getScore;
//# sourceMappingURL=form-item.js.map