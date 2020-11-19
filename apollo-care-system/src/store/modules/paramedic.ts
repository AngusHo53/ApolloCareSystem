import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { Account } from "@/types";
import store from "@/store";
import { getAccountList } from '@/api/accountListService';
import { GENDER } from '@/utils/store-util';
export interface ParamedicState {
  accounts: Account[];
  account: Account;
  loading: boolean;
  totalAccounts: number;
}

@Module({ store, dynamic: true, name: "paramedicModule" })
class ParamedicModule extends VuexModule implements ParamedicState {
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
  public totalAccounts = 0;
  public loading = false;

  @Action async accountList() {
    this.setLoading(true);
    this.setAccounts(await getAccountList());
    this.setTotalAccounts(this.accounts.length);

    this.accounts.forEach(element => {
      if (element && element.roles.includes("Paramedic")) {
        element.gender = GENDER[element.gender];
      }
    });
    this.setLoading(false);
  }

  @Action clearAccountList() {
    this.setAccounts([]);
    this.setTotalAccounts(0);
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

  @Mutation setAccounts(accounts: Account[]): void {
    this.accounts = accounts;
  }

  @Mutation setAccount(account: Account): void {
    this.account = account;
  }

  @Mutation setTotalAccounts(totalAccounts: number): void {
    this.totalAccounts = totalAccounts;
  }
}

export const paramedicModule = getModule(ParamedicModule);
