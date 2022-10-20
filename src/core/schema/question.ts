import {SurveyItem} from './survey-item';
import {DBAnswer, IAnswerable} from './answer';
import {isDefault} from './config';
import { QuestionMap } from './config-map';

export class Question extends SurveyItem implements IAnswerable<any> {

  // options: any;
  answer: any;

  constructor(data: any = {}) {
    super(data);
    data.options = data.options || {};
    this.options = {};
    if (!isDefault(data.options.required, QuestionMap.options.required.default ))
      this.options.required = data.options.required as boolean;
    if (data.answer !== undefined)
      this.setAnswer(data.answer);
  }

  getAnswer(): DBAnswer {
    return {
      id: this.id,
      answer: this.answer,
      score: this.getScore()
    };
  }

  setAnswer(answer: any) {
    this.answer = answer;
  }

  isValid(): boolean {
    if (!super.isValid())
      return false;
    if (this.options.required && (this.answer == null))
      return false;
    return true;
  }

  getScore(): number {
    if (this.isValid())
    return this.answer;
    // return null;
    return undefined;
  }

  getSchema(): any {
    let schema = super.getSchema();
    if (this.options && !isDefault(this.options.required, QuestionMap.options.required.default))
      schema.options = {required: this.options.required};
    // if (this.answer !== undefined)
    //  schema.answer = this.answer; // default answer
    return schema;
  }

  estimateCompileTime(): number {
    let thinkTime = 0.03;
    let writeTime = 0.1;
    return thinkTime + writeTime + super.estimateCompileTime();
  }

  toUseFormState() {
    return {
      type: 'node',
      value: 'string'
    } 
  }
}
