import {Entity} from './index';

export interface Patient extends Entity {
    user:PatientInfo;
    record: Record;
  }

  export interface PatientInfo {
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
    uuid: string;
  }

  export interface PatientOptions {
    page: number,
    q: string,
    order: string,
    sort: string
  }

  export interface RecordOptions {
    page: number,
    q: string,
    order: string,
    sort: string,
    uuid: string
  }

  export interface Record {
    blood_pressure: BloodPressure;
    // blood_glucose: MeasureData;
    // metabolic: MeasureData;
    // body_temerature: MeasureData;
    // spo2: MeasureData;
    // frailty: MeasureData;
    // blood: MeasureData;
    // mental: MeasureData;
    // bone: MeasureData;
  }

  export interface MeasureData {
    measure_at: Date,
    category: string,
    name: {
      en: string,
      zn: string
    },
    type: string,
    unit: any,
    uuid: any,
    value: number
  }

  export interface BloodPressure {
    systolic: MeasureData;
    diastolic: MeasureData;
    pulse: MeasureData;
    // scene: string;
    // arr: boolean;
    // afib: boolean;
    // pc: boolean;
    // ihb: boolean;
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
