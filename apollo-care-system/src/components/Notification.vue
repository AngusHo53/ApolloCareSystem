<template>
  <v-card
    :loading="loading"
    color="grey lighten-3">
    <v-card-title>
      <v-toolbar-title class="font-weight-black">通知列表</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="notification in notifications"
          :key="notification.uuid"
          cols="12"
        >
          <v-card>
            <v-row>
              <v-col class="pb-0" cols="6">
                <p
                  class="text-h6 font-weight-black d-flex justify-start pl-3 pt-2 mb-0"
                >
                  {{ notification.payload.user.name }}
                </p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="6">
                <div
                  class="text-h6 font-weight-black d-flex justify-end pr-3 pt-2"
                >
                  {{ notification.payload.user.place }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <p
                  class="text-subtitle-1 font-weight-black d-flex justify-start pl-3 pt-2"
                >
                  {{ notification.payload.data }}
                </p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="6">
                <div
                  class="text-caption font-weight-light d-flex justify-end pr-3 pt-2"
                >
                  {{ notification.created_at }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { notificationModule } from "@/store/modules/notification";

@Component
export default class Notification extends Vue {
  get loading() {
    return notificationModule.loading;
  }

  get notifications() {
    return notificationModule.notifications;
  }

  async created() {
    await notificationModule.getNotificationList();
  }
}
</script>
