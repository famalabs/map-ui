import {Question} from './question';
import {DBAnswer} from './answer';
import {DEFAULT_OPTIONS_DATE_MAX, DEFAULT_OPTIONS_DATE_MIN, isDefault} from './config';

export class QuestionDate extends Question {

  answer: Date;

  constructor(data: any = {}) {
    super(data);
    if (data.options.minValue)
      this.options.minValue = data.options.minValue;
    if (data.options.maxValue)
      this.options.maxValue = data.options.maxValue;
  }

  getAnswer(): DBAnswer {
    return {
      id: this.id,
      answer: (this.answer instanceof Date) ? this.answer.toISOString() : null,
      score: this.getScore()
    };
  }

  setAnswer(answer) {
    if (answer instanceof Date)
      this.answer = answer;
    else if (typeof answer === 'string')
      this.answer = new Date(answer);
    else
      this.answer = null;
  }

  getSchema(): any {
    let schema = super.getSchema();
    if (this.options) {
      if (!isDefault(this.options.minValue, DEFAULT_OPTIONS_DATE_MIN)) {
        schema.options = schema.options || {};
        schema.options.minValue = this.options.minValue;
      }
      if (!isDefault(this.options.maxValue, DEFAULT_OPTIONS_DATE_MAX)) {
        schema.options = schema.options || {};
        schema.options.maxValue = this.options.maxValue;
      }
    }
    return schema;
  }

  isValid(): boolean {
    if (!super.isValid())
      return false;
    let answer = this.answer;
    if (answer !== null) {
      if (!(answer instanceof Date))
        return false;
      if (isNaN(answer.getTime()))
        return false;
      if (this.options.minValue && answer.getTime() < this.options.minValue)
        return false;
      if (this.options.maxValue && answer.getTime() > this.options.maxValue)
        return false;
    }
    return true;
  }

    toUseFormState() {
    var validators = []
    // if (this.options.minLength) validators.push({id:'minValue'})
    // if (this.options.minLength) validators.push({id:'maxValue'})
    return {
      type: 'node',
      value: 'string',
      required: this.options.required ?? false,
      validators: validators
    }
  }

}
