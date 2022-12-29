export declare enum Gender {
    NotKnown = 0,
    Male = 1,
    Female = 2,
    NotApplicable = 9
}
/**
 * This function returns the Body Mass Index
 * @param mass, the weight in Kg
 * @param height, height in m
 * @returns the BMI
 */
export declare function BodyMassIndex(mass: number, height: number): number;
/**
 * This function returns the Mean Arterial Pressure
 * @param pressure_diastolic, in mm Hg
 * @param pressure_systolic, in mm Hg
 * @constructor
 */
export declare function MeanArterialPressure(pressure_diastolic: number, pressure_systolic: number): number;
/**
 * This function returns the PF ratio or undefined if the given params are wrong
 * @param po2, the pressure of oxygen
 * @param fio2, the percent of inspired oxygen (range [1, 100])
 * @returns
 */
export declare function PF_Percent(po2: number, fio2: number): number;
/**
 * This function retuns the Glorumeral Filtration Rate using the Cockcroft-Gault formula or undefined if params are wrong
 * @name GFRCockcroftGault - Filtrato glomerulare
 * @param weight - kg
 * @param age - years
 * @param creatinine - mg/dl
 * @param gender - 0: male, 1: female
 * @returns, GFR as ml / min
 */
export declare function GFRCockcroftGault(weight: number, age: number, creatinine: number, gender: Gender): number | undefined;
/**
 * This function returns the an estimation of GFR with CK-EPI-Creatine equation
 * @param age the age of the patient (year)
 * @param creatinine in mg/dL
 * @param gender - 0: male, 1:female
 * @returns GFR in ml/min
 */
export declare function CKD_EPI_CREATININE(age: number, creatinine: number, gender: Gender): number;
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
export declare function SofaScore(p_divided_f: number, platelets: number, bilirubin: number, creatinine: number, glasgow_coma_scale: number, arterial_pressure: number, amine: number): number;
/**
 * This function calculates the ISTH Criteria for Disseminated Intravascular Coagulation
 * @param platelets the number of platelets for 1 µL
 * @param inr International Normalized Ratio
 * @param sofa, Sequential Organ Failure Assestment Score in mg/dL
 * @returns the ISTHS score
 */
export declare function ISTHScore(platelets: number, inr: number, sofa: number): number;
/**
 * This function calculates the ISTH Criteria for Disseminated Intravascular Coagulation (or CID Score adapted Italy)
 * @param platelets the number of platelets for 1 µL
 * @param inr the number of platelets for 1 µL
 * @param fibrinogen in mg / dL
 * @param d_dmero ng /mL
 * @returns the CID Score
 */
export declare function CIDScore(platelets: number, inr: number, fibrinogen: number, d_dmero: number): number;
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
export declare function HScore(temperature: number, emoglobina: number, g_bianchi: number, platelets: number, triglyceride: number, got: number, fibrinogen: number, ferritin: number, haemofagocytosis: boolean, immunosuppression: boolean, hepatomegaly: boolean, splenomegaly: boolean): number;
