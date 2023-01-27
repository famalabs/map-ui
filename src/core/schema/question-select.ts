import {Question} from './question';
import {TextScore} from './answer';
import { isDefault} from './config';
import { QuestionSelectMap } from '../../components/forms/config-map';

export class QuestionSelect extends Question {
  // {"id":"31","type":"QuestionSelect","text":"Genere","options":{"required":true},"selectOptions":[{"text":"M","score":0},{"text":"F","score":1}]}

  // selected option
  answer: number;

  selectOptions: Array<TextScore>;

  constructor(data: any = {}) {
    super(data);
    if (!isDefault(data.options.activate, QuestionSelectMap.options.activate.default))
      this.options.activate = data.options.activate;
    this.setOptions(data.selectOptions);
  }

  setAnswer(answer) {
    if (typeof answer === 'number')
      this.answer = answer;
    else
      this.answer = null;
  }

  getSchema(): any {
    let schema = super.getSchema();
    if (this.options) {
      if (!isDefault(this.options.activate, QuestionSelectMap.options.activate.default)) {
        schema.options = schema.options || {};
        schema.options.activate = this.options.activate;
      }
    }
    if (this.selectOptions instanceof Array)
      schema.selectOptions = this.selectOptions.map((opt) => QuestionSelect.getOption(opt)).filter((opt) => opt);
    return schema;
  }

  isValid(): boolean {
    if (!super.isValid())
      return false;
    if (!(this.selectOptions instanceof Array))
      return false;
    let answer = this.answer;
    if (answer !== null) {
      if (typeof answer !== 'number')
        return false;
      if (!(answer >= 0 && answer < this.selectOptions.length))
        return false;
      let selected = this.selectOptions[answer];
      if (!(selected && typeof selected.score === 'number'))
        return false;
    }
    return true;
  }

  getScore(): number {
    let opt = this.getSelected();
    if (opt) {
      return opt.score;
    }
  }

  setOptions(options: Array<TextScore>) {
    if (options && options.length > 0) {
      this.selectOptions = options.map((opt) => QuestionSelect.getOption(opt)).filter((opt) => opt);
    } else {
      this.selectOptions = [];
    }
  }

  getSelected(): TextScore {
    if (this.isValid()) {
      return this.selectOptions[this.answer];
    }
  }

  static getOption(opt) {
    return (opt && typeof opt.score === 'number') ? {
      text: opt.text,
      score: opt.score
    } : null;
  }

  textScoreToOption() {
    if (this.selectOptions) {
      return this.selectOptions.map((v,i) => (
        { value: v.score, label: v.text }
      ));
    }
    return null;
  }

  toUseFormState() {
    var validators = []
    return {
      type: 'node',
      value: 'number',
      required: this.options.required ?? false,
      validators: validators
    }
  }

}
