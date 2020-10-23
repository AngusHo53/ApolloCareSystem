<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card style="margin-bottom:10px">
        <v-card-title>
          <v-toolbar flat color="white">
            <v-toolbar-title>審核病人列表 {{ totalVerifyPatients ? '(' + totalVerifyPatients + ')' : '' }}</v-toolbar-title>
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
          <v-data-table
            :headers="headers"
            v-model="verifySelect.patients"
            :items="verifyItems"
            item-key="iid"
            class="elevation-1"
            :page.sync="verifyPatientOptions.page"
            :items-per-page="pagination.rowsPerPage"
            hide-default-footer
            :loading="loading"
            loading-text="Loading..."
            show-select
            :single-select="false"
          ></v-data-table>
          <div class="text-xs-center pt-2">
            <v-pagination
              v-model="verifyPatientOptions.page"
              :length="pagination.pages"
              :total-visible="9"
              @input="updateTableData()"
              circle
            ></v-pagination>
          </div>
        </v-card-text>
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
              <v-list-item-subtitle>身份證字號: {{item.iid}}</v-list-item-subtitle>
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
import { Patient, PatientInfo, Entity, VerifyPatientsOptions } from "@/types";
import Table from "@/components/Table.vue";
import { appModule } from "@/store/modules/app";
import {
  getDefaultPagination,
  getPagination,
  GENDER
} from "@/utils/store-util";
import http from "@/http/axios";

@Component({
  components: {
    Table
  }
})
export default class VerifyPatients extends Vue {
  public dialog = false;
  public dialogTitle = "";
  public loading = true;
  public totalVerifyPatients = 0;
  public pagination = getDefaultPagination();
  public totalPages = 0;
  public currentPage = 1;
  public verifyPatients: Patient[] = [];
  public verifyItems: PatientInfo[] = [];
  public headers = [
    {
      text: "名稱",
      left: true,
      sortable: false,
      value: "name"
    },
    { text: "身份證字號", sortable: false, value: "iid" },
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

  created() {
    this.updateTableData();
  }

  destroyed() {
    this.clearVerifyPatients();
  }

  showDialog(title) {
    this.dialog = true;
    this.dialogTitle = title;
    if (title == "不通過名單") {
      this.verifySelect.status = false;
    }
  }

  saveVerifyPatients() {
    this.verifyPatientsByUuid(this.verifySelect).then(() => {
      this.updateTableData();
      appModule.sendSuccessNotice("新增成功");
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
    await this.clearVerifyPatients();
    // this.verifyPatientOptions.page = this.pagination.page;
    // console.log(this.verifyPatientOptions.page);
    await this.getVerifyPatients(this.verifyPatientOptions);
  }

  async getVerifyPatients(options) {
    this.loading = true;
    const result = await http.get(
      `/user?verify=-1&page=${options.page}&limit=10`
    );
    if (result.data.data) {
      const data = result.data.data;
      this.totalVerifyPatients = data.total_users;
      this.totalPages = data.total_page;
      this.verifyPatients = data.users;
      this.currentPage = options.page;

      await this.extractVerifyPatientInfo(data.users);
      this.setDataTable(this.verifyItems);

      this.loading = false;
    } else {
      console.error(result);
    }
  }

  async clearVerifyPatients() {
    this.verifySelect.patients = [];
    this.verifyItems = [];
    this.totalPages = 0;
    this.totalVerifyPatients = 0;
    this.pagination = getDefaultPagination();
  }

  async extractVerifyPatientInfo(verifyPatients: Patient[]) {
    verifyPatients.forEach(element => {
      if (element.user) {
        // if (element.user.birthday) {
        //     const timestamp = Date.parse(element.user.birthday);
        //     if (isNaN(timestamp) === false) {
        //         const date = new Date(element.user.birthday).toLocaleString();
        //         element.user.birthday = date;
        //     }
        // }
        // element.user.phone = 'xxxx-xxx-xxx';
        element.user.gender = GENDER[element.user.gender];
        this.verifyItems.push(element.user);
      }
    });
  }

  async verifyPatientsByUuid(
    verifySelects: VerifyPatientsOptions
  ): Promise<TODO> {
    this.loading = true;
    const patients = verifySelects.patients;
    const params = {
      status: verifySelects.status
    };
    for (const patient of patients) {
      const result = await http.post(`/user/${patient.uuid}/verify`, params);
      if (result) {
        console.log(result);
      } else {
        console.error(result);
      }
    }
    this.loading = false;
  }

  setDataTable(data: Entity[]) {
    const pagination = getPagination(data, this.totalPages, this.currentPage);
    this.pagination = pagination;
  }
}
</script>
