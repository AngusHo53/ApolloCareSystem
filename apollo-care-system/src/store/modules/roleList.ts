import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { Account } from "@/types";
import store from "@/store";
import { getRoleList, replaceRole } from '@/api/roleListService';
export interface RoleListState {
  accounts: Account[];
  account: Account;
  loading: boolean;
}

@Module({ store, dynamic: true, name: "roleListModule" })
class RoleListModule extends VuexModule implements RoleListState {
  public accounts: Account[] = [];
  public account: Account = {
    name: "",
    email: "",
    iid: "",
    place: "",
    uuid: "",
    roles: []
  };
  public loading = false;

  @Action async roleList() {
    this.setLoading(true);
    this.setRoleList(await getRoleList());
    this.setLoading(false);
  }

  @Action async replaceRole() {
    this.setLoading(true);
    await replaceRole(this.account);
    this.setLoading(false);
    this.setAccount({
      name: "",
      email: "",
      iid: "",
      place: "",
      uuid: "",
      roles: []
    });
    this.roleList();
  }

  @Action clearRoleList() {
    this.setRoleList([]);
    this.setAccount({
      name: "",
      email: "",
      iid: "",
      place: "",
      uuid: "",
      roles: []
    });
  }

  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @Mutation setRoleList(accounts: Account[]): void {
    this.accounts = accounts;
  }

  @Mutation setAccount(account: Account): void {
    this.account = account;
  }


}

export const roleListModule = getModule(RoleListModule);
