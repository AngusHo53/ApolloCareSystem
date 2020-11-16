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
                <v-toolbar-title>API token列表</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn dark class="mb-2" v-bind="attrs" v-on="on">新增API token</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="api_token.name" label="API token name"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select v-model="api_token.api_type" :items="[0,1]" label="Type" required></v-select>
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
                <v-dialog v-model="dialog2" max-width="500px">
                  <v-card>
                    <v-card-title class="headline">{{api_token.name}} API key</v-card-title>

                    <v-card-text>{{api_token.api_key}}</v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        v-clipboard:copy="api_token.api_key"
                        v-clipboard:success="copyApi"
                        v-clipboard:error="onError"
                      >複製</v-btn>
                      <v-btn color="blue darken-1" text @click="dialog2 = false">關閉</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.api_key_icon="{item}">
              <v-awesome-icon class="mr-2" @click="apikey(item)" icon="key" size="lg" />
            </template>
            <template v-slot:item.actions="{ item }">
              <v-awesome-icon class="mr-2" @click="editItem(item)" icon="edit" size="lg" />
              <v-awesome-icon class="mr-2" @click="deleteItem(item)" icon="trash" size="lg" />
              <v-awesome-icon class="mr-2" @click="resetItem(item)" icon="sync-alt" size="lg" />
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
import { apiTokenModule } from "@/store/modules/apiToken";
import http from "../http/axios";

@Component
export default class ApiToken extends Vue {
  public dialog = false;
  public dialog2 = false;
  get loading() {
    return apiTokenModule.loading;
  }
  public headers = [
    {
      text: "API name",
      align: "start",
      value: "name"
    },
    { text: "API type", value: "api_type" },
    { text: "uuid", value: "uuid" },
    { text: "API key", value: "api_key_icon", sortable: false },
    { text: "Actions", value: "actions", sortable: false }
  ];
  get api_list() {
    return apiTokenModule.api_list;
  }

  get api_token() {
    return apiTokenModule.api_token;
  }

  set api_token(item) {
    apiTokenModule.setApiToken(item);
  }

  public editedIndex = -1;

  public defaultItem = {
    name: "",
    api_type: 0,
    uuid: "",
    api_key: ""
  };

  get formTitle() {
    return this.editedIndex === -1 ? "新增API token" : "修改API token";
  }

  editItem(item) {
    this.editedIndex = this.api_list.indexOf(item);
    console.log(this.editedIndex);
    this.api_token = Object.assign({}, item);
    this.dialog = true;
  }

  apikey(item) {
    this.api_token.name = item.name;
    this.api_token.api_key = item.api_key;
    console.log(this.api_token);
    this.dialog2 = true;
  }

  public copyApi() {
    appModule.sendSuccessNotice("複製成功");
    this.dialog2 = false;
  }

  public onError() {
    appModule.sendErrorNotice("複製失敗");
  }

  public async deleteItem(item) {
    this.api_token = Object.assign({}, item);
    console.log(this.api_token,item);
    if (confirm("確定要刪除嗎?") == true) {
     apiTokenModule.deleteApi();
    } else {
      appModule.sendErrorNotice("刪除失敗");
    }
  }

  public async resetItem(item) {
    this.api_token = Object.assign({}, item);
    if (confirm("確定要重置API key嗎?") == true) {
      apiTokenModule.resetToken();
    } else {
      appModule.sendErrorNotice("重置失敗");
    }
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      apiTokenModule.setApiToken(this.defaultItem);
      this.editedIndex = -1;
    });
  }

  public async save() {
    if (this.editedIndex == -1) {
      apiTokenModule.createApi();
    } else {
      apiTokenModule.modifyApi();
    }
    this.close();
  }

  created() {
    apiTokenModule.apiList();
  }

  destroyed() {
    apiTokenModule.clearApiToken();
  }
}
</script>
