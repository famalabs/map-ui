import {SurveyItem} from './survey-item';
import {TextScore} from './answer';
import {QuestionSelect} from './question-select';

export class ItemTable extends SurveyItem {

  items: Array<QuestionSelect>;

  header: Array<TextScore>;

  constructor(data: any = {}) {
    super(data);
    this.header = data.header || [];
  }

  getSchema() {
    let schema = super.getSchema();
    if (schema.items) {
      schema.items.forEach((item) => {
        delete item.selectOptions;
      });
    }
    schema.header = this.header;
    return schema;
  }

  setHeader(header: Array<TextScore>) {
    if (this.items) {
      this.items.forEach((item) => {
        item.items = [];
      });
      header.forEach(this.addColumn, this);
    }
  }

  display() {
    this.setHeader(this.header);
  }

  addColumn(column: TextScore) {
    let table = this;
    table.header.push(column);
    table.items.forEach((item) => {
      this.addCell(item, column);
    });
  }

  addCell(item: QuestionSelect, column: TextScore) {
    let opt = {...column};
    item.selectOptions.push(opt);
  }

  addRow(row: string): QuestionSelect {
    let table = this;
    let item = new QuestionSelect({
      id: table.renderer.getNewId(),
      text: row
    });
    table.insertItem(item);
    table.renderer.insertItem(item);
    item.setOptions(this.header);
    return item;
  }

}
