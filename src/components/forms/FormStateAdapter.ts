import { Item, ItemFunction, Question, QuestionNumber, QuestionSelect, QuestionText } from '../../survey';
import { Form } from './useFormState';

export function toUseFormState(item:Item):Form {

  if (item instanceof Question) {
    if (item instanceof QuestionNumber || item instanceof QuestionSelect) {
      return {
        type: 'node',
        value: 'number',
        required: item.options.required ?? false,
        validators: [],
      } as Form;
    }

    return {
      type: 'node',
      value: 'string',
      required: item.options.required ?? false,
      validators: [],
    } as Form;

  } else if (item instanceof ItemFunction) {
    return {
      type: 'node',
      value: 'string',
    } as Form;
  }

  return {
    type: 'group',
    value: item.items.reduce((acc, itm) => ({
    ...acc,
    [itm.id]: toUseFormState(itm),
  }),{})
  } as Form;
}