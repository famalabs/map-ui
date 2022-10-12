import {Question} from './question';
import {isDefault} from "./config";
import { QuestionTextMap } from './config-map';

export class QuestionText extends Question {

  answer: string;

  constructor(data: any = {}) {
    super(data);
    if (!isDefault(data.options.minLength, QuestionTextMap.options.minLength.default ))
      this.options.minLength = data.options.minLength;
    if (!isDefault(data.options.maxLength, QuestionTextMap.options.maxLength.default ))
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
      if (!isDefault(this.options.minLength, QuestionTextMap.options.minLength.default)) {
        schema.options = schema.options || {};
        schema.options.minLength = this.options.minLength;
      }
      if (!isDefault(this.options.maxLength, QuestionTextMap.options.maxLength.default )) {
        schema.options = schema.options || {};
        schema.options.maxLength = this.options.maxLength;
      }
    }
    return schema;
  }

  toUseFormState() {
    var validators = []
    // if (this.options.minLength) validators.push({id:'minLength'})
    // if (this.options.minLength) validators.push({id:'maxLength'})
    return {
      type: 'node',
      value: 'string',
      required: this.options.required ?? false,
      validators: validators
    }
  }

}
