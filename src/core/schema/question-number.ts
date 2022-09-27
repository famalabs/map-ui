import {Question} from './question';
import {DEFAULT_OPTIONS_NUM_MAX, DEFAULT_OPTIONS_NUM_MIN, DEFAULT_OPTIONS_NUM_STEP, isDefault} from './config';

export class QuestionNumber extends Question {

  answer: number;
  unit: string;

  constructor(data: any = {}) {
    super(data);
    if (!isDefault(data.options.minValue, DEFAULT_OPTIONS_NUM_MIN))
      this.options.minValue = data.options.minValue;
    if (!isDefault(data.options.maxValue, DEFAULT_OPTIONS_NUM_MAX))
      this.options.maxValue = data.options.maxValue;
    if (!isDefault(data.options.step, DEFAULT_OPTIONS_NUM_STEP))
      this.options.step = data.options.step;
    this.unit = data.unit;
  }

  setAnswer(answer) {
    if (typeof answer === 'number')
      this.answer = answer;
    else
      this.answer = null;
  }

  isValid(): boolean {
    if (!super.isValid())
      return false;
    let answer = this.answer;
    if (answer !== null) {
      if (typeof answer !== 'number')
        return false;
      if (isNaN(answer))
        return false;
      if (this.options.minValue && answer < this.options.minValue)
        return false;
      if (this.options.maxValue && answer > this.options.maxValue)
        return false;
    }
    return true;
  }

  getScore(): number {
    if (this.isValid())
      return this.answer;
  }

  getSchema(): any {
    let schema = super.getSchema();
    if (this.options) {
      if (!isDefault(this.options.minValue, DEFAULT_OPTIONS_NUM_MIN)) {
        schema.options = schema.options || {};
        schema.options.minValue = this.options.minValue;
      }
      if (!isDefault(this.options.maxValue, DEFAULT_OPTIONS_NUM_MAX)) {
        schema.options = schema.options || {};
        schema.options.maxValue = this.options.maxValue;
      }
      if (!isDefault(this.options.step, DEFAULT_OPTIONS_NUM_STEP)) {
        schema.options = schema.options || {};
        schema.options.step = this.options.step;
      }
    }
    if (this.unit)
      schema.unit = this.unit;
    return schema;
  }
  
    toUseFormState() {
    var validators = []
    // if (this.options.minLength) validators.push({id:'minValue'})
    // if (this.options.minLength) validators.push({id:'maxValue'})
    return {
      type: 'node',
      value: 'number',
      required: this.options.required ?? false,
      validators: validators
    }
  }
}
