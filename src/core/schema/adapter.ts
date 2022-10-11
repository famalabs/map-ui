import { ItemFunction } from "./item-function";
import { Question } from "./question";
import { SurveyItem } from "./survey-item";

export class AdapterUseFormStateSurvey {

    // public static calculateFunction(fn: ItemFunction<any>, value: any) {
    //     for (let i = 0; i < fn.parameters.length; i++) {
    //         let param = fn.renderer.get(fn.parameters[i]);
    //         if (param instanceof Question) {
    //           } else if (param instanceof ItemFunction) {
    //           }
    //     }
    // }

    // public static setValueQuestion()

    public static setValuesFromUseFormState(root: SurveyItem, value: any) {
        console.log(root, value);
        if (root instanceof Question) {
            // root.setAnswer(value);
            console.log("set value", value[root.id]);
            root.setAnswer(value[root.id]);
            // if (root.id in value) {
            //     root.setAnswer(value[root.id]);
            // } else {
            //     root.setAnswer(value);
            // }
        }

        for (let i = 0; i < root.items.length; i++) {
            if (root.id in value) {
                this.setValuesFromUseFormState(root.items[i], value[root.id]);
            } else {
                this.setValuesFromUseFormState(root.items[i], value);
            }
        }

        console.log(root.id, root instanceof Question ? root.answer : null);
    }

}