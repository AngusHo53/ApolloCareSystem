
import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Patient, Order, Entity, PatientInfo, PatientOptions,RecordOptions, MeasureData, Record } from '@/types';
import { getDefaultPagination, getPagination } from '@/utils/store-util';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import Vue from 'vue';
import http from "@/http/axios";
import { reject } from 'lodash';

export interface PatientState {
  pagination: Pagination;
  loading: boolean;
  patient: Patient; //= new Customer() ;
  patients: Patient[];
  items: PatientInfo[];
}

@Module({ store, dynamic: true, name: 'patientModule' })
class PatientModule extends VuexModule implements PatientState {
  public pagination = getDefaultPagination();
  public loading = true;
  measureDataInit: MeasureData = {
    measure_at: new Date,
    category:'',
    name: {
      en: '',
      zn: ''
    },
    type: '',
    unit: '',
    uuid: '',
    value: 0
  };
  public patient :Patient = {
    user:{
      age: 0,
      birthday: '',
      created_at: '',
      gender:'',
      health_state: 0,
      id: 0,
      id_card: '',
      name: '',
      phone: '',
      updated_at: '',
      uuid: ''
    },
    id: 0,
    record:{
      blood_pressure: {
        systolic: this.measureDataInit,
        diastolic: this.measureDataInit,
        pulse: this.measureDataInit
      }
    }
  };
  public patientRecords= undefined;
  public patients: Patient[] = [];
  public totalPatients = 0;
  public totalPages = 0;
  public currentPage = 1;
  public items :PatientInfo[] = []

  @Action async getPatientsByPages(options: PatientOptions): Promise<TODO> {
    this.setLoading(true);
    const result = await http.get(`/user?q=${options.q}&page=${options.page}&limit=10`);
    // (`/patient/list/${patientOptions.page}?q=${patientOptions.q}&&order=${patientOptions.order}&&sort=${patientOptions.sort}`);
    if(result){
      const data = result.data.data;
      console.log(data);
      this.setTotalPatients(data.total_users);
      this.setTotalPages(data.total_page);
      this.setPatients(data.users);
      this.setCurrentPage(options.page);
      // Extract Table Data
      await this.extractPatientInfo(data.users);
      this.setDataTable(this.items);
      this.setLoading(false);
    }else{
      console.error(result);
    }
  }

  @Action async getPatientByUuid(uuid: number): Promise<TODO> {
    this.setLoading(true);
    this.setPatient(undefined);
    const result = await http.get(`/user/${uuid}?with=record&record=mode:full|field:systolic,diastolic,pulse`);
    if(result.data.data){
      const data = result.data.data;
      const gender = {1: '男', '2': '女'};
      data.user.gender = gender[data.user.gender];

      this.setPatient(data);
      this.setLoading(false);
    }else{
      console.error(result);
    }
  }

  @Action({ rawError: true })
  async extractPatientInfo(patients: Patient[]) {
    patients.forEach(element => {
      if(element.user){
        if(element.user.birthday){
          const timestamp = Date.parse(element.user.birthday);
          if(isNaN(timestamp) === false){
            const date = new Date(element.user.birthday).toLocaleString();
            element.user.birthday = date;
          } 
        }
        element.user.phone = 'xxxx-xxx-xxx';
        this.items.push(element.user);     
      }
    });
  }

  @Action setDataTable(data: Entity[]) {
    const pagination = getPagination(data, this.totalPages, this.currentPage);
    this.setPagination(pagination);
  }

  @Action clearPatients() {
    this.setPatients([]);
    this.setItems([]);
    this.setTotalPages(0);
    this.setTotalPatients(0);
    this.setPagination(getDefaultPagination());
  }

  @Mutation setPagination(pagination: TODO): void {
    this.pagination = pagination;
  }
  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }
  
  @Mutation setPatient(patient: Patient): void {
    this.patient = patient;
  }
  
  @Mutation setPatients(patients: any[]): void {
    this.patients = patients;
  }
  @Mutation setTotalPatients(totalPatients: number): void {
    this.totalPatients = totalPatients;
  }

  @Mutation setTotalPages(totalPages: number): void {
    this.totalPages = totalPages;
  }
  @Mutation setCurrentPage(page: number): void {
    this.currentPage = page;
  }
  @Mutation setItems(items: PatientInfo[]): void {
    this.items = items;
  }
}

export const patientModule = getModule(PatientModule); // patients;