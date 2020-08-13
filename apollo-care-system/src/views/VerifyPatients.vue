<template>
  <v-container fluid>
    <v-flex v-if="items && items.length > 0" xs12>
      <v-card style="margin-bottom:10px">
        <v-data-table
          :headers="headers"
          :items="items"
          class="elevation-1"
          show-select
          :single-select="singleSelect"
          item-key="iid"
          :loading="loading"
          loading-text="請稍等..."
          v-model="selected"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>審核病人列表({{totalVerifyPatients}})</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-col cols="12" md="2">
                <v-btn class="mb-3 blue" v-bind="attrs" v-on="on" @click="showDialog('通過名單')">通過</v-btn>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn class="mb-3 red" v-bind="attrs" v-on="on" @click="showDialog('不通過名單')">不通過</v-btn>
              </v-col>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-card>
      <div class="text-xs-center pt-2" v-if="true">
        <v-pagination
          v-model="verifyPatientOptions.page"
          :length="pagination.pages"
          :total-visible="9"
          @input="updateTableData()"
          circle
        ></v-pagination>
      </div>
      <!-- <v-card>
        <v-data-table
          :headers="headers"
          :items="checkPatients"
          class="elevation-1"
          show-select
          :single-select="singleSelect"
          item-key="name"
          :loading="!checkPatients"
          loading-text="請稍等..."
          v-model="selected"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>已取消病人列表({{checkPatients.length}})</v-toolbar-title>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-card>-->
    </v-flex>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{dialogTitle}}({{selected.length}})</span>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-list-item two-line v-for="item in selected" :key="item.name">
            <v-list-item-avatar class="grey lighten-1 white--text">
              <v-icon>mdi-account</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>名稱: {{item.name}}</v-list-item-title>
              <v-list-item-subtitle>ID: {{item.iid}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">取消</v-btn>
          <v-btn color="primary" text @click="dialog = false;saveVerifyPatients(selected);">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import http from "@/http/axios";
import { verifyPatientModule } from "@/store/modules/verifyPatients";
import { appModule } from "@/store/modules/app";

@Component
export default class VerifyPatients extends Vue {
  public dialog = false;
  public snackbar = true;
  public singleSelect = false;
  public selected = [];
  public dialogTitle = "";
  public headers = [
    {
      text: "名稱",
      left: true,
      sortable: false,
      value: "name"
    },
    { text: "ID", sortable: false, value: "iid" },
    { text: "性別", sortable: false, value: "gender" },
    { text: "年齡", sortable: false, value: "age" },
    { text: "生日", sortable: false, value: "birthday" },
    { text: "電話", sortable: false, value: "phone" },
    { text: "信箱", sortable: false, value: "email" }
  ];

  public editedIndex = -1;
  public editedItem = {
    name: "",
    api_type: 0,
    uuid: ""
  };

  public defaultItem = {
    name: "",
    api_type: 0,
    uuid: ""
  };

  private verifyPatientOptions = {
    page: 1,
    q: "",
    order: "asc",
    sort: ""
  };

  get formTitle() {
    return this.editedIndex === -1 ? "Create API token" : "Edit API token";
  }

  editItem(item) {}

  showDialog(title) {
    this.dialog = true;
    this.dialogTitle = title;
  }

  saveVerifyPatients() {
    // console.log(this.selected);
    verifyPatientModule.verifyPatientsByUuid(this.selected);
  }

  deleteCheckingPatients() {}

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  public async save() {
    this.close();
    this.apiList();
  }

  public async apiList() {
    console.log("TODO");
  }

  created() {
    this.apiList();
    verifyPatientModule.getVerifyPatients(this.verifyPatientOptions);
  }

  updateTableData() {
    verifyPatientModule.clearPatients();
    // this.verifyPatientOptions.page = this.pagination.page;
    console.log(this.verifyPatientOptions.page);
    verifyPatientModule.getVerifyPatients(this.verifyPatientOptions);
  }

  mounted() {}

  get verifyPatients() {
    return verifyPatientModule.verifyPatients;
  }

  get pagination() {
    return verifyPatientModule.pagination;
  }

  get items() {
    return verifyPatientModule.items;
  }

  get totalVerifyPatients() {
    return verifyPatientModule.totalVerifyPatients;
  }

  get loading() {
    return verifyPatientModule.loading;
  }
}
</script>
