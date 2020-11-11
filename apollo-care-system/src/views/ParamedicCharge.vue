<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar-title>{{paramedic_name}}負責個案 {{ totalPatient ? '(' + totalPatient + ')' : '' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="12" md="2">
            <v-btn class="mb-3 blue white--text" @click="addDialog()">新增個案</v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn class="mb-3 red white--text" @click="removeDialog()">移除個案</v-btn>
          </v-col>
        </v-card-title>
        <v-card-text>
          <v-text-field
            flat
            solo-inverted
            hide-details
            v-model="patientOptions.q"
            append-icon="mdi-magnify"
            label="關鍵字搜尋"
            @keyup.enter="updateTableData()"
          ></v-text-field>
          <v-data-table
            v-model="modify_items"
            item-key="iid"
            :headers="headers"
            :items="patient_items"
            :loading="loading"
            loading-text="請稍後..."
            :search="search"
            show-select
            :page.sync="patientOptions.page"
            :items-per-page="pagination.rowsPerPage"
            :options="patientOptions"
            hide-default-footer
            :single-select="false"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn fab class="indigo mr-2" small dark @click="changeToPatient(item)">
                <v-awesome-icon icon="user" size="lg" />
              </v-btn>
            </template>
          </v-data-table>
          <div class="text-xs-center pt-2">
            <v-pagination
              v-model="patientOptions.page"
              :length="pagination.pages"
              :total-visible="9"
              @input="updateTableData()"
              circle
            ></v-pagination>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-if="modify_items" v-model="remove_dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">移除個案({{modify_items.length}})</span>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-list-item two-line v-for="item in modify_items" :key="item.iid">
            <v-list-item-avatar class="grey lighten-1 white--text">
              <v-awesome-icon icon="user" size="lg" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>名稱: {{item.name}}</v-list-item-title>
              <v-list-item-subtitle>身份證字號:</v-list-item-subtitle>
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
    <v-dialog v-if="modify_items" v-model="add_dialog" max-width="80%">
      <v-card>
        <v-card-title>
          <span class="headline">新增個案({{modify_items.length}})</span>
          <v-btn class="ml-auto pa-2 blue white--text" @click="addDialog2()">批量匯入個案</v-btn>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-spacer></v-spacer>
          <v-card-title>
            <v-text-field
              flat
              solo-inverted
              hide-details
              v-model="a_patientOptions.q"
              append-icon="mdi-magnify"
              label="關鍵字搜尋"
              @keyup.enter="justNeedAdd()"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-model="modify_items"
            item-key="iid"
            :headers="headers"
            :items="patient_not_items"
            :search="a_search"
            :loading="a_loading"
            loading-text="請稍後..."
            show-select
            :page.sync="a_patientOptions.page"
            :items-per-page="a_pagination.rowsPerPage"
            :options="a_patientOptions"
            hide-default-footer
            :single-select="false"
          ></v-data-table>
          <div class="text-xs-center pt-2 pb-10">
            <v-pagination
              v-model="a_patientOptions.page"
              :length="a_pagination.pages"
              :total-visible="9"
              @input="justNeedAdd()"
              circle
            ></v-pagination>
          </div>
          <v-spacer></v-spacer>
          <p class="text-h5 font-weight-black grey--text text--darken-4">新增個案身分證字號:</p>
          <div class="rounded grey lighten-2 pa-4">
            <span v-for="(item) in modify_items" :key="item.uuid">{{item.iid}},</span>
          </div>
          <p>請確認個案身分證字號是否正確，確認後再送出。</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">取消</v-btn>
          <v-btn color="blue darken-1" text @click="save">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="add_dialog2" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">批量匯入個案({{add_list.length}})</span>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-textarea
            v-model="add_list"
            name="input-7-1"
            filled
            label="新增個案身份證字號(請用,隔開)"
            auto-grow
            value
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close2">取消</v-btn>
          <v-btn color="blue darken-1" text @click="save">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import { PatientInfo } from "@/types";
import {
  GENDER,
  getDefaultPagination,
  getPagination
} from "@/utils/store-util";
import { Component, Watch } from "vue-property-decorator";
import Vue from "vue";
import http from "@/http/axios";
import { appModule } from "@/store/modules/app";

@Component
export default class ParamedicCharge extends Vue {
  public pagination = getDefaultPagination();
  public totalPages = 0;
  public currentPage = 1;
  private patientOptions = {
    page: 1,
    q: "",
    order: "asc",
    sort: ""
  };
  private lastSearch = "";
  public totalPatient = 0;

  public a_pagination = getDefaultPagination();
  public a_totalPages = 0;
  public a_currentPage = 1;
  private a_patientOptions = {
    page: 1,
    q: "",
    order: "asc",
    sort: ""
  };
  private a_lastSearch = "";

  public loading = false;
  public a_loading = false;
  public search = "";
  public a_search = "";
  public paramedic_name = "";
  public paramedic_id = "";
  public headers = [
    {
      text: "名稱",
      left: true,
      sortable: false,
      value: "name"
    },
    { text: "身份證字號", sortable: false },
    { text: "性別", sortable: false, value: "gender" },
    { text: "年齡", sortable: false, value: "age" },
    { text: "生日", sortable: false, value: "birthday" },
    { text: "電話", sortable: false, value: "phone" },
    { text: "信箱", sortable: false, value: "email" }
  ];
  public patient: PatientInfo[] = [];
  public patient_items: PatientInfo[] = [];
  public patient_not: PatientInfo[] = [];
  public patient_not_items: PatientInfo[] = [];
  public modify_items = [];
  public add_list = "";

  public remove_dialog = false;
  public add_dialog = false;
  public add_dialog2 = false;
  public dialogTitle = "";

  async created() {
    this.setPagination(getDefaultPagination());
    this.paramedic_name = this.$route.params.name;
    this.paramedic_id = this.$route.params.id;

    await this.updateTableData();
    await this.justNeedAdd();
  }

  setPagination(pagination) {
    this.pagination = pagination;
  }

  setaPagination(pagination) {
    this.a_pagination = pagination;
  }

  async destroyed() {
    await this.clearPatient();
  }

  async justNeedAdd() {
    this.a_loading = true;
    this.clearaPatient();
    if (!this.a_loading) {
      if (this.a_patientOptions.q !== this.a_lastSearch) {
        this.a_patientOptions.page = 1;
        this.a_lastSearch = this.a_patientOptions.q;
      }
    }
    const result = await http.get(
      `/user/${this.paramedic_id}/patients?mode=not&q=${this.a_patientOptions.q}&page=${this.a_patientOptions.page}&limit=10`
    );
    if (result) {
      if (result.data.status === "Success") {
        const a_data = Object.assign({}, result.data.data);
        this.a_totalPages = a_data.total_page;
        this.patient_not = a_data.patients;
        this.a_currentPage = this.a_patientOptions.page;
        this.patient_not.forEach(element => {
          if (element) {
            const len = element.name.length;
            switch (len) {
              case 2:
                element.name = element.name.substring(0, 1) + "◯";
                break;
              case 3:
                element.name = element.name.substring(0, 1) + "◯" + element.name.substring(2, 3);
                break;
              case 4:
                element.name = element.name.substring(0, 1) + "◯◯" + element.name.substring(3, 4);
                break;
              default:
                element.name = element.name.substr(0, 3) + "◯".repeat(len-6) + element.name.substr(len-3, 3);
                break;
            }
            element.gender = GENDER[element.gender];
            this.patient_not_items.push(element);
          }
          const a_pagination = getPagination(
            this.patient_not_items,
            this.a_totalPages,
            this.a_currentPage
          );
          this.setaPagination(a_pagination);
          this.a_loading = false;
        });
      } else {
        console.error(result);
      }
    } else {
      console.error(result);
    }
  }

  async updateTableData() {
    this.loading = true;
    this.clearPatient();
    if (!this.loading) {
      if (this.patientOptions.q !== this.lastSearch) {
        this.patientOptions.page = 1;
        this.lastSearch = this.patientOptions.q;
      }
    }
    const result = await http.get(
      `/user/${this.paramedic_id}/patients?q=${this.patientOptions.q}&page=${this.patientOptions.page}&limit=10`
    );
    if (result) {
      if (result.data.status === "Success") {
        const data = Object.assign({}, result.data.data);
        this.patient = data.patients;
        this.totalPatient = data.total_patients;
        this.totalPages = data.total_page;
        this.currentPage = this.patientOptions.page;
        this.patient.forEach(element => {
          if (element) {
            const len = element.name.length;
            switch (len) {
              case 2:
                element.name = element.name.substring(0, 1) + "◯";
                break;
              case 3:
                element.name = element.name.substring(0, 1) + "◯" + element.name.substring(2, 3);
                break;
              case 4:
                element.name = element.name.substring(0, 1) + "◯◯" + element.name.substring(3, 4);
                break;
              default:
                element.name = element.name.substr(0, 3) + "◯".repeat(len-6) + element.name.substr(len-3, 3);
                break;
            }
            element.gender = GENDER[element.gender];
            this.patient_items.push(element);
          }
        });
        const pagination = getPagination(
          this.patient_items,
          this.totalPages,
          this.currentPage
        );
        this.setPagination(pagination);
        this.loading = false;
      } else {
        console.log("error");
      }
    } else {
      console.log("error");
    }
  }

  clearPatient() {
    this.totalPatient = 0;
    this.patient = [];
    this.patient_items = [];
    this.modify_items = [];
    this.totalPages = 0;
    this.pagination = getDefaultPagination();
  }

  clearaPatient() {
    this.patient_not = [];
    this.patient_not_items = [];
    this.a_pagination = getDefaultPagination();
    this.a_totalPages = 0;
  }

  removeDialog() {
    this.remove_dialog = true;
    this.dialogTitle = "移除個案";
  }

  addDialog() {
    this.modify_items = [];
    this.add_list = "";
    this.add_dialog = true;
    this.dialogTitle = "新增個案";
  }

  addDialog2() {
    this.modify_items = [];
    this.add_list = "";
    this.add_dialog2 = true;
    this.dialogTitle = "新增個案";
  }

  showDialog(title) {
    this.remove_dialog = true;
    this.dialogTitle = title;
  }

  async modifyPatient() {
    const params = {
      add: [],
      remove: []
    };
    if (this.dialogTitle === "新增個案") {
      const add_id = [];

      const add_list = this.add_list.split(",");

      add_list.forEach(function(item) {
        add_id.push(item);
      });
      this.modify_items.forEach(function(item) {
        add_id.push(item.iid);
      });
      params.add = add_id;
    } else {
      const remove_id = [];
      this.modify_items.forEach(function(item) {
        remove_id.push(item.iid);
      });
      params.remove = remove_id;
    }

    const result = await http.post(
      "/user/" + this.paramedic_id + "/patients",
      params
    );
    if (result) {
      if (result.data.status === "Success") {
        location.reload();
        appModule.sendSuccessNotice("變更成功");
      } else {
        appModule.sendErrorNotice("變更失敗");
      }
    } else {
      appModule.sendErrorNotice("變更失敗");
    }
  }

  close() {
    this.remove_dialog = false;
    this.add_dialog = false;
    this.add_dialog2 = false;
    this.add_list = "";
    this.modify_items = [];
    // this.updateTableData();
  }

  close2() {
    this.add_dialog2 = false;
    this.add_list = "";
    this.modify_items = [];
  }

  public async save() {
    this.remove_dialog = false;
    this.add_dialog = false;
    this.add_dialog2 = false;
    this.modifyPatient();
  }

  @Watch("patientOptions.q")
  watchSearch(newVal, oldVal) {
    if (newVal != oldVal && newVal == "") {
      this.updateTableData();
    }
  }

  @Watch("a_patientOptions.q")
  watchASearch(newVal, oldVal) {
    if (newVal != oldVal && newVal == "") {
      this.justNeedAdd();
    }
  }
}
</script>
