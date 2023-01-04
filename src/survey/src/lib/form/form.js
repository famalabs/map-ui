"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("../engine");
const item_conditional_1 = require("./item-conditional");
const item_function_1 = require("./item-function");
const question_check_1 = require("./question-check");
const question_date_1 = require("./question-date");
const question_number_1 = require("./question-number");
const question_select_1 = require("./question-select");
const question_text_1 = require("./question-text");
const question_list_1 = require("./question-list");
/*
  initialize the engine by registering the constructors
*/
engine_1.register(item_conditional_1.ItemConditional);
engine_1.register(item_function_1.ItemFunction);
engine_1.register(question_check_1.QuestionCheck);
engine_1.register(question_date_1.QuestionDate);
engine_1.register(question_number_1.QuestionNumber);
engine_1.register(question_select_1.QuestionSelect);
engine_1.register(question_text_1.QuestionText);
engine_1.register(question_list_1.QuestionList);
//# sourceMappingURL=form.js.map