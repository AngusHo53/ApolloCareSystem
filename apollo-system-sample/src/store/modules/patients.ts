
import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Patient, Order, Entity, PatientInfo, PatientOptions  } from '@/types';
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
  public patient :Patient = undefined;
  public patientRecords= undefined;
  public patients: Patient[] = [];
  public totalPatients = 0;
  public totalPages = 0;
  public currentPage = 1;
  public items :PatientInfo[] = []

  @Action async getPatientsByPages(patientOptions: PatientOptions): Promise<TODO> {
    this.context.commit('setLoading', true );
    this.setLoading(true);
    const result = await http.get(`/user?q=${patientOptions.q}&page=${patientOptions.page}&limit=10`);
    // (`/patient/list/${patientOptions.page}?q=${patientOptions.q}&&order=${patientOptions.order}&&sort=${patientOptions.sort}`);
    if(result){
      const data = result.data.data;
      console.log(data);
      this.setTotalPatients(data.total_users);
      this.setTotalPages(data.total_page);
      this.setPatients(data.users);
      this.setCurrentPage(patientOptions.page);
      // Extract Table Data
      await this.extractPatientInfo(data.users);
      this.setDataTable(this.items);
      this.context.commit('setLoading', { loading: false });
      this.setLoading(false);
    }else{
      console.error(result);
    }
  }

  @Action async getPatientById(id: number): Promise<TODO> {
    this.context.commit('setLoading', true );
    this.setLoading(true);
    const result = await http.get(`/user/${id}?with=record&record=mode:full|field:systolic,diastolic,pulse`);
    if(result.data.data){
      this.setPatient(result.data.data);
      this.context.commit('setLoading', false );
    }else{
      console.error(result);
    }
    this.setLoading(false);
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

  @Mutation setPatientRecords(records: any): void {
    this.patient = records;
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