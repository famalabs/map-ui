import { MAX_FIELD_SIZE } from "./config";

// SURVEY
export const SurveyMap = {
options: {
    progress: {
        default: 'default',
        bar: 'bar',
        percentage: 'percentage',
        none: 'none'
    },
    theme: {
        default: 'default',
        light: 'light',
        dark: 'dark'
    },
    index: {
        default: 'default',
        numeric: 'numeric',
        alphabetic: 'alphabetic',
        none: 'none'
    },
    pager: {
        default: 'default',
        none: 'none'
    },
    locale: {
        default: 'default',
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
        default: 'default',
        classic: 'classic',
        auto_scroll: 'auto_scroll',
        map: 'map'
    }
}
} as const;
export type SurveyMap = keyof typeof SurveyMap;

// GROUP
export const GroupMap = {
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
    }
} as const;
export type QuestionCheckMap = keyof typeof QuestionCheckMap;

// QuestionText
export const QuestionTextMap = {
    options: {
        minLength: {
            default: 0
        },
        maxLength: {
            default: MAX_FIELD_SIZE
        }
    }
} as const;
export type QuestionTextMap = keyof typeof QuestionTextMap;

// QuestionNumber
export const QuestionNumberMap = {
    options: {
        minValue: {
            default: -Infinity
        },
        maxValue: {
            default: +Infinity
        },
        step: {
            default: 0
        }
    }
} as const;
export type QuestionNumberMap = keyof typeof QuestionNumberMap;

// QuestionDate
export const QuestionDateMap = {
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
    options: {
        activate: {
            default: (value) => !(value instanceof Array && value.length > 0)
        }
    }
} as const;
export type QuestionSelectMap = keyof typeof QuestionSelectMap;

// export function DEFAULT_OPTIONS_ACTIVATE(value) {
//     return !(value instanceof Array && value.length > 0);
// }

// Question
export const QuestionMap = {
    questionText: QuestionTextMap,
    questionNumber: QuestionNumberMap,
    questionSelect: QuestionSelectMap,
    questionDate: QuestionDateMap,
    questionCheck: QuestionCheckMap,
    options: {
        required: {
            default: false,
            false: false,
            true: true
        }
    }
} as const;
export type QuestionMap = keyof typeof QuestionMap;