<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card style="margin-bottom:10px">
        <v-card-title>
          <v-toolbar flat color="white">
            <v-toolbar-title>
              <v-awesome-icon icon="user-check" size="lg" />
              審核病人列表 {{ totalVerifyPatients ? '(' + totalVerifyPatients + ')' : '' }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-col cols="12" md="2">
              <v-btn class="mb-3 blue white--text" @click="showDialog('通過名單')">通過</v-btn>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn class="mb-3 red white--text" @click="showDialog('不通過名單')">不通過</v-btn>
            </v-col>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <Table
            :headers="headers"
            :items="items"
            :pagination="pagination"
            :loading="loading"
            :showSelect="true"
            :select="verifySelect"
            :options="verifyPatientOptions"
            @updateTableData="updateTableData"
          ></Table>
        </v-card-text>
        <!-- <v-card-title>
          <v-toolbar flat color="white">
            <v-toolbar-title>未通過審核病人列表({{totalVerifyPatients}})</v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <Table
            :headers="headers"
            :items="items"
            :pagination="pagination"
            :loading="loading"
            :showSelect="true"
            :select="verifySelect"
            :options="verifyPatientOptions"
            @updateTableData="updateTableData"
          ></Table>
        </v-card-text>-->
      </v-card>
    </v-flex>
    <v-dialog v-if="verifySelect.patients" v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{dialogTitle}}({{verifySelect.patients.length}})</span>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-list-item two-line v-for="item in verifySelect.patients" :key="item.uuid">
            <v-list-item-avatar class="grey lighten-1 white--text">
              <v-awesome-icon icon="user" size="lg" />
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
import { VerifyPatientsOptions } from "@/types";
import Table from "@/components/Table.vue";

@Component({
  components: {
    Table
  }
})
export default class VerifyPatients extends Vue {
  public dialog = false;
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

  public verifySelect: VerifyPatientsOptions = {
    // eslint-disable-next-line no-undef
    patients: [],
    status: true
  };

  created() {}

  mounted() {
    this.updateTableData();
  }

  showDialog(title) {
    this.dialog = true;
    this.dialogTitle = title;
    if (title == "不通過名單") {
      this.verifySelect.status = false;
    }
  }

  saveVerifyPatients() {
    verifyPatientModule.verifyPatientsByUuid(this.verifySelect).then(() => {
      this.updateTableData();
    });
  }

  close() {
    this.dialog = false;
    // this.updateTableData();
  }

  public async save() {
    this.dialog = false;
    this.saveVerifyPatients();
  }

  async updateTableData() {
    await verifyPatientModule.clearVerifyPatients();
    // this.verifyPatientOptions.page = this.pagination.page;
    // console.log(this.verifyPatientOptions.page);
    await verifyPatientModule.getVerifyPatients(this.verifyPatientOptions);
  }

  get verifyPatients() {
    return verifyPatientModule.verifyPatients;
  }

  get pagination() {
    return verifyPatientModule.pagination;
  }

  get items() {
    return verifyPatientModule.verifyItems;
  }

  get totalVerifyPatients() {
    return verifyPatientModule.totalVerifyPatients;
  }

  get loading() {
    return verifyPatientModule.loading;
  }
}
</script>
