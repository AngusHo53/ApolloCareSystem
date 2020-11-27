<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar-title
            >{{ account.name }}負責個案
            {{
              totalResponsiblePatients
                ? "(" + totalResponsiblePatients + ")"
                : ""
            }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-col cols="12" md="2">
            <v-btn class="mb-3 blue white--text" @click="addDialog()"
              >新增個案</v-btn
            >
          </v-col>
          <v-col cols="12" md="2">
            <v-btn class="mb-3 red white--text" @click="removeDialog()"
              >移除個案</v-btn
            >
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
            :items="responsiblePatients"
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
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                fab
                class="indigo mr-2"
                small
                dark
                @click="changeToPatient(item)"
              >
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
          <span class="headline">移除個案({{ modify_items.length }})</span>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-list-item two-line v-for="item in modify_items" :key="item.iid">
            <v-list-item-avatar class="grey lighten-1 white--text">
              <v-awesome-icon icon="user" size="lg" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>名稱: {{ item.name }}</v-list-item-title>
              <v-list-item-subtitle
                >身份證字號:{{ item.iid }}</v-list-item-subtitle
              >
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
          <span class="headline">新增個案({{ modify_items.length }})</span>
          <v-btn class="ml-auto pa-2 blue white--text" @click="addDialog2()"
            >批量匯入個案</v-btn
          >
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
            :items="needToAddPatients"
            :search="a_search"
            :loading="aLoading"
            loading-text="請稍後..."
            show-select
            :page.sync="a_patientOptions.page"
            :items-per-page="aPagination.rowsPerPage"
            :options="a_patientOptions"
            hide-default-footer
            :single-select="false"
          ></v-data-table>
          <div class="text-xs-center pt-2 pb-10">
            <v-pagination
              v-model="a_patientOptions.page"
              :length="aPagination.pages"
              :total-visible="9"
              @input="justNeedAdd()"
              circle
            ></v-pagination>
          </div>
          <v-spacer></v-spacer>
          <p class="text-h5 font-weight-black grey--text text--darken-4">
            新增個案身分證字號:
          </p>
          <div class="rounded grey lighten-2 pa-4">
            <span v-for="item in modify_items" :key="item.uuid"
              >{{ item.iid }},</span
            >
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
          <span class="headline">批量匯入個案({{ add_list.length }})</span>
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
import {
  getDefaultPagination,
  getDefaultPatientOptions,
} from "@/utils/store-util";
import { Component, Watch } from "vue-property-decorator";
import Vue from "vue";
import http from "@/http/axios";
import { appModule } from "@/store/modules/app";
import { paramedicModule } from "@/store/modules/paramedic";
import { paramedicPatientsModule } from "@/store/modules/paramedicPatients";

@Component
export default class ParamedicCharge extends Vue {
  public patientOptions = getDefaultPatientOptions();
  private lastSearch = "";
  private a_patientOptions = getDefaultPatientOptions();
  private a_lastSearch = "";
  public search = "";
  public a_search = "";
  public headers = [
    {
      text: "名稱",
      left: true,
      sortable: false,
      value: "name",
    },
    { text: "身份證字號", sortable: false, value: "iid" },
    { text: "性別", sortable: false, value: "gender" },
    { text: "年齡", sortable: false, value: "age" },
    { text: "生日", sortable: false, value: "birthday" },
    { text: "電話", sortable: false, value: "phone" },
    { text: "信箱", sortable: false, value: "email" },
  ];
  public modify_items = [];
  public add_list = "";

  public remove_dialog = false;
  public add_dialog = false;
  public add_dialog2 = false;
  public dialogTitle = "";
  public account = {
    name: "",
    uuid: "",
  };
  get loading() {
    return paramedicPatientsModule.loading;
  }

  get aLoading() {
    return paramedicPatientsModule.aLoading;
  }

  get responsiblePatients() {
    return paramedicPatientsModule.responsiblePatients;
  }

  get totalResponsiblePatients() {
    return paramedicPatientsModule.totalResponsiblePatients;
  }

  get pagination() {
    return paramedicPatientsModule.pagination;
  }

  set pagination(pagination) {
    paramedicPatientsModule.setPagination(pagination);
  }

  get needToAddPatients() {
    return paramedicPatientsModule.needToAddPatients;
  }

  get aPagination() {
    return paramedicPatientsModule.aPagination;
  }

  set aPagination(aPagination) {
    paramedicPatientsModule.setaPagination(aPagination);
  }

  async created() {
    this.account.name = localStorage.getItem("accountName");
    this.account.uuid = this.$router.currentRoute.params.id;

    this.updateTable();
  }

  async updateTable() {
    this.pagination = getDefaultPagination();
    await this.updateTableData();
    await this.justNeedAdd();
  }

  async justNeedAdd() {
    if (!this.aLoading) {
      if (this.a_patientOptions.q !== this.a_lastSearch) {
        this.a_patientOptions.page = 1;
        this.a_lastSearch = this.a_patientOptions.q;
      }
    }
    const param = {
      uuid: this.account.uuid,
      options: this.a_patientOptions,
    };
    await paramedicPatientsModule.needToAddPatientsList(param);
  }

  async updateTableData() {
    if (!this.loading) {
      if (this.patientOptions.q !== this.lastSearch) {
        this.patientOptions.page = 1;
        this.lastSearch = this.patientOptions.q;
      }
    }
    const param = {
      uuid: this.account.uuid,
      options: this.patientOptions,
    };
    await paramedicPatientsModule.responsiblePatientsList(param);
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
      remove: [],
    };
    if (this.dialogTitle === "新增個案") {
      const add_id = [];

      if (this.add_list.length > 0) {
        const add_list = this.add_list.split(",");
        add_list.forEach(function (item) {
          add_id.push(item);
        });
      }
      if (this.modify_items.length > 0) {
        for (const item of this.modify_items) {
          add_id.push(
            await paramedicPatientsModule.modifyPatientsId(item.uuid)
          );
          params.add = add_id;
        }
      }
    } else {
      const remove_id = [];
      if (this.modify_items.length > 0) {
        for (const item of this.modify_items) {
          remove_id.push(
            await paramedicPatientsModule.modifyResponsible(item.uuid)
          );
          params.remove = remove_id;
        }
      }
    }

    const data = {
      uuid: this.account.uuid,
      params: params,
    };

    await paramedicPatientsModule.addPatientsToAccount(data);
  }

  close() {
    this.remove_dialog = false;
    this.add_dialog = false;
    this.add_dialog2 = false;
    this.add_list = "";
    this.modify_items = [];
  }

  close2() {
    this.add_dialog2 = false;
    this.add_list = "";
    this.modify_items = [];
  }

  public async save() {
    await this.modifyPatient();
    this.close();
    this.close2();
    await this.updateTable();
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
