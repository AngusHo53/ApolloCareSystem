import { Patient, Entity, PatientInfo, MeasureData } from '@/types';
import { getDefaultPagination, getPagination } from '@/utils/store-util';
import { formatUserInfo, formatValue } from '@/utils/app-util';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { getPatientByUuid, getPatientRecordByUuid, getMeasurementTypes } from '@/api/patientsService';
import store from '@/store';
import lodash from "lodash";

export interface PatientRecordsState {
  pagination: Pagination;
  loading: boolean;
  r_loading: boolean;
  patient: Patient;
  items: PatientInfo[];
}

@Module({ store, dynamic: true, name: 'patientRecordsModule' })
class PatientRecordsModule extends VuexModule implements PatientRecordsState {
  public pagination = getDefaultPagination();
  public loading = false;
  public r_loading = false;
  measureDataInit: MeasureData = {
    measure_at: '',
    category: '',
    type: '',
    unit: '',
    uuid: '',
    value: 0
  };
  public records: MeasureData[] = []
  public totalRecords = 0;
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
  public totalPages = 0;
  public currentPage = 1;
  public items = [];
  public measurementTypes = {};

  @Action async getPatientByUuid(uuid: string): Promise<TODO> {
    this.setLoading(true);
    this.setPatient({
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
    });
    const data = await getPatientByUuid(uuid);
    this.setPatient(await formatUserInfo(data));
    this.setLoading(false);
  }

  @Action async getPatientRecordByUuid(options): Promise<TODO> {
    this.clearRecord();
    this.setrLoading(true);
    const data = await getPatientRecordByUuid(options);

    this.setTotalPages(data.total_page);
    this.setCurrentPage(data.current_page);
    this.setRecords(data.records);
    this.setMeasurementTypes(await getMeasurementTypes());
    await this.formateData({ data: data.records, formatTime: options.formatMeasureAt });
    await this.setRecordDataTable(data.records);
    this.setrLoading(false);
  }

  @Action async formateData(obj: { data, formatTime: boolean }) {
    const total = new Set();

    await obj.data.sort((a, b) => {
      return new Date(a.measure_at).getTime() > new Date(b.measure_at).getTime()
        ? 1
        : new Date(b.measure_at).getTime() > new Date(a.measure_at).getTime()
          ? -1
          : 0;
    });
    await obj.data.forEach((element) => {
      if (element) {
        if (!obj.formatTime) {
          element.measure_at = new Date(
            element.measure_at * 1000
          ).toLocaleString();
        }
        // Calculate the total records
        total.add(element.measure_at);
        element.zh = this.measurementTypes[element.key].i18n.zh;
        if (this.measurementTypes[element.category]) {
          element.category = this.measurementTypes[element.category].i18n.zh;
        }
        element.value = formatValue(element.value);
      }
      this.items.push(element);
    });
    this.setTotalRecords(total.size);
  }

  @Action async setRecordDataTable(data: Entity[]) {
    const pagination = getPagination(data, this.totalPages, this.currentPage, data.length);
    this.setPagination(pagination);
  }

  @Action clearRecord() {
    this.setRecords([]);
    this.setTotalRecords(0);
    this.setTotalPages(0);
    this.setItems([]);
    this.setMeasurementTypes({});
  }

  @Mutation setPagination(pagination: TODO): void {
    this.pagination = pagination;
  }

  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @Mutation setrLoading(r_loading: boolean): void {
    this.r_loading = r_loading;
  }

  @Mutation setPatient(patient: Patient): void {
    this.patient = lodash.cloneDeep(patient);
  }

  @Mutation setRecords(records: MeasureData[]): void {
    this.records = lodash.cloneDeep(records);
  }

  @Mutation setTotalRecords(totalRecords: number): void {
    this.totalRecords = totalRecords;
  }

  @Mutation setTotalPages(totalPages: number): void {
    this.totalPages = totalPages;
  }
  @Mutation setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  @Mutation setItems(items): void {
    this.items = lodash.cloneDeep(items);
  }

  @Mutation setMeasurementTypes(measurementTypes) {
    this.measurementTypes = measurementTypes;
  }

}

export const patientRecordsModule = getModule(PatientRecordsModule); // patients;
