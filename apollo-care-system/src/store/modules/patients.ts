
import { Patient, Entity, PatientInfo, PatientOptions, MeasureData, PatientFormData } from '@/types';
import { getDefaultPagination, getPagination } from '@/utils/store-util';
import { formatUserInfo } from '@/utils/app-util';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { getPatientsList, setPatientsInfo, createPatient } from '@/api/patientsService';
import store from '@/store';
import lodash from "lodash";

export interface PatientState {
  pagination: Pagination;
  loading: boolean;
  patients: Patient[];
  items: PatientInfo[];
}

@Module({ store, dynamic: true, name: 'patientModule' })
class PatientModule extends VuexModule implements PatientState {
  public pagination = getDefaultPagination();
  public loading = false;
  measureDataInit: MeasureData = {
    measure_at: '',
    category: '',
    type: '',
    unit: '',
    uuid: '',
    value: 0
  };
  public patientRecords = undefined;
  public patients: Patient[] = [];
  public totalPatients = 0;
  public totalPages = 0;
  public currentPage = 1;
  public items: PatientInfo[] = [];

  @Action async getPatientsByPages(options: PatientOptions): Promise<TODO> {
    this.setLoading(true);
    this.clearPatients();
    const data = lodash.cloneDeep(await getPatientsList(options));
    this.setTotalPatients(data.total_users);
    this.setTotalPages(data.total_page);
    this.setCurrentPage(options.page);
    // Extract Table Data
    this.setPatients(await formatUserInfo(data.users));
    this.extractPatientInfo(this.patients);
    this.setDataTable(this.items);
    this.setLoading(false);
  }

  @Action async setPatientsInfo(param): Promise<TODO> {
    this.setLoading(true);
    await setPatientsInfo(param.uuid, param.params);
    this.setLoading(false);
  }


  @Action async createPatient(info: PatientFormData): Promise<TODO> {
    this.setLoading(true);
    createPatient(info)
    this.setLoading(false);
  }

  @Action({ rawError: true })
  async extractPatientInfo(patients: Patient[]) {
    patients.forEach(element => {
      if (element.user) {
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

  @Mutation setPatients(patients: Patient[]): void {
    this.patients = lodash.cloneDeep(patients);
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
    this.items = lodash.cloneDeep(items);
  }
}

export const patientModule = getModule(PatientModule); // patients;
