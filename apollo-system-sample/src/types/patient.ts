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

  export interface Record extends Entity {
    blood;
    blood_glucose;
    blood_pressure;
    body_temperature;
    bone;
    created_at;
    frailty;
    mental;
    metabolic;
    spo2;
    updated_at;
  }

  export interface BloodPressure {
    afib;
    arr;
    diastolic;
    id;
    ihb;
    machine_number;
    pc;
    pulse;
    record_from;
    scene;
    systolic;
  }

  export interface MeasureData {
    measure_at: "Tue, 08 Jan 2019 03:35:45 GMT"
    name: {en: "afib", zh: "心房顫動"}
    type: "boolean"
    unit: null
    value: null
  }