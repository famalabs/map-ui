import {SurveyItem} from './survey-item';
import {isId} from "./config";

export class DocumentRenderer {
  // progressive ids
  protected nextId: number;
  // id are internally mapped as strings
  protected map: Object;

  // protected namedMap: Object;

  constructor() {
    this.map = {};
    this.nextId = 1;
  }

  getNewId(): string {
    let newId = this.nextId++;
    return newId.toString();
  }

  insertItem(element: SurveyItem): boolean {
    if (!(element && element.id))
      return false;
    if (this.has(element.id))
      return false;
    if (!this.set(element.id, element))
      return false;
    let intId: number = (!isNaN(Number(element.id)) && (Number(element.id) % 1 === 0)) ? Number(element.id) : 0;
    this.nextId = Math.max(this.nextId, intId + 1);
    return true;
  }

  removeItem(element: SurveyItem): boolean {
    if (!(element && element.id))
      return false;
    if (!this.has(element.id))
      return false;
    this.delete(element.id);
    if (element.items instanceof Array)
      element.items.forEach(this.removeItem, this);
    return true;
  }

  has(id: number | string): boolean {
    return this.map.hasOwnProperty(String(id));
  }

  get(id: number | string): SurveyItem {
    return this.map[String(id)];
  }

  set(id: number | string, item: SurveyItem): boolean {
    if (isId(id)) {
      id = id.toString();
      this.map[id] = item;
      item.renderer = this;
      return true;
    }
  }

  delete(id: number | string): boolean {
    if (!this.has(id))
      return false;
    delete this.map[String(id)];
    return true;
  }

  size(): number {
    return Object.keys(this.map).length;
  }

}
