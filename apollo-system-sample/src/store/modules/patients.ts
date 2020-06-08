
import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Patient, Order, Entity, PatientInfo  } from '@/types';
import { getDefaultPagination, getPagination } from '@/utils/store-util';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getToken } from "@/utils/app-util";
import Vue from 'vue';
import axios from "axios";

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
  public patient = {} as Patient;
  public patients: Patient[] = [];
  public totalPatients = 0;
  public totalPages = 0;
  public currentPage = 1;
  public items :PatientInfo[] = []

  @Action getPatientsByPages(page: number): void {
    this.context.commit('setLoading', { loading: true });
    this.setLoading(true);
    axios({
      method: 'get',
      baseURL: Vue.prototype.baseURL,
      url: `/patient/list/${page}`,
       headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        "Access-Control-Allow-Origin" : "*", 
        'Authorization' : 'Bearer ' + getToken()
      }
    })
      .then(result => {
        const data = result.data.data;
        if(data){
          this.setTotalPatients(data.total_patients);
          this.setTotalPages(data.total_page);
          this.setPatients(data.patients);
          this.setCurrentPage(page);
          // Extract Table Data
          this.extractPatientInfo(data.patients)
          this.setDataTable(this.items);
        }
        this.setLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }

  @Action getPatientsByKeyword(keyword: string): void {
    // To Do
  }

  @Action getPatientById(id: number): void {
    this.context.commit('setLoading', { loading: true });
    this.setLoading(true);
    axios({
      method: 'get',
      baseURL: Vue.prototype.baseURL,
      url: `/user/${id}`,
       headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        "Access-Control-Allow-Origin" : "*", 
        'Authorization' : 'Bearer ' + getToken()
      }
    })
      .then(result => {
        const data = result.data.data;
        this.setLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }

  @Action({ rawError: true })
  extractPatientInfo(patients: Patient[]) {
    patients.forEach(element => {
      element.information.updated_at = new Date(element.information.updated_at).toLocaleString();
      this.items.push(element.information);
    });
  }

  @Action setDataTable(data: PatientInfo[]) {
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