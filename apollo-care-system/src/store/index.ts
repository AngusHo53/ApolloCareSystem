import Vue from "vue";
import Vuex from "vuex";
// import createPersistedState from "vuex-persistedstate";

import { UserState } from "./modules/user";
import { PatientState } from "./modules/patients";
import { PatientRecordsState } from "./modules/patientRecords";
import { AppState } from "./modules/app";
import { ApiTokenState } from "./modules/apiToken";
import { RoleListState } from "./modules/roleList";
import { ParamedicState } from "./modules/paramedic";
import { ParamedicPatientsState } from "./modules/paramedicPatients";
import { PlaceState } from "./modules/place";
Vue.use(Vuex);

interface RootState {
  appState: AppState;
  userState: UserState;
  patientState: PatientState;
  patientRecordsState: PatientRecordsState;
  apiTokenState: ApiTokenState;
  roleListState: RoleListState;
  paramedicState: ParamedicState;
  paramedicPatientsState: ParamedicPatientsState;
  placeState: PlaceState;
}

export default new Vuex.Store<RootState>({
  // plugins: [createPersistedState({ storage: window.sessionStorage })] // !debug ? [createPersistedState({ storage: window.sessionStorage })] : [],
});
