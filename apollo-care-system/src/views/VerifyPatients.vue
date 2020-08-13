<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card style="margin-bottom:10px">
        <v-data-table
          :headers="headers"
          :items="items"
          class="elevation-1"
          show-select
          :single-select="singleSelect"
          item-key="index"
          :loading="loading"
          loading-text="請稍候..."
          v-model="verifySelect.selected"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>審核病人列表({{totalVerifyPatients}})</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-col cols="12" md="2">
                <v-btn class="mb-3 blue" @click="showDialog('通過名單')">通過</v-btn>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn class="mb-3 red" @click="showDialog('不通過名單')">不通過</v-btn>
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
          <span class="headline">{{dialogTitle}}({{verifySelect.selected.length}})</span>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-list-item two-line v-for="item in verifySelect.selected" :key="item.name">
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
          <v-btn color="blue darken-1" text @click="close">取消</v-btn>
          <v-btn color="blue darken-1" text @click="save">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { verifyPatientModule } from "@/store/modules/verifyPatients";

@Component
export default class VerifyPatients extends Vue {
  public dialog = false;
  public snackbar = true;
  public singleSelect = false;
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

  public verifySelect = {
    selected : [],
    status : true
  };

  showDialog(title) {
    this.dialog = true;
    this.dialogTitle = title;
    if (title == "不通過名單") {
      this.verifySelect.status = false;
    }
  }

  saveVerifyPatients() {
    verifyPatientModule.verifyPatientsByUuid(this.verifySelect);
  }

  deleteCheckingPatients() {}

  close() {
    this.dialog = false;
    this.verifySelect.selected = [];
  }

  public async save() {
    this.dialog = false;
    this.saveVerifyPatients();
    this.created;
  }

  created() {
    verifyPatientModule.getVerifyPatients(this.verifyPatientOptions);
  }

  updateTableData() {
    verifyPatientModule.clearPatients();
    // this.verifyPatientOptions.page = this.pagination.page;
    // console.log(this.verifyPatientOptions.page);
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
