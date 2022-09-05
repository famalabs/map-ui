import {Question} from './question';
import {DEFAULT_OPTIONS_TEXT_MAX, DEFAULT_OPTIONS_TEXT_MIN, isDefault} from "./config";

export class QuestionText extends Question {

  answer: string;

  constructor(data: any = {}) {
    super(data);
    if (!isDefault(data.options.minLength, DEFAULT_OPTIONS_TEXT_MIN))
      this.options.minLength = data.options.minLength;
    if (!isDefault(data.options.maxLength, DEFAULT_OPTIONS_TEXT_MAX))
      this.options.maxLength = data.options.maxLength;
  }

  isValid(): boolean {
    if (!super.isValid())
      return false;
    let answer = this.answer;
    if (answer !== null) {
      if (typeof answer !== 'string')
        return false;
      if (this.options.minLength && answer.length < this.options.minLength)
        return false;
      if (this.options.maxLength && answer.length > this.options.maxLength)
        return false;
    }
    return true;
  }

  getSchema(): any {
    let schema = super.getSchema();
    if (this.options) {
      if (!isDefault(this.options.minLength, DEFAULT_OPTIONS_TEXT_MIN)) {
        schema.options = schema.options || {};
        schema.options.minLength = this.options.minLength;
      }
      if (!isDefault(this.options.maxLength, DEFAULT_OPTIONS_TEXT_MAX)) {
        schema.options = schema.options || {};
        schema.options.maxLength = this.options.maxLength;
      }
    }
    return schema;
  }
}
