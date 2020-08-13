
import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Patient, Order, Entity, PatientInfo, PatientOptions, VerifyPatients, RecordOptions, MeasureData, Record } from '@/types';
import { getDefaultPagination, getPagination } from '@/utils/store-util';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import Vue from 'vue';
import http from "@/http/axios";
import { reject } from 'lodash';

export interface PatientState {
  pagination: Pagination;
  loading: boolean;
  verifyPatients: Patient[];
  items: PatientInfo[];
}
@Module({ store, dynamic: true, name: 'verifyPatientModule' })
class VerifyPatientModule extends VuexModule implements PatientState {
  pagination: Pagination = getDefaultPagination();
  public totalVerifyPatients = 0;
  public totalPages = 0;
  public currentPage = 1;

  status = true;
  loading = true;
  verifyPatients: Patient[] = [];
  items: PatientInfo[] = [];

  @Action async getVerifyPatients(options: PatientOptions): Promise<TODO> {
    this.setLoading(true);
    const result = await http.get(`/user?verify=-1&page=${options.page}&limit=10`);
    if (result.data.data) {
      const data = result.data.data;

      this.setTotalVerifyPatients(data.total_users);
      this.setTotalPages(data.total_page);
      this.setVerifyPatients(data.users);
      this.setCurrentPage(options.page);

      await this.extractPatientInfo(data.users);
      this.setDataTable(this.items);
      this.setLoading(false);
    } else {
      console.error(result);
    }
  }

  @Action async verifyPatientsByUuid(verifySelects:VerifyPatients): Promise<TODO> {
    this.setLoading(true);
    const patients = verifySelects.patients;
    const params = {
      status: verifySelects.status,
    };
    for (const patient of patients) {
      const result = await http.post(`/user/${patient.uuid}/verify`, params);
      if (result) {
        console.log(result)
      } else {
        console.error(result);
      }
    }
    this.setLoading(false);
  }

  @Action({ rawError: true })
  async extractPatientInfo(patients: Patient[]) {
    const gender = { 1: '男', 2: '女' };
    patients.forEach(element => {
      if (element.user) {
        // if (element.user.birthday) {
        //     const timestamp = Date.parse(element.user.birthday);
        //     if (isNaN(timestamp) === false) {
        //         const date = new Date(element.user.birthday).toLocaleString();
        //         element.user.birthday = date;
        //     }
        // }
        // element.user.phone = 'xxxx-xxx-xxx';
        element.user.gender = gender[element.user.gender];
        this.items.push(element.user);
      }
    });
  }

  @Action setDataTable(data: Entity[]) {
    const pagination = getPagination(data, this.totalPages, this.currentPage);
    this.setPagination(pagination);
  }

  @Action clearPatients() {
    this.setVerifyPatients([]);
    this.setItems([]);
    this.setTotalPages(0);
    this.setTotalVerifyPatients(0);
    this.setPagination(getDefaultPagination());
  }

  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @Mutation setVerifyPatients(verifyPatients: Patient[]): void {
    this.verifyPatients = verifyPatients;
  }

  @Mutation setPagination(pagination: TODO): void {
    this.pagination = pagination;
  }

  @Mutation setTotalVerifyPatients(totalVerifyPatients: number): void {
    this.totalVerifyPatients = totalVerifyPatients;
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


export const verifyPatientModule = getModule(VerifyPatientModule); // patients;
