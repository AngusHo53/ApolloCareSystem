<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-container fluid>
          <v-data-table
            :headers="headers"
            :items="account_list"
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
                            <v-text-field disabled v-model="editedItem.name" label="用戶名"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-autocomplete
                              v-model="editedItem.roles"
                              :items="role_item"
                              :rules="[() => !!editedItem.roles || 'This field is required']"
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
                      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
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
import { appModule } from "@/store/modules/app";
import http from "../http/axios";
import { userModule } from "@/store/modules/user";

@Component
export default class RoleList extends Vue {
  public dialog = false;
  public loading = true;
  public headers = [
    {
      text: "用戶",
      align: "start",
      value: "name"
    },
    { text: "權限組", value: "roles" },
    { text: "Actions", value: "actions", sortable: false }
  ];
  public account_list = [{ uuid: "", name: "", roles: [] }];

  public editedItem = {
    uuid: "",
    name: "",
    roles: []
  };

  public defaultItem = {
    uuid: "",
    name: "",
    roles: []
  };

  public role_item = [];
  public admin_role = ["Developer", "Doctor", "Paramedic", "Patient"];
  public owner_role = ["Admin", "Developer", "Doctor", "Paramedic", "Patient"];
  editItem(item) {
    this.editedItem = Object.assign({}, item);

    this.dialog = true;
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
    });
  }

  public async save() {
    console.log(this.editedItem.roles);
    const params = {
      roles: this.editedItem.roles
    };
    const result = await http.put(
      "/user/" + this.editedItem.uuid + "/roles",
      params
    );
    console.log(result);
    if (result) {
      if (result.data.status === "Success") {
        appModule.sendSuccessNotice("修改成功");
      } else {
        appModule.sendErrorNotice("修改失敗");
      }
    }
    this.close();
    // location.reload();
  }

  public async roleList() {
    const result = await http.get("/accounts");
    if (result) {
      if (result.data.status === "Success") {
        this.account_list = result.data.data.accounts;
        this.loading = false;
      } else {
        console.log("error");
      }
    } else {
      console.log("error");
    }
  }

  created() {
    this.roleList();
    if (this.user.roles.includes("Owner")) {
      this.role_item = this.role_item.concat(this.owner_role);
    } else if (this.user.roles.includes("Admen")) {
      this.role_item = this.role_item.concat(this.admin_role);
    }
  }

  mounted() {}

  get user() {
    return userModule.user;
  }
}
</script>
