<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-container fluid>
          <v-data-table
            :headers="headers"
            :items="api_list"
            :loading="loading"
            loading-text="請稍後..."
            item-key="name"
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
                              v-model="editedItem.api_type"
                              :items="role_item"
                              :rules="[() => !!editedItem.api_type || 'This field is required']"
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
    { text: "權限組", value: "api_type" },
    { text: "Actions", value: "actions", sortable: false }
  ];
  public api_list = [];
  public editedItem = {
    name: "",
    api_type: 0,
    uuid: ""
  };

  public apiKey = {
    name: "",
    api_key: ""
  };

  public defaultItem = {
    name: "",
    api_type: 0,
    uuid: ""
  };

  public role_item = ['Admin','Developer','Doctor','Paramedic','Patient'];

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
    const params = {
      name: this.editedItem.name,
      type: this.editedItem.api_type
    };
    const result = await http.put("/apikey/" + this.editedItem.uuid, params);
    console.log(result);
    if (result) {
      if (result.data.status === "Success") {
        appModule.sendSuccessNotice("修改成功");
      } else {
        appModule.sendErrorNotice("修改失敗");
      }
    }
    this.close();
    this.apiList();
  }

  public async apiList() {
    const result = await http.get("/apikey");
    if (result) {
      if (result.data.status === "Success") {
        this.api_list = result.data.data.clients;
        this.loading = false;
      } else {
        console.log("error");
      }
    } else {
      console.log("error");
    }
  }

  created() {
    this.apiList();
  }

  mounted() {}
}
</script>
