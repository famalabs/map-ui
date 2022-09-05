import {DocumentRenderer} from './renderer';
import {SurveyItem} from './survey-item';
import {Question} from './question';
import {QuestionCheck} from './question-check';
import {QuestionText} from './question-text';
import {QuestionNumber} from './question-number';
import {QuestionDate} from './question-date';
import {QuestionSelect} from './question-select';
import {DBAnswer} from './answer';
import {ItemFunction} from './item-function';
import {ItemTable} from './item-table';
import {isId} from './config';
import {FeaturesMap, Field, FieldsMap, IterationContext} from "./interfaces";

export class Survey {
  root: SurveyItem;
  renderer: DocumentRenderer;

  public constructor(schema: any) {
    this.renderer = new DocumentRenderer();
    this.root = this.LoadSchema(schema);
    if (this.isInitialized()) {
      this.root.parent = null;
    }
  }
  public static schemaFromJSON = (json: string): Object => {
    // console.log(json);
    const jsonObject = JSON.parse(json);
    return jsonObject;
  };  

  isInitialized(): boolean {
    return this.root instanceof SurveyItem;
  }

  filter<T extends SurveyItem>(...constructors: { new(): T }[]): Array<T> {
    let items: Array<T> = [];
    this.iterateAll((item) => {
      for (let i = 0; i < constructors.length; i++) {
        if (item instanceof constructors[i]) {
          items.push(item);
          break;
        }
      }
    });
    return items;
  }

  getAnswers(questions?: Array<Question>): Array<DBAnswer> {
    if (!(questions instanceof Array))
      questions = this.filter(Question);
    let uniques = {};
    return questions.map((question) => {
      if (question && question.answer !== undefined && !uniques[question.id]) {
        uniques[question.id] = true;
        return question.getAnswer();
      }
      return undefined;
    }).filter((a) => a !== undefined);
  }

  setAnswers(answers: Array<DBAnswer>): Array<Question> {
    const survey = this;
    return answers.map(function (answer: DBAnswer) {
      if (answer) {
        let item = survey.renderer.get(answer.id);
        if (item instanceof Question) {
          item.setAnswer(answer.answer);
          return item;
        }
      }
      return undefined;
    }).filter((q) => q !== undefined);
  }

  isValid(): boolean {
    if (this.isInitialized())
      return this.root.isValid();
  }

  createItem(parent: SurveyItem, data: any): SurveyItem {
    let item = this.LoadSchema(data);
    if (!item)
      return null;
    if (!parent.insertItem(item))
      return null;
    return item;
  }

  removeItem(parent: SurveyItem, item: SurveyItem): boolean {
    if (!item)
      return false;
    if (!parent.removeItem(item))
      return false;
    this.renderer.removeItem(item);
    return true;
  }

  getSchema(): SurveyItem {
    if (this.isInitialized())
      return this.root.getSchema();
  }

  protected LoadSchema(data: any): SurveyItem {
    const survey = this;
    if (!data)
      return null;
    let item: SurveyItem = ItemConstructor(data);
    if (item) {
      if (!item.id) {
        item.id = survey.renderer.getNewId();
      }
      if (!survey.renderer.insertItem(item))
        return null;
      if (item.items instanceof Array) {
        let itemsdata = item.items;
        item.items = [];
        itemsdata.forEach(function (itemdata) {
          let child = survey.LoadSchema(itemdata);
          item.insertItem(child);
        });
      }
    }
    return item;
  }

  compute(functions?: Array<ItemFunction<any>>): Array<ItemFunction<any>> {
    if (!(functions instanceof Array))
      functions = this.filter(ItemFunction);
    functions.forEach((fn) => fn && fn.compute());
    return functions;
  }

  getResults(functions?: Array<ItemFunction<any>>): Array<DBAnswer> {
    if (!(functions instanceof Array))
      functions = this.filter(ItemFunction);
    return functions.map((fn) => {
      if (fn instanceof ItemFunction && fn.hasValidParams())
        return fn.getResult();
      return undefined;
    }).filter((a) => a !== undefined);
  }

  checkEqual(document: Survey, customCheck?: (item1: SurveyItem, item2: SurveyItem) => boolean): boolean {
    if (!this.isInitialized() || this.renderer.size() !== document.renderer.size())
      return false;
    this.iterateAll((item) => {
      let match = document.renderer.get(item.id);
      if (!match || item.constructor !== match.constructor)
        return false;
      if (customCheck && !customCheck(item, match))
        return false;
    });
    return true;
  }

  getFields(options?): FieldsMap {
    const root = this.root;
    const fields: FieldsMap = {};
    options = options || {};
    const context: IterationContext = options.context || {name: ''};
    let index = context.index || 0;
    this.iterateAll((item: SurveyItem, context: IterationContext) => {
      if (item === root) // skip root element
        return;
      context.name += (context.name.length > 0 && context.name.slice(-1) !== '.') ? '.' : '';
      context.name += item.name || item.id; // fallback to id when no name is provided
      context.text = item.text;
      const field: Field = {name: context.name, index, text: context.text};
      if (item instanceof Question || item instanceof ItemFunction) {
        if (item instanceof QuestionSelect) {
          field.options = item.selectOptions.slice(0);
        }
        fields[item.id] = field;
        index++;
      } else if (options.all) {
        fields[item.id] = field;
        index++;
      }
    }, context);
    return fields;
  }

  iterateAll(iterator: (item: SurveyItem, context: IterationContext) => any, context?: IterationContext): number {
    if (this.isInitialized()) {
      const map: Record<string, boolean> = {}; // ensure no loops
      context = context || {name: ''};
      const queue: { item: SurveyItem, context: IterationContext }[] = [{item: this.root, context}];
      while (queue.length > 0) {
        const {item, context} = queue.shift();
        if (item instanceof SurveyItem && isId(item.id)) {
          let id = item.id.toString();
          if (!map[id]) {
            map[id] = true;
            if (iterator(item, context) === false) // allow early break
              break;
            if (item.items instanceof Array) {
              Array.prototype.unshift.apply(queue, item.items.map((child) => {
                return {item: child, context: {...context}};
              }));
            }
          }
        }
      }
      return Object.keys(map).length;
    }
  }

  estimateCompileTime(): number {
    return Math.ceil(this.root.estimateCompileTime());
  }

  getFeaturesMap(filter: Object): FeaturesMap {
    const features: FeaturesMap = {};
    this.iterateAll((item: SurveyItem) => {
      if (item.name && filter[item.name]) {
        // should check for duplicates
        features[item.name] = item.id.toString();
        return false; // children belongs to this feature
      }
    });
    return features;
  }

  getFeaturesData(featureMap: Object): { [key: string]: any } {
    const survey = this;
    const data = {};
    if (featureMap) {
      Object.keys(featureMap).forEach((f) => {
        let rootItem = survey.renderer.get(featureMap[f]);
        if (rootItem) {
          data[f] = {};
          rootItem.iterate((item, context) => {
            if (item === rootItem) // skip first item
              return;
            if (item.name) {
              context.key += item.name;
              if (item instanceof Question) {
                data[f][context.key] = item.answer;
              } else if (item instanceof ItemFunction) {
                data[f][context.key] = item.result;
              }
              context.key += '.';
            }
          }, {key: ''});
        }
      });
    }
    return data;
  }

  setFeaturesData(featureMap: Object, data: Object) {
    const survey = this;
    Object.keys(data).forEach((f) => {
      if (featureMap[f]) {
        let rootItem: SurveyItem = survey.renderer.get(featureMap[f]);
        if (rootItem) {
          rootItem.iterate((item, context) => {
            if (item === rootItem) // skip first item
              return;
            if (item.name) {
              context.key += item.name;
              if (data[f][context.key] !== undefined) {
                if (item instanceof Question) {
                  item.answer = data[f][context.key];
                } else if (item instanceof ItemFunction) {
                  item.result = data[f][context.key];
                }
              }
              context.key += '.';
            }
          }, {key: ''});
        }
      }
    });
  }

  reset() {
    this.iterateAll((item) => {
      if (item instanceof Question) {
        item.answer = undefined;
      } else if (item instanceof ItemFunction) {
        item.result = undefined;
      }
    });
  }

}

let constructorsMap = {};

/**
 * Dynamically create a SurveyItem based on its data.type
 * @param data
 * @returns {SurveyItem}
 */
export function ItemConstructor(data: any): SurveyItem {
  if (data.type && isTypeRegistered(data.type))
    return new constructorsMap[data.type](data);
}

export function getRegisteredTypes(): Array<string> {
  return Object.keys(constructorsMap);
}

export function getRegisteredConstructors(): Array<any> {
  return Object.keys(constructorsMap).map((key) => constructorsMap[key]);
}

export function isTypeRegistered(type: string) {
  return typeof constructorsMap[type] === 'function';
}

export function getTypeConstructor(type: string) {
  return constructorsMap[type];
}

export function RegisterItemConstructor(constructor: Function, ...type: string[]): boolean {
  if ((constructor !== SurveyItem) && !(constructor.prototype instanceof SurveyItem))
    return false;
  if (type instanceof Array) {
    for (let t of type) {
      constructorsMap[t] = constructor;
    }
    return true;
  }
  return false;
}

RegisterItemConstructor(SurveyItem, 'Item', 'Survey', 'Group');
RegisterItemConstructor(Question, 'Question');
RegisterItemConstructor(QuestionCheck, 'QuestionCheck', 'QCheck');
RegisterItemConstructor(QuestionText, 'QuestionText', 'QText');
RegisterItemConstructor(QuestionNumber, 'QuestionNumber', 'QNum');
RegisterItemConstructor(QuestionDate, 'QuestionDate', 'QDate');
RegisterItemConstructor(QuestionSelect, 'QuestionSelect', 'QSelect');
RegisterItemConstructor(ItemFunction, 'ItemFunction', 'Fn');
RegisterItemConstructor(ItemTable, 'ItemTable', 'Table');
