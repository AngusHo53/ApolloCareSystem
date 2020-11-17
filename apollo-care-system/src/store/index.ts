import Vue from "vue";
import Vuex from "vuex";
// import createPersistedState from "vuex-persistedstate";

import { UserState } from "./modules/user";
import { PatientState } from "./modules/patients";
import { AppState } from "./modules/app";
import { RecordState } from "./modules/records";
import { ApiTokenState } from "./modules/apiToken";
import {RoleListState} from "./modules/roleList";
Vue.use(Vuex);

interface RootState {
  appState: AppState;
  userState: UserState;
  patientState: PatientState;
  recordState: RecordState;
  apiTokenState: ApiTokenState;
  roleListState: RoleListState;
}

export default new Vuex.Store<RootState>({
  // plugins: [createPersistedState({ storage: window.sessionStorage })] // !debug ? [createPersistedState({ storage: window.sessionStorage })] : [],
});
