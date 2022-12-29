"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateCompileTime = void 0;
/**
 * Estimate minutes required to compile the item
 * @returns {number} minutes
 */
function estimateCompileTime(item) {
    var _a;
    const WPM = 200;
    const CPW = 5;
    /** reading speed, Characters Per Minute */
    const CPM = CPW * WPM;
    const detectionTime = 0.02;
    let time = 0;
    const q = [item];
    while (q.length > 0) {
        const item = q.shift();
        if (((_a = item.text) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            time += item.text.length / CPM;
            time += detectionTime;
            // time += (item.description) ? (item.description.length / (CPM * 3)) : 0;
        }
        if (item.items instanceof Array) {
            Array.prototype.push.apply(q, item.items);
        }
    }
    return time; // minutes
}
exports.estimateCompileTime = estimateCompileTime;
//# sourceMappingURL=utils.js.map