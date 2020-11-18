import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { PatientInfo, PatientOptions } from '@/types';
import store from "@/store";
import { getDefaultPagination, getPagination, GENDER } from '@/utils/store-util';
import { getPatientsByAccount, getPatientsNeedToAdd } from '@/api/accountListService';
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


  @Action
  async responsiblePatientsList(param) {
    this.setLoading(true);
    this.clearResponsible();
    const data = await getPatientsByAccount(param.uuid, param.options);
    this.setResponsiblePatients(data.patients);
    this.setTotalResponsiblePatients(data.total_patients);
    this.setTotalResponsiblePages(data.total_page);
    this.setCurrentResponsiblePage(param.options.page);

    this.responsiblePatients.forEach(element => {
      if (element) {
        const len = element.name.length;
        switch (len) {
          case 2:
            element.name = element.name.substring(0, 1) + "◯";
            break;
          case 3:
            element.name =
              element.name.substring(0, 1) +
              "◯" +
              element.name.substring(2, 3);
            break;
          case 4:
            element.name =
              element.name.substring(0, 1) +
              "◯◯" +
              element.name.substring(3, 4);
            break;
          default:
            element.name =
              element.name.substr(0, 3) +
              "◯".repeat(len - 6) +
              element.name.substr(len - 3, 3);
            break;
        }
        element.gender = GENDER[element.gender];
        element.iid =
          element.iid.substring(0, 3) +
          "****" +
          element.iid.substring(7, 10);
      }
    });
    const pagination = getPagination(
      this.responsiblePatients,
      this.totalResponsiblePages,
      this.currentResponsiblePage
    );
    this.setPagination(pagination);
    this.setLoading(false);
  }

  @Action
  async needToAddPatientsList(param) {
    this.setaLoading(true);
    this.clearNeedToAdd();
    const data = await getPatientsNeedToAdd(param.uuid, param.options)
    this.setNeedToAddPatients(data.patients);
    this.setTotalNeedToAddPages(data.total_page);
    this.setCurrentNeedToAddPage(this.aPagination.page);

    this.needToAddPatients.forEach(element => {
      if (element) {
        const len = element.name.length;
        switch (len) {
          case 2:
            element.name = element.name.substring(0, 1) + "◯";
            break;
          case 3:
            element.name =
              element.name.substring(0, 1) +
              "◯" +
              element.name.substring(2, 3);
            break;
          case 4:
            element.name =
              element.name.substring(0, 1) +
              "◯◯" +
              element.name.substring(3, 4);
            break;
          default:
            element.name =
              element.name.substr(0, 3) +
              "◯".repeat(len - 6) +
              element.name.substr(len - 3, 3);
            break;
        }
        element.gender = GENDER[element.gender];
        element.iid =
          element.iid.substring(0, 3) +
          "****" +
          element.iid.substring(7, 10);
      }
    });
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
    this.responsiblePatients = responsiblePatients;
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
    this.needToAddPatients = needToAddPatients;
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
