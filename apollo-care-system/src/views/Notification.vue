<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card :loading="loading">
        <v-card-title>
          <v-toolbar-title>通知列表</v-toolbar-title>
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
                  <v-col class="pb-0">
                    <p
                      class="text-h4 text--primary font-weight-black d-flex justify-start pl-6 pt-2 mb-0"
                    >
                      {{ notification.payload.user.name }}
                    </p>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col>
                    <div
                      class="text-h4 text--primary font-weight-black d-flex justify-end pr-6 pt-2"
                    >
                      {{ notification.payload.user.place }}
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <p
                      class="text-h5 text--primary font-weight-black d-flex justify-start pl-6 pt-2"
                    >
                      {{ notification.payload.data }}
                    </p>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col>
                    <div
                      class="text-subtitle-1 text--primary font-weight-light d-flex justify-end pr-6 pt-2"
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
    </v-flex>
  </v-container>
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
    const dateTime = new Date().getTime();
    const params = {
      end_to: 1597063601.0,
    };
    await notificationModule.getNotificationList(params);
  }
}
</script>
