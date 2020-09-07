import Vue from "vue";
import Vuex from "vuex";
// import createPersistedState from "vuex-persistedstate";

import { UserState } from "./modules/user";
import { OrderState } from "./modules/orders";
import { CustomerState } from "./modules/customers";
import { PatientState } from "./modules/patients";
import { ProductState } from "./modules/products";
import { AppState } from "./modules/app";
import {RecordState } from "./modules/records";

Vue.use(Vuex);

interface RootState {
  appState: AppState;
  userState: UserState;
  orderState: OrderState;
  customerState: CustomerState;
  patientState: PatientState;
  productState: ProductState;
  recordState: RecordState;
}

export default new Vuex.Store<RootState>({
  // plugins: [createPersistedState({ storage: window.sessionStorage })] // !debug ? [createPersistedState({ storage: window.sessionStorage })] : [],
});
