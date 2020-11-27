
import { Patient, Entity, PatientInfo, PatientOptions } from '@/types';
import { getDefaultPagination, getPagination } from '@/utils/store-util';
import { formatUserInfo } from '@/utils/app-util';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { getVerifyPatients,verifyPatientsByUuid } from "@/api/patientsService";
import store from '@/store';
import lodash from "lodash";

export interface PatientState {
  pagination: Pagination;
  loading: boolean;
  verifyPatients: Patient[];
  verifyItems: PatientInfo[];
}
@Module({ store, dynamic: true, name: 'verifyPatientModule' })
class VerifyPatientModule extends VuexModule implements PatientState {
  pagination: Pagination = getDefaultPagination();
  public totalVerifyPatients = 0;
  public totalPages = 0;
  public currentPage = 1;

  status = true;
  loading = false;
  verifyPatients: Patient[] = [];
  verifyItems: PatientInfo[] = [];

  @Action async getVerifyPatients(options: PatientOptions): Promise<TODO> {
    this.setLoading(true);
    this.clearVerifyPatients();
    const data = lodash.cloneDeep(await getVerifyPatients(options));
    this.setTotalVerifyPatients(data.total_users);
    this.setTotalPages(data.total_page);
    this.setVerifyPatients(await formatUserInfo(data.users));
    this.setCurrentPage(options.page);

    await this.extractVerifyPatientInfo(this.verifyPatients);
    this.setDataTable(this.verifyItems);
    this.setLoading(false);

  }

  @Action async verifyPatientsByUuid(params): Promise<TODO> {
    this.setLoading(true);
    verifyPatientsByUuid(params.uuid,params.params);
    this.setLoading(false);
  }

  @Action({ rawError: true })
  async extractVerifyPatientInfo(verifyPatients: Patient[]) {
    verifyPatients.forEach(element => {
      if (element.user) {
        this.verifyItems.push(element.user);
      }
    });
  }

  @Action setDataTable(data: Entity[]) {
    const pagination = getPagination(data, this.totalPages, this.currentPage);
    this.setPagination(pagination);
  }

  @Action async clearVerifyPatients() {
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
    this.verifyPatients = lodash.cloneDeep(verifyPatients);
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
    this.verifyItems = lodash.cloneDeep(items);
  }

}


export const verifyPatientModule = getModule(VerifyPatientModule); // patients;
