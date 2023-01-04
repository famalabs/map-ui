"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HScore = exports.CIDScore = exports.ISTHScore = exports.SofaScore = exports.CKD_EPI_CREATININE = exports.GFRCockcroftGault = exports.PF_Percent = exports.MeanArterialPressure = exports.BodyMassIndex = exports.Gender = void 0;
const functions_1 = require("./functions");
// TODO fix functions which uses gender (those have wrong coding)
var Gender;
(function (Gender) {
    Gender[Gender["NotKnown"] = 0] = "NotKnown";
    Gender[Gender["Male"] = 1] = "Male";
    Gender[Gender["Female"] = 2] = "Female";
    Gender[Gender["NotApplicable"] = 9] = "NotApplicable";
})(Gender = exports.Gender || (exports.Gender = {}));
/**
 * This function returns the Body Mass Index
 * @param mass, the weight in Kg
 * @param height, height in m
 * @returns the BMI
 */
function BodyMassIndex(mass, height) {
    return mass / (height * height);
}
exports.BodyMassIndex = BodyMassIndex;
/**
 * This function returns the Mean Arterial Pressure
 * @param pressure_diastolic, in mm Hg
 * @param pressure_systolic, in mm Hg
 * @constructor
 */
function MeanArterialPressure(pressure_diastolic, pressure_systolic) {
    return (pressure_diastolic * 2 + pressure_systolic) / 3;
}
exports.MeanArterialPressure = MeanArterialPressure;
/**
 * This function returns the PF ratio or undefined if the given params are wrong
 * @param po2, the pressure of oxygen
 * @param fio2, the percent of inspired oxygen (range [1, 100])
 * @returns
 */
function PF_Percent(po2, fio2) {
    if (po2 && fio2) {
        if (fio2 < 1 || fio2 > 100)
            return undefined; //pr throw wxception
        return po2 / (fio2 / 100);
    }
}
exports.PF_Percent = PF_Percent;
/**
 * This function retuns the Glorumeral Filtration Rate using the Cockcroft-Gault formula or undefined if params are wrong
 * @name GFRCockcroftGault - Filtrato glomerulare
 * @param weight - kg
 * @param age - years
 * @param creatinine - mg/dl
 * @param gender - 0: male, 1: female
 * @returns, GFR as ml / min
 */
function GFRCockcroftGault(weight, age, creatinine, gender) {
    if (weight && age && creatinine && gender !== null) {
        const gfr = (gender === 1 ? 0.85 : 1) * (((140 - age) * weight) / (72 * creatinine));
        return gfr; // ml/min
    }
}
exports.GFRCockcroftGault = GFRCockcroftGault;
/**
 * This function returns the an estimation of GFR with CK-EPI-Creatine equation
 * @param age the age of the patient (year)
 * @param creatinine in mg/dL
 * @param gender - 0: male, 1:female
 * @returns GFR in ml/min
 */
function CKD_EPI_CREATININE(age, creatinine, gender) {
    if (age && creatinine && gender !== null) {
        let a, b, c = 0;
        if (gender === 1) {
            if (creatinine <= 0.7) {
                a = 144;
                b = 0.7;
                c = -0.329;
            }
            else {
                a = 144;
                b = 0.7;
                c = -1.209;
            }
        }
        else {
            if (creatinine <= 0.9) {
                a = 141;
                b = 0.9;
                c = -0.411;
            }
            else {
                a = 141;
                b = 0.9;
                c = -1.209;
            }
        }
        return a * Math.pow(creatinine / b, c) * Math.pow(0.993, age); // ml/min
    }
}
exports.CKD_EPI_CREATININE = CKD_EPI_CREATININE;
/**
 * This function returns the Sequential Organ Failure Assestment Score
 * @param p_divided_f - Pa0_2 / Fi0_2  mmHg
 * @param platelets - platelets ×103/µL
 * @param bilirubin - bilirubin mg/dL
 * @param creatinine - Creatinine mg/dL
 * @param glasgow_coma_scale - glasgow_coma_scale
 * @param arterial_pressure - arterial_pressure mmHg
 * @param amine
 * @returns the Sequential Organ Failure Assestment Score
 */
function SofaScore(p_divided_f, platelets, bilirubin, creatinine, glasgow_coma_scale, arterial_pressure, amine) {
    let r = 0;
    if (p_divided_f) {
        // Pa0_2 / Fi0_2  mmHg
        if (p_divided_f >= 300 && p_divided_f < 400) {
            r += 1;
        }
        else if (p_divided_f >= 220 && p_divided_f < 300) {
            r += 2;
        }
        else if (p_divided_f >= 100 && p_divided_f < 220) {
            r += 3;
        }
        else if (p_divided_f < 100) {
            r += 4;
        }
        if (platelets) {
            // platelets ×103/µL
            if (platelets >= 100 && platelets < 150) {
                r += 1;
            }
            else if (platelets >= 50 && platelets < 100) {
                r += 2;
            }
            else if (platelets >= 20 && platelets < 50) {
                r += 3;
            }
            else if (platelets < 20) {
                r += 4;
            }
        }
        if (bilirubin) {
            // bilirubin mg/dL
            if (bilirubin >= 1.2 && bilirubin < 2) {
                r += 1;
            }
            else if (bilirubin >= 2 && bilirubin < 6) {
                r += 2;
            }
            else if (bilirubin >= 6 && bilirubin < 12) {
                r += 3;
            }
            else if (bilirubin >= 12) {
                r += 4;
            }
        }
        if (creatinine) {
            // Creatinine mg/dL
            if (creatinine >= 1.2 && creatinine < 2) {
                r += 1;
            }
            else if (creatinine >= 2 && creatinine < 3.5) {
                r += 2;
            }
            else if (creatinine >= 3.5 && creatinine < 5) {
                r += 3;
            }
            else if (creatinine >= 5) {
                r += 4;
            }
        }
        if (glasgow_coma_scale) {
            // glasgow_coma_scale
            if (glasgow_coma_scale >= 13 && glasgow_coma_scale < 15) {
                r += 1;
            }
            else if (glasgow_coma_scale >= 10 && glasgow_coma_scale < 13) {
                r += 2;
            }
            else if (glasgow_coma_scale >= 6 && glasgow_coma_scale < 10) {
                r += 3;
            }
            else if (glasgow_coma_scale < 6) {
                r += 4;
            }
        }
        // ipotension - arterial_pressure mmHg
        if (arterial_pressure || amine) {
            if (arterial_pressure < 70) {
                r += 1;
            }
            else {
                if (amine === 1 || amine === 4)
                    r += 2;
                if (amine === 2 || amine === 5)
                    r += 3;
                if (amine === 3 || amine === 6)
                    r += 4;
            }
        }
    }
    return r;
}
exports.SofaScore = SofaScore;
/**
 * This function calculates the ISTH Criteria for Disseminated Intravascular Coagulation
 * @param platelets the number of platelets for 1 µL
 * @param inr International Normalized Ratio
 * @param sofa, Sequential Organ Failure Assestment Score in mg/dL
 * @returns the ISTHS score
 */
function ISTHScore(platelets, inr, sofa) {
    let r = 0;
    if (platelets) {
        // platelets ×103/µL
        if (platelets >= 100 && platelets <= 150) {
            r += 1;
        }
        else if (platelets < 100) {
            r += 2;
        }
    }
    if (inr) {
        // inr
        if (inr > 1.2 && inr <= 1.4) {
            r += 1;
        }
        else if (inr > 1.4) {
            r += 2;
        }
    }
    // mg / dL
    if (sofa) {
        if (sofa === 1) {
            r += 1;
        }
        else if (sofa >= 2) {
            r += 2;
        }
    }
    return r;
}
exports.ISTHScore = ISTHScore;
/**
 * This function calculates the ISTH Criteria for Disseminated Intravascular Coagulation (or CID Score adapted Italy)
 * @param platelets the number of platelets for 1 µL
 * @param inr the number of platelets for 1 µL
 * @param fibrinogen in mg / dL
 * @param d_dmero ng /mL
 * @returns the CID Score
 */
function CIDScore(platelets, inr, fibrinogen, d_dmero) {
    let r = 0;
    if (platelets) {
        // platelets ×103/µL
        if (platelets >= 50 && platelets < 100) {
            r += 1;
        }
        else if (platelets < 50) {
            r += 2;
        }
    }
    if (inr) {
        // inr
        if (inr > 1.3 && inr <= 1.7) {
            r += 1;
        }
        else if (inr > 1.7) {
            r += 2;
        }
    }
    // mg / dL
    if (fibrinogen) {
        if (fibrinogen < 100) {
            r += 1;
        }
    }
    if (d_dmero) {
        if (d_dmero > 400 && d_dmero <= 4000) {
            r += 2;
        }
        else if (d_dmero > 4000) {
            r += 3;
        }
    }
    return r;
}
exports.CIDScore = CIDScore;
/**
 * This function calculates the HScore for Reactive Hemophagocytic Syndrome
 * @param temperature - °C
 * @param emoglobina - g / dL
 * @param g_bianchi - U / mm^3
 * @param platelets - U / µL
 * @param triglyceride - mg / dL
 * @param got - U / L
 * @param fibrinogen - mg / dL
 * @param ferritin - ng / mL
 * @param haemofagocytosis
 * @param immunosuppression
 * @param hepatomegaly
 * @param splenomegaly
 * @returns the HScore
 */
function HScore(temperature, emoglobina, g_bianchi, platelets, triglyceride, got, fibrinogen, ferritin, haemofagocytosis, immunosuppression, hepatomegaly, splenomegaly) {
    let r = 0;
    if (temperature) {
        if (temperature >= 38.4 && temperature <= 39.4) {
            r += 33;
        }
        else if (temperature > 39.4) {
            r += 49;
        }
    }
    if (emoglobina < 9.2 && g_bianchi < 4 && platelets < 110) {
        r += 34;
    }
    else if ((emoglobina < 4 && platelets < 110) ||
        (emoglobina < 9.2 && g_bianchi < 4) ||
        (g_bianchi < 4 && platelets < 110)) {
        r += 24;
    }
    // mg/dL
    if (triglyceride) {
        if (triglyceride >= 132.7 && triglyceride < 355) {
            r += 44;
        }
        else if (triglyceride >= 355) {
            r += 64;
        }
    }
    if (ferritin) {
        if (ferritin >= 2000 && ferritin <= 6000) {
            r += 35;
        }
        else if (ferritin > 6000) {
            r += 50;
        }
    }
    // AST U/L
    if (got) {
        if (got >= 30) {
            r += 19;
        }
    }
    if (fibrinogen) {
        if (fibrinogen <= 250) {
            r += 30;
        }
    }
    if (haemofagocytosis) {
        r += 35;
    }
    if (immunosuppression) {
        r += 18;
    }
    if (hepatomegaly === true || splenomegaly === true) {
        if (hepatomegaly === true && splenomegaly === true)
            r += 38;
        else
            r += 23;
    }
    return r;
}
exports.HScore = HScore;
functions_1.registerFn(BodyMassIndex, 'BMI');
functions_1.registerFn(SofaScore, 'SOFA');
functions_1.registerFn(ISTHScore, 'ISTH');
functions_1.registerFn(CIDScore, 'CID');
functions_1.registerFn(HScore, 'HScore');
functions_1.registerFn(MeanArterialPressure, 'MeanArterialPressure');
functions_1.registerFn(GFRCockcroftGault, 'CrocoftGault');
functions_1.registerFn(CKD_EPI_CREATININE, 'CDKEPI');
functions_1.registerFn(PF_Percent, 'PFpercent');
//# sourceMappingURL=medicine.js.map