
import { Patient, Entity, PatientInfo, PatientOptions, MeasureData, PatientFormData } from '@/types';
import { getDefaultPagination, getPagination, GENDER } from '@/utils/store-util';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { getPatientsList,setPatientsInfo } from '@/api/patientsService';
import store from '@/store';
import http from "@/http/axios";

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
    measure_at: '',
    category: '',
    type: '',
    unit: '',
    uuid: '',
    value: 0
  };
  public patient: Patient = {
    user: {
      age: 0,
      birthday: '',
      created_at: '',
      gender: '',
      health_state: 0,
      id: 0,
      iid: '',
      name: '',
      phone: '',
      updated_at: '',
      uuid: '',
      email: '',
      place: '',
      roles: [""]
    },
    id: 0,
    record: {
      blood: null,
      blood_glucose: null,
      blood_pressure: null,
      body_temperature: null,
      bone: null,
      frailty: null,
      mental: null,
      metabolic: null,
      spo2: null
    }
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
    const data = await getPatientsList(options);
    this.setTotalPatients(data.total_users);
    this.setTotalPages(data.total_page);
    this.setPatients(data.users);
    this.setCurrentPage(options.page);
    // Extract Table Data
    await this.extractPatientInfo(data.users);
    this.setDataTable(this.items);
    this.setLoading(false);
  }

  @Action async setPatientsInfo(param): Promise<TODO> {
    this.setLoading(true);
    await setPatientsInfo(param.uuid,param.params);
    this.setLoading(false);
  }

  @Action async getPatientByUuid(uuid: string): Promise<TODO> {
    this.setPatient(undefined);
    const result = await http.get(`/user/${uuid}?with=record&record=mode%3Afull%7Cfield%3Aall`);
    if (result.data.data) {
      const data = result.data.data;
      data.user.gender = GENDER[data.user.gender];
      this.setPatient(data);
    } else {
      console.error(result);
    }
    return result;
  }

  @Action async createPatient(info: PatientFormData): Promise<TODO> {
    this.setLoading(true);
    this.setPatient(undefined);
    const result = await http.post(`/user`, info);
    if (result.data.status === "Success") {
      this.setLoading(false);
    } else {
      console.error(result);
    }
    return result;
  }

  @Action({ rawError: true })
  async extractPatientInfo(patients: Patient[]) {
    patients.forEach(element => {
      if (element.user) {
        console.log()
        const len = element.user.name.length;
        switch (len) {
          case 2:
            element.user.name = element.user.name.substring(0, 1) + "◯";
            break;
          case 3:
            element.user.name =
              element.user.name.substring(0, 1) +
              "◯" +
              element.user.name.substring(2, 3);
            break;
          case 4:
            element.user.name =
              element.user.name.substring(0, 1) +
              "◯◯" +
              element.user.name.substring(3, 4);
            break;
          default:
            element.user.name = element.user.name.substr(0, 3) + "◯".repeat(len-6) + element.user.name.substr(len-3, 3);
            break;
        }

        element.user.iid = element.user.iid.substring(0, 3) + "*****" + element.user.iid.substring(8, 10);

        element.user.gender = GENDER[element.user.gender];
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
    this.setPatient(undefined);
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
