import {Question} from './question';
import { isDefault} from './config';
import { QuestionCheckMap } from '../../components/forms/config-map';

export class QuestionCheck extends Question {

  answer: boolean;

  constructor(data: any = {}) {
    super(data);
    if (!isDefault(data.options.inverted, QuestionCheckMap.options.inverted.default ))
      this.options.inverted = data.options.inverted as boolean;
    if (!isDefault(data.options.toggle, QuestionCheckMap.options.toggle.default))
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
      if (!isDefault(this.options.inverted, QuestionCheckMap.options.inverted.default)) {
        schema.options = schema.options || {};
        schema.options.inverted = this.options.inverted;
      }
      if (!isDefault(this.options.toggle, QuestionCheckMap.options.toggle.default)) {
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
