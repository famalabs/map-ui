import {SurveyItem} from "./survey-item";

export enum TYPE {
  // Item = 0,
  Survey = 1,
  Group = 2,
  ItemTable = 5,
  // Questions
  QuestionCheck = 10,
  QuestionText = 11,
  QuestionNumber = 12,
  QuestionDate = 13,
  QuestionSelect = 14,
  // Listeners
  ItemFunction = 20,
}

export const CONSTRUCTORS: {
  [key: string]: Function
} = {
  Survey: SurveyItem,
  Group: SurveyItem,
};

export function getConstructor(type: TYPE) {

}

export function getType() {

}
