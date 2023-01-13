import { QuestionList } from "../../survey/src/lib/form/question-list";
import { ItemConditional, ItemFunction } from "../../survey/src";
import { MAX_FIELD_SIZE } from "./config";

export function fromMapToDefault(options:any) {
    var acc = {}
    const keys = Object.keys(options);
    for (let i = 0; i < keys.length; i++) {
        acc = { ...acc, ...{ [keys[i]]: options[keys[i]].default } }
    }
    return acc;
}

// SURVEY
export const SurveyMap = {
    id: "",
    name: "",
    text: "",
    type: "Survey",
    items: [],
    options: {
        progress: {
            default: 'none',
            bar: 'bar',
            percentage: 'percentage',
            none: 'none'
        },
        theme: {
            default: 'light',
            light: 'light',
            dark: 'dark'
        },
        index: {
            default: 'numeric',
            numeric: 'numeric',
            alphabetic: 'alphabetic',
            none: 'none'
        },
        pager: {
            default: 'none',
            none: 'none'
        },
        locale: {
            default: 'it',
            it:'it',
            en:'en'
        }
    },
    layout: {
        style: {
            default: 'multi_folder',
            multi_folder: 'multi_folder',
            multi_page: 'multi_page',
            single_page: 'single_page'
        },
        view: {
            default: 'classic',
            classic: 'classic',
            auto_scroll: 'auto_scroll',
            map: 'map'
        }
    }
} as const;
export type SurveyMap = keyof typeof SurveyMap;

// GROUP
export const GroupMap = {
    id: "",
    name: "",
    text: "",
    type: "Group",
    items: [],
    options: {
        progress: {
            default: 'default',
            bar: 'bar',
            percentage: 'percentage',
            none: 'none'
        }
    },
    layout: {
        style: {
            default: 'page',
            folder: 'folder',
            page: 'page',
            card: 'card',
            section: 'section',
            inline: 'inline',
            table: 'table',
            wizard: 'wizard'
        },
        hide: {
            default: false,
            false: false,
            true: true
        }
    }
} as const;
export type GroupMap = keyof typeof GroupMap;

// QuestionCheck
export const QuestionCheckMap = {
    id: "",
    name: "",
    text: "",
    type: "QuestionCheck",
    options: {
        inverted: {
            default: false,
            false: false,
            true: true
        },
        toggle: {
            default: false,
            false: false,
            true: true
        }
    },
    layout: {
        style: {
            default: 'check',
            check:'check',
            switch:'switch'
        }
    }
} as const;
export type QuestionCheckMap = keyof typeof QuestionCheckMap;

// QuestionText
export const QuestionTextMap = {
    id: "",
    name: "",
    text: "",
    type: "QuestionText",
    options: {
        minLength: {
            default: 0
        },
        maxLength: {
            default: MAX_FIELD_SIZE
        }
    },
    layout: {
        style: {
            default: "default",
            area: "area"
        }
    }
} as const;
export type QuestionTextMap = keyof typeof QuestionTextMap;

// QuestionNumber
export const QuestionNumberMap = {
    id: "",
    name: "",
    text: "",
    type: "QuestionNumber",
    options: {
        minValue: {
            default: 0
        },
        maxValue: {
            default: 10
        },
        step: {
            default: 1
        },
        unit: {
            default:undefined,
            undefined:undefined,
            kg:"kg",
            g:"g",
            m:"m",
            cm:"cm",
            mm:"mm",
            l:"l",
            cl:"cl",
            ml:"ml",
            dollar:"$",
            euro:"€"
        }
    },
    layout: {
        style: {
            default:"default",
            range:"range"
        }
    }
} as const;
export type QuestionNumberMap = keyof typeof QuestionNumberMap;

const toValidQuestionNumber = (value: any, def: number) => {
    if (typeof value === 'undefined') {
        return def;
    }
    const n = Number(value) ?? def;
    return Number.isNaN(n) ? def : n;
}
export const toValidQuestionNumberMinValue = (value: any) => toValidQuestionNumber(value, QuestionNumberMap.options.minValue.default);
export const toValidQuestionNumberMaxValue = (value: any) => toValidQuestionNumber(value, QuestionNumberMap.options.maxValue.default);
export const toValidQuestionNumberStep = (value: any) => toValidQuestionNumber(value, QuestionNumberMap.options.step.default);

// QuestionDate
export const QuestionDateMap = {
    id: "",
    name: "",
    text: "",
    type: "QuestionDate",
    options: {
        minDate: {
            default: -Infinity
        },
        maxDate: {
            default: +Infinity
        }
    }
} as const;
export type QuestionDateMap = keyof typeof QuestionDateMap;

// QuestionSelect
export const QuestionSelectMap = {
    id: "",
    name: "",
    text: "",
    type: "QuestionSelect",
    options: {
        multiSelect: {
            default: false
        },
        activate: {
            default: (value) => !(value instanceof Array && value.length > 0)
        }
    },
    layout: {
        style: {
            default: "radio",
            radio: "radio",
            dropdown: "dropdown"
        }
    }
} as const;
export type QuestionSelectMap = keyof typeof QuestionSelectMap;

export const QuestionListMap = {
    id:"",
    name:"",
    text:"",
    type:QuestionList.TYPE,
    options: {
        
    }
} as const;
export type QuestionListMap = keyof typeof QuestionListMap;

// export function DEFAULT_OPTIONS_ACTIVATE(value) {
//     return !(value instanceof Array && value.length > 0);
// }

// Question
export const QuestionMap = {
    id: "",
    name: "",
    text: "",
    type: {
        QuestionText: QuestionTextMap,
        QuestionNumber: QuestionNumberMap,
        QuestionSelect: QuestionSelectMap,
        QuestionDate: QuestionDateMap,
        QuestionCheck: QuestionCheckMap,
    },
    options: {
        required: {
            default: false,
            false: false,
            true: true
        }
    }
} as const;
export type QuestionMap = keyof typeof QuestionMap;

export const FnMap = {
    id: "",
    name: "",
    text: "",
    type: ItemFunction.TYPE,
    parameters: [],
    fn: {
        // BodyMassIndex: 'BMI',
        // SofaScore: 'SOFA',
        // ISTHScore: 'ISTH',
        // CIDScore: 'CID',
        // HScore: 'HScore',
        // MeanArterialPressure: 'MeanArterialPressure',
        // GFRCockcroftGault: 'CrocoftGault',
        // CKD_EPI_CREATININE: 'CDKEPI',
        // PF_Percent: 'PFpercent',
        BodyMassIndex:'BMI',
        SofaScore:'SOFA',
        ISTHScore:'ISTH',
        CIDScore:'CID',
        HScore:'HScore',
        MeanArterialPressure:'MeanArterialPressure',
        GFRCockcroftGault:'CrocoftGault',
        CKD_EPI_CREATININE:'CDKEPI',
        PF_Percent:'PFpercent',
    }
} as const;
export type FnMap = keyof typeof FnMap;

export const ItemConditionalMap = {
    id:"",
    name:"",
    text:"",
    type: ItemConditional.TYPE,
    expression: {
        operator: {
            default: '',
            sum:'+',
            diff:'-',
            mult:'*',
            div:'/',
            gt:'>',
            lt:'<',
            gte:'>=',
            lte:'<=',
            eq:'==',
            neq:'!=',
            and:'&&',
            or:'||',
        }
    },
    locale: {
        condition: {
            it: 'Condizione',
            en: 'Condition',
        },
        selectQuestion: {
            it: 'Seleziona una domanda',
            en: 'Select a question',
        },
        selectOperator: {
            it: 'Seleziona un operatore',
            en: 'Select an operator',
        },
        selectValue: {
            it: 'Seleziona un valore',
            en: 'Select a value',
        },
        activate: {
            it: 'Domande attive quando si verifica la condizione',
            en: 'Active questions on true condition'
        }
    }
} as const;
export type ItemConditionalMap = keyof typeof ItemConditionalMap;


export const ValidatorsLocaleMap = {
    emptyField: {
        it: 'Non puoi lasciare questo campo vuoto',
        en: 'You cannot leave this field empty',
    },
    invalidInput: {
        it: 'Input non valido',
        en: 'Invalid input',
    }

} as const;
export type ValidatorsLocaleMap = keyof typeof ValidatorsLocaleMap;