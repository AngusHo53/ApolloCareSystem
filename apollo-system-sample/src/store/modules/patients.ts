
import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Patient, Order, Entity, PatientInfo  } from '@/types';
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

  @Action async getPatientsByPages(page: number): Promise<TODO> {
    this.context.commit('setLoading', true );
    this.setLoading(true);
    const result = await http.get(`/patient/list/${page}`);
    const data = result.data.data;
    if(data){
      this.setTotalPatients(data.total_patients);
      this.setTotalPages(data.total_page);
      this.setPatients(data.patients);
      this.setCurrentPage(page);
      // Extract Table Data
      this.extractPatientInfo(data.patients);
      this.setDataTable(this.items);
      this.context.commit('setLoading', { loading: false });
      this.setLoading(false);
    }else{
      console.error(result);
    }
  }

  @Action getPatientsByKeyword(keyword: string): void {
    // To Do
  }

  @Action async getPatientById(id: number): Promise<TODO> {
    this.context.commit('setLoading', true );
    this.setLoading(true);
    const result = await http.get(`/user/${id}`);
    if(result.data.data){
      this.setPatient(result.data.data);
      this.context.commit('setLoading', false );
    }else{
      console.error(result);
    }
    this.setLoading(false);
  }

  @Action({ rawError: true })
  extractPatientInfo(patients: Patient[]) {
    patients.forEach(element => {
      const date = new Date(element.information.updated_at).toLocaleString();
      element.information.updated_at = date;
      element.information.birthday = date;
      element.information.phone = '09xx-xxx-xxx';
      this.items.push(element.information);
      console.log('test')
    });
  }

  @Action setDataTable(data: Entity[]) {
    const pagination = getPagination(data, this.totalPages, this.currentPage);
    this.setPagination(pagination);
  }
  @Action clearPatients() {
    this.setPatients([]);
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
  
  @Mutation setPatients(patients: Patient[]): void {
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