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
import { getPatientsByAccount } from '@/api/accountListService';
export interface ParamedicPatientsState {
  loading: boolean;
  pagination: Pagination;
  responsiblePatients: PatientInfo[];
  needToAddPatients: PatientInfo[];
}

@Module({ store, dynamic: true, name: "paramedicPatientsModule" })
class ParamedicPatientsModule extends VuexModule implements ParamedicPatientsState {
  public pagination = getDefaultPagination();
  public loading = false;
  public responsiblePatients: PatientInfo[] = [];
  public needToAddPatients: PatientInfo[] = [];

  public totalResponsiblePatients = 0;
  public totalResponsiblePages = 0;
  public currentResponsiblePage = 1;

  @Action
  async responsiblePatientsList(accountId: string, options: PatientOptions) {
    this.setLoading(true);
    console.log(JSON.stringify(options));
    const data = await getPatientsByAccount(accountId, options);
    this.setResponsiblePatients(data.patients);
    this.setTotalResponsiblePatients(data.total_patients);
    this.setTotalResponsiblePages(data.total_page);
    this.setCurrentResponsiblePage(options.page);

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

  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
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
}

export const paramedicPatientsModule = getModule(ParamedicPatientsModule);
