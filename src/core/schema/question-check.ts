import {Question} from './question';
import {DEFAULT_OPTIONS_INVERTED, DEFAULT_OPTIONS_TOGGLE, isDefault} from './config';

export class QuestionCheck extends Question {

  answer: boolean;

  constructor(data: any = {}) {
    super(data);
    if (!isDefault(data.options.inverted, DEFAULT_OPTIONS_INVERTED))
      this.options.inverted = data.options.inverted as boolean;
    if (!isDefault(data.options.toggle, DEFAULT_OPTIONS_TOGGLE))
      this.options.toggle = data.options.toggle as boolean;
  }

  setAnswer(answer: any) {
    this.answer = !!answer;
  }

  getScore(): number {
    return Number(this.options.inverted ^ +this.answer);
  }

  getSchema(): any {
    let schema = super.getSchema();
    if (this.options) {
      if (!isDefault(this.options.inverted, DEFAULT_OPTIONS_INVERTED)) {
        schema.options = schema.options || {};
        schema.options.inverted = this.options.inverted;
      }
      if (!isDefault(this.options.toggle, DEFAULT_OPTIONS_TOGGLE)) {
        schema.options = schema.options || {};
        schema.options.toggle = this.options.toggle;
      }
    }
    return schema;
  }

  isValid(): boolean {
    if (this.getScore())
      return super.isValid();
    return (this.options.required) ? this.answer : true;
  }

  iterate(iterator, context: any = {}) {
    if (this.getScore())
      return super.iterate(iterator, context);
    iterator(this, context);
  }
}
