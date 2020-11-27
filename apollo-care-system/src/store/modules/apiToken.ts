import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { ApiToken } from "@/types";
import store from "@/store";
import { getApiList, createApi, modifyApi, deleteApi, resetToken } from '@/api/apiTokenService';
import lodash from "lodash";

export interface ApiTokenState {
  api_list: ApiToken[];
  api_token: ApiToken;
  loading: boolean;
}

@Module({ store, dynamic: true, name: "apiTokenModule" })
class ApiTokenModule extends VuexModule implements ApiTokenState {
  public api_list: ApiToken[] = [];
  public api_token: ApiToken = {
    name: "",
    api_type: 0,
    uuid: "",
    api_key: "",
  };
  public loading = false;


  @Action async apiList() {
    this.setLoading(true);
    this.setApiList(await getApiList());
    this.setLoading(false);
  }

  @Action async createApi() {
    this.setLoading(true);
    await createApi(this.api_token);
    this.setLoading(false);
    this.setApiToken({
      name: "",
      api_type: 0,
      uuid: "",
      api_key: ""
    });
    this.apiList();
  }

  @Action async modifyApi() {
    this.setLoading(true);
    await modifyApi(this.api_token);
    this.setLoading(false);
    this.setApiToken({
      name: "",
      api_type: 0,
      uuid: "",
      api_key: ""
    });
    this.apiList();
  }

  @Action async deleteApi() {
    this.setLoading(true);
    await deleteApi(this.api_token);
    this.setLoading(false);
    this.setApiToken({
      name: "",
      api_type: 0,
      uuid: "",
      api_key: ""
    });
    this.apiList();
  }

  @Action async resetToken() {
    this.setLoading(true);
    await resetToken(this.api_token);
    this.setLoading(false);
    this.setApiToken({
      name: "",
      api_type: 0,
      uuid: "",
      api_key: ""
    });
    this.apiList();
  }

  @Action clearApiToken() {
    this.setApiList([]);
    this.setApiToken({
      name: "",
      api_type: 0,
      uuid: "",
      api_key: ""
    });
  }

  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @Mutation setApiList(api_list: ApiToken[]): void {
    this.api_list = lodash.cloneDeep(api_list);
  }

  @Mutation setApiToken(api_token: ApiToken): void {
    this.api_token = api_token;
  }
}

export const apiTokenModule = getModule(ApiTokenModule);
