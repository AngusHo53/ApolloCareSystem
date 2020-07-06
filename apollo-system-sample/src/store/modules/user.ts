import { User, UserInfo } from "@/types";
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import { login } from "@/utils/demo-api";
import {
  getUser,
  getToken,
  setToken,
  setUser,
  cleanSession
} from "@/utils/app-util";
import Vue from 'vue';
import http from "@/http/axios";
export interface UserState {
  callingAPI: boolean;
  searching: string;
  user: User;
  token: string;
  // mode: string;
  userInfo: UserInfo;
  signedIn: boolean;
}

@Module({ store, dynamic: true, name: "userModule" })
class UserModule extends VuexModule implements UserState {
  public callingAPI = false;
  public searching = "";
  user: User = getUser();
  token = getToken();

  public userInfo = {} as UserInfo;
  public signedIn = false;


  get isSignedIn(): boolean {
    return this.user.name && this.token ? true : false;
  }

  @Mutation
  private loginLoading() {
    this.callingAPI = !this.callingAPI;
  }
  @Mutation
  private globalSearching() {
    this.searching = this.searching === "" ? "loading" : "";
  }

  @Mutation
  private setUser(_user: User): void {
    this.user = _user;
  }

  @Mutation
  private setToken(_token: string) {
    this.token = _token;
  }

  @Mutation
  private setUserInfo(_userInfo: UserInfo) {
    this.userInfo = _userInfo;
  }

  @Action({ rawError: true })
  public signIn(userData) {
    console.log(userData.accessToken)
    console.log(userData.user);
    setToken(userData.accessToken);
    setUser(JSON.stringify(userData.user));

    this.setToken(userData.accessToken);
    this.setUser(userData.user);
  }

  @Action({ rawError: true })
  async logout() {
    await http.post(`/user/logout`, null);
    this.setToken("");
    this.setUser({} as User);
    cleanSession();
  }
}

export const userModule = getModule(UserModule);
