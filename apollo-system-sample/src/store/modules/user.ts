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
import axios from "axios";
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
  user = getUser();
  token = getToken();

  public userInfo = {} as UserInfo;
  public signedIn = false;


  get isSignedIn(): boolean {
    return this.user.email && this.token ? true : false;
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
  logout() {
    console.log('登出');
    axios({
      method: 'get',
      baseURL: Vue.prototype.baseURL,
      url: `/user/logout`,
       headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        "Access-Control-Allow-Origin" : "*", 
        'Authorization' : 'Bearer ' + getToken()
      }
    })
      .then(result => {
        this.setToken("");
        this.setUser({} as User);
        cleanSession();
      })
      .catch(err => {
        console.error(err);
      });
  }
}

export const userModule = getModule(UserModule);
