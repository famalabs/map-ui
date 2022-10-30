import React from 'react';
import {DocumentRenderer} from './renderer';
import {isId, isValidField, isValidName} from './config';
import { Form } from '@src/components';

export class SurveyItem {
  id: string;
  type: string;
  name: string;
  text: string;
  items: Array<SurveyItem>;
  options: any;
  layout: any;
  description: string;
  bibliography: string;

  renderer: DocumentRenderer; // shared renderer
  parent: SurveyItem;

  constructor(data: any = {}) {
    this.id = (isId(data.id)) ? data.id.toString() : null;
    this.type = data.type || this.constructor.name;
    if (isValidName(data.name))
      this.name = data.name;
    if (isValidField(data.text))
      this.text = data.text;
    this.items = data.items || [];
    this.options = data.options || {};
    this.layout = data.layout || {};
    if (isValidField(data.description))
      this.description = data.description;
  }

  /**
   * Returns true if all items are valid
   * @returns {boolean}
   */
  isValid(): boolean {
    if (this.items instanceof Array) {
      for (let i = 0; i < this.items.length; i++) {
        if (!this.items[i].isValid())
          return false;
      }
    }
    return true;
  }

  /**
   *
   * @param {SurveyItem} item
   * @returns {boolean}
   */
  insertItem(item: SurveyItem): boolean {
    if (!(this.items instanceof Array))
      return false;
    if (item && item instanceof SurveyItem) {
      this.items.push(item);
      item.parent = this;
      return true;
    }
    return false;
  }

  /**
   *
   * @param {SurveyItem} item
   * @returns {boolean}
   */
   removeItem(item: SurveyItem): boolean {
    let itemIndex = this.getChildIndex(item);
    console.log('rem', item, itemIndex);
    return this.removeItemByIdx(itemIndex);
  }  /**

  *
  * @param {SurveyItem} item
  * @returns {boolean}
  */
 removeItemByIdx(itemIndex: number): boolean {
   if (!(itemIndex >= 0 && itemIndex < this.items.length)) {
     return false;
   }
   this.items[itemIndex].parent = undefined;
   this.items.splice(itemIndex, 1);
   return true;
 }

  /**
   *
   * @param {SurveyItem} item
   * @param {number} position
   * @returns {boolean}
   */
  moveItemToPosition(item: SurveyItem, position: number): boolean {
    let itemIndex = this.getChildIndex(item);
    if (!(itemIndex >= 0))
      return false;
    if (position < 0 || position >= this.items.length)
      return false;
    if (position !== itemIndex) {
      this.items.splice(itemIndex, 1);
      this.items.splice(position, 0, item);
      return true;
    }
    return false;
  }

  /**
   * Get child item index
   * @param {SurveyItem} item
   * @returns {number}
   */
  getChildIndex(item: SurveyItem): number {
    return (!(this.items instanceof Array)) ? null : this.items.map((item) => item.id).indexOf(item.id);
  }

  /**
   * Get an array mapping items.id -> index
   * @returns {Object}
   */
  getChildIndexes() {
    let itemIndexes = {};
    if (this.items instanceof Array) {
      this.items.forEach(function (item, index) {
        itemIndexes[item.id] = index;
      });
    }
    return itemIndexes;
  }

  /**
   * Extract schema fields
   * @returns {any} schema
   */
  getSchema(): any {
    let schema: any = {
      id: this.id,
      type: this.type
    };
    if (isValidName(this.name))
      schema.name = this.name;
    if (isValidField(this.text))
      schema.text = this.text;
    if (this.items instanceof Array && this.items.length > 0) {
      schema.items = this.items.map((item) => item.getSchema());
    }
    if (this.layout && Object.keys(this.layout).length > 0) {
      schema.layout = this.layout;
    }
    if (isValidField(this.description))
      schema.description = this.description;
    return schema;
  }

  /**
   * Copy item schema without ids
   * @returns {any} schema
   */
  duplicate(): any {
    let schema = this.getSchema();
    if (schema.items instanceof Array) {
      let items = schema.items.slice(0);
      while (items.length > 0) {
        let item = items.shift();
        if (item) {
          delete item.id;
          if (item.items instanceof Array) {
            Array.prototype.push.apply(items, item.items);
          }
        }
      }
    }
    // schema.name = "dup-" + schema.id;
    delete schema.id;
    return schema;
  }

  /**
   * Apply iterator to element and all its child items
   * @param iterator
   * @param context
   */
  iterate(iterator: (item: SurveyItem, context: any) => void, context: any = {}) {
    iterator(this, context);
    if (this.items instanceof Array) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].iterate(iterator, {...context}); // clone context before passing
      }
    }
  }

  /**
   * Checks if item is in the parent hierarchy of this
   * @param {SurveyItem} item
   * @returns {boolean}
   */
  isChildOf(item: SurveyItem): boolean {
    let parent = this.parent;
    while (parent && (parent !== item)) {
      parent = parent.parent;
    }
    return parent === item;
  }

  /**
   * Estimate minutes required to compile the item
   * @returns {number} minutes
   */
  estimateCompileTime(): number {
    const WPM = 300;
    const CPW = 3;
    const CPM = CPW * WPM;
    const detectionTime = 0.02;
    let time = 0;
    time += (this.text) ? (this.text.length / CPM) : 0;
    time += detectionTime;
    // time += (this.description) ? (this.description.length / (CPM * 3)) : 0;
    if (this.items instanceof Array) {
      for (let i = 0; i < this.items.length; i++) {
        time += this.items[i].estimateCompileTime();
      }
    }
    return time; // minutes
  }

  toUseFormState() {
    return {
      type: 'group',
      value: this.items.reduce((acc, itm) => ({
        ...acc,
        [itm.id]:itm.toUseFormState() as Form,
      }),{})
    }
  }

}
