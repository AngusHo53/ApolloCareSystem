<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-container fluid>
          <v-data-table
            :headers="headers"
            :items="accounts"
            :loading="loading"
            loading-text="請稍後..."
            item-key="uuid"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>權限列表</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="50%">
                  <v-card>
                    <v-card-title>
                      <span class="headline">編輯權限</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field disabled v-model="account.name" label="用戶名"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-autocomplete
                              v-model="account.roles"
                              :items="role_item"
                              :rules="[() => !!account.roles || 'This field is required']"
                              label="權限組"
                              multiple
                              required
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialog = false;">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-awesome-icon class="mr-2" @click="editItem(item)" icon="edit" size="lg" />
            </template>
          </v-data-table>
        </v-container>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { userModule } from "@/store/modules/user";
import { roleListModule } from "@/store/modules/roleList";

@Component
export default class RoleList extends Vue {
  public dialog = false;
  public headers = [
    {
      text: "用戶",
      align: "start",
      value: "name"
    },
    { text: "權限組", value: "roles" },
    { text: "Actions", value: "actions", sortable: false }
  ];

  public role_item = [];
  public admin_role = ["Developer", "Doctor", "Paramedic", "Patient"];
  public owner_role = ["Admin", "Developer", "Doctor", "Paramedic", "Patient"];

  get user() {
    return userModule.user;
  }

  get loading() {
    return roleListModule.loading;
  }

  get accounts() {
    return roleListModule.accounts;
  }

  get account() {
    return roleListModule.account;
  }

  set account(item) {
    roleListModule.setAccount(item);
  }

  created() {
    roleListModule.roleList();
    if (this.user.roles.includes("Owner")) {
      this.role_item = this.role_item.concat(this.owner_role);
    } else if (this.user.roles.includes("Admin")) {
      this.role_item = this.role_item.concat(this.admin_role);
    }
  }

  editItem(item) {
    this.account = Object.assign({}, item);
    this.dialog = true;
  }

  public async save() {
    roleListModule.replaceRole();
    this.dialog = false;
  }
}
</script>
