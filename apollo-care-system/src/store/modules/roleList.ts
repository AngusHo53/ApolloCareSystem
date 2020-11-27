import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { Account } from "@/types";
import store from "@/store";
import { getAccountList, replaceRole } from '@/api/accountListService';
import lodash from "lodash";

export interface RoleListState {
  accounts: Account[];
  account: Account;
  loading: boolean;
}

@Module({ store, dynamic: true, name: "roleListModule" })
class RoleListModule extends VuexModule implements RoleListState {
  public accounts: Account[] = [];
  public account: Account = {
    age: 0,
    birthday: "",
    created_at: "",
    gender: "",
    health_state: 0,
    id: 0,
    iid: "",
    name: "",
    phone: "",
    updated_at: "",
    uuid: "",
    email: "",
    place: "",
    roles: [""]
  };
  public loading = false;

  @Action async roleList() {
    this.setLoading(true);
    this.setRoleList(await getAccountList());
    this.setLoading(false);
  }

  @Action async replaceRole() {
    this.setLoading(true);
    await replaceRole(this.account);
    this.setLoading(false);
    this.setAccount({
      age: 0,
      birthday: "",
      created_at: "",
      gender: "",
      health_state: 0,
      id: 0,
      iid: "",
      name: "",
      phone: "",
      updated_at: "",
      uuid: "",
      email: "",
      place: "",
      roles: [""]
    });
    this.roleList();
  }

  @Action clearRoleList() {
    this.setRoleList([]);
    this.setAccount({
      age: 0,
      birthday: "",
      created_at: "",
      gender: "",
      health_state: 0,
      id: 0,
      iid: "",
      name: "",
      phone: "",
      updated_at: "",
      uuid: "",
      email: "",
      place: "",
      roles: [""]
    });
  }

  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @Mutation setRoleList(accounts: Account[]): void {
    this.accounts = lodash.cloneDeep(accounts);
  }

  @Mutation setAccount(account: Account): void {
    this.account = lodash.cloneDeep(account);
  }


}

export const roleListModule = getModule(RoleListModule);
