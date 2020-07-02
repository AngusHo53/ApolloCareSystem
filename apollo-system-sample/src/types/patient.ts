import {Entity} from './index';

export interface Patient extends Entity {
    information:PatientInfo;
    record: Record;
  }

  export interface PatientInfo extends Entity {
    age: number;
    birthday: string;
    created_at: string;
    gender:string;
    health_state: number;
    id: number;
    id_card: string;
    name: string;
    phone: string;
    updated_at: string;
  }

  export interface PatientOptions {
    page: number,
    q: string,
    order: string,
    sort: string
  }

  export interface Record extends Entity {
    blood_pressure: BloodPressure;
    blood_glucose: BloodGlucose;
    metabolic: Metabolic;
    body_temerature: BodyTemperature;
    spo2: SpO2;
    frailty: Frailty;
    blood: Blood;
    mental: Mental;
    bone: Bone;
  }

  export interface BloodPressure {
    systolic: number;
    diastolic: number;
    pulse: number;
    scene: string;
    arr: boolean;
    afib: boolean;
    pc: boolean;
    ihb: boolean;
  }

  export interface BloodGlucose {
    blood_glucose: number;
    meal: string;
  } 

  export interface Metabolic {
    height: number;
    weight: number;
    bmi: number;
    nuscle_mass: number;
    body_fat: number;
    body_water: number;
    visceral_fat: number;
    bmr: number;
  }

  export interface BodyTemperature {
    body_temperature: number;
  }

  export interface SpO2 {
    spo2_highest: number;
    spo2_lowest: number;
    pulse_highest: number;
    pulse_lowest: number;
  }

  export interface Frailty{
    handness: string; //慣用手
    grip: number;
    walktime: number;
    walkspeed: number;
    ftsst: number;
  }

  export interface Blood {
    hb: number;
    alb: number;
    cre: number;
    ast: number;
    tcho: number;
    hdl: number;
    ldl: number;
    ua: number;
    hba1c: number;
    fe: number;
    mg: number;
  }

  export interface Mental {
    spmsq: number;
    ad8: number;
    minicog: boolean;
    bsrs: number;
  }

  export interface Bone {
    osteoporosis: number;
    fracture: number;
  }
  
  export interface MeasureData {
    measure_at: "Tue, 08 Jan 2019 03:35:45 GMT"
    name: {en: "afib", zh: "心房顫動"}
    type: "boolean"
    unit: null
    value: null
  }