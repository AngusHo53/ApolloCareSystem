import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import lodash from "lodash";
import { Notification } from "@/types";
import { getNotificationList } from '@/api/notificationService';
import { getMeasurementTypes } from '@/api/patientsService';
import { patientRecordsModule } from "@/store/modules/patientRecords";

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
}

@Module({ store, dynamic: true, name: "notificationModule" })
class NotificationModule extends VuexModule implements NotificationState {
  public notifications: Notification[] = [];
  public loading = false;


  @Action async getNotificationList(params) {
    this.setLoading(true);
    patientRecordsModule.setMeasurementTypes(await getMeasurementTypes());
    const data = await getNotificationList(params);
    data.forEach(element => {
      const date = new Date(
        element.created_at * 1000
      ).toLocaleString();
      element.created_at = date;

    });

    this.setNotifications(data);
    this.setLoading(false);
  }

  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @Mutation setNotifications(notifications: Notification[]): void {
    this.notifications = lodash.cloneDeep(notifications);
  }
}

export const notificationModule = getModule(NotificationModule);
