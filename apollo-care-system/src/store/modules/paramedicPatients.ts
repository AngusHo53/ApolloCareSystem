import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { PatientInfo } from '@/types';
import store from "@/store";
import { getDefaultPagination, getPagination } from '@/utils/store-util';
import { formatUserInfo } from '@/utils/app-util';
import { getPatientsByAccount, getPatientsNeedToAdd, addPatientsToAccount } from '@/api/accountListService';
import lodash from "lodash";

export interface ParamedicPatientsState {
  loading: boolean;
  aLoading: boolean;
  pagination: Pagination;
  aPagination: Pagination;
  responsiblePatients: PatientInfo[];
  needToAddPatients: PatientInfo[];
}

@Module({ store, dynamic: true, name: "paramedicPatientsModule" })
class ParamedicPatientsModule extends VuexModule implements ParamedicPatientsState {
  public pagination = getDefaultPagination();
  public aPagination = getDefaultPagination();
  public loading = false;
  public aLoading = false;
  public responsiblePatients: PatientInfo[] = [];
  public totalResponsiblePatients = 0;
  public totalResponsiblePages = 0;
  public currentResponsiblePage = 1;

  public needToAddPatients: PatientInfo[] = [];
  public totalNeedToAddPages = 0;
  public currentNeedToAddPage = 1;

  public originalResponsible: PatientInfo[] = [];
  public originalPatients: PatientInfo[] = [];


  @Action
  async responsiblePatientsList(param) {
    this.setLoading(true);
    this.clearResponsible();
    const data = await getPatientsByAccount(param.uuid, param.options);
    const data2 = await getPatientsByAccount(param.uuid, param.options);
    this.setOriginalResponsible(data2.patients);
    this.setResponsiblePatients(await formatUserInfo(data.patients));
    this.setTotalResponsiblePatients(data.total_patients);
    this.setTotalResponsiblePages(data.total_page);
    this.setCurrentResponsiblePage(param.options.page);

    const pagination = getPagination(
      this.responsiblePatients,
      this.totalResponsiblePages,
      this.currentResponsiblePage
    );
    this.setPagination(pagination);
    this.setLoading(false);
  }

  @Action
  async addPatientsToAccount(param) {
    this.setLoading(true);
    await addPatientsToAccount(param.uuid, param.params);
    this.setLoading(false);
  }

  @Action
  async modifyPatientsId(uuid) {
    for (const item of this.originalPatients) {
      if (uuid === item.uuid) {
        return item.iid;
      }
    }
  }

  @Action
  async modifyResponsible(uuid) {
    for (const item of this.originalResponsible) {
      if (uuid === item.uuid) {
        return item.iid;
      }
    }
  }

  @Action
  async needToAddPatientsList(param) {
    this.setaLoading(true);
    this.clearNeedToAdd();
    const data = await getPatientsNeedToAdd(param.uuid, param.options);
    const data2 = await getPatientsNeedToAdd(param.uuid, param.options);
    this.setOriginalPatients(data2.patients);
    this.setNeedToAddPatients(await formatUserInfo(data.patients));

    this.setTotalNeedToAddPages(data.total_page);
    this.setCurrentNeedToAddPage(this.aPagination.page);
    const a_pagination = getPagination(
      this.needToAddPatients,
      this.totalNeedToAddPages,
      this.currentNeedToAddPage
    );
    this.setaPagination(a_pagination);
    this.setaLoading(false);
  }

  @Action clearResponsible() {
    this.setPagination(getDefaultPagination());
    this.setResponsiblePatients([]);
    this.setTotalResponsiblePatients(0);
    this.setTotalResponsiblePages(0);
    this.setCurrentResponsiblePage(1);
  }

  @Action clearNeedToAdd() {
    this.setaPagination(getDefaultPagination());
    this.setNeedToAddPatients([]);
    this.setTotalNeedToAddPages(0);
    this.setCurrentNeedToAddPage(1);
  }

  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @Mutation setaLoading(aLoading: boolean): void {
    this.aLoading = aLoading;
  }

  @Mutation setResponsiblePatients(responsiblePatients: PatientInfo[]): void {
    this.responsiblePatients = lodash.cloneDeep(responsiblePatients);
  }

  @Mutation setTotalResponsiblePatients(totalResponsiblePatients: number): void {
    this.totalResponsiblePatients = totalResponsiblePatients;
  }

  @Mutation setTotalResponsiblePages(totalResponsiblePages: number): void {
    this.totalResponsiblePages = totalResponsiblePages;
  }

  @Mutation setCurrentResponsiblePage(currentResponsiblePage: number): void {
    this.currentResponsiblePage = currentResponsiblePage;
  }


  @Mutation setPagination(pagination: Pagination): void {
    this.pagination = pagination;
  }

  @Mutation setNeedToAddPatients(needToAddPatients: PatientInfo[]): void {
    this.needToAddPatients = lodash.cloneDeep(needToAddPatients);
  }

  @Mutation setOriginalPatients(originalPatients: PatientInfo[]): void {
    this.originalPatients = lodash.cloneDeep(originalPatients);
  }

  @Mutation setOriginalResponsible(originalResponsible: PatientInfo[]): void {
    this.originalResponsible = lodash.cloneDeep(originalResponsible);
  }

  @Mutation setTotalNeedToAddPages(totalNeedToAddPages: number): void {
    this.totalNeedToAddPages = totalNeedToAddPages;
  }

  @Mutation setCurrentNeedToAddPage(currentNeedToAddPage: number): void {
    this.currentNeedToAddPage = currentNeedToAddPage;
  }

  @Mutation setaPagination(aPagination: Pagination): void {
    this.aPagination = aPagination;
  }



}

export const paramedicPatientsModule = getModule(ParamedicPatientsModule);
