<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <span class="title">病人名單 {{ totalPatients ? '(' + totalPatients + ')' : '' }}</span>
          <v-spacer></v-spacer>
          <div>
            <v-btn class="blue darken-2 mr-2" fab small dark @click.native="createPatient()">
              <v-awesome-icon icon="user-plus" size="lg" />
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="patientOptions.q"
            append-icon="mdi-magnify"
            label="關鍵字搜尋"
            @keyup.enter="updateTableData()"
          ></v-text-field>
          <v-data-table
            item-key="patients.iid"
            :headers="headers"
            :items="items"
            :page.sync="patientOptions.page"
            :items-per-page="pagination.rowsPerPage"
            :options="patientOptions"
            hide-default-footer
            :loading="loading"
            loading-text="Loading..."
          >
            <template v-slot:item.actions="{ item }">
              <v-btn fab class="indigo mr-2" small dark @click="changeToPatientRecordPage(item)">
                <v-awesome-icon icon="user" size="lg" />
              </v-btn>
              <v-btn fab class="teal mr-2" small dark @click="edit()">
                <v-awesome-icon icon="edit" size="lg" />
              </v-btn>
              <v-btn fab class="cyan" small @click="remove()">
                <v-awesome-icon icon="trash" size="lg" />
              </v-btn>
            </template>
          </v-data-table>
          <div class="text-xs-center pt-2">
            <v-pagination
              v-model="patientOptions.page"
              :length="pagination.pages"
              :total-visible="9"
              @input="updateTableData"
              circle
            ></v-pagination>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
    <confirm-dialog
      :dialog="dialog"
      :dialogTitle="dialogTitle"
      :dialogText="dialogText"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
    ></confirm-dialog>
  </v-container>
</template>
<script lang="ts">
import SearchPanel from "@/components/SearchPanel.vue";
import { debounce } from "lodash";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import {
  buildSearchFilters,
  buildJsonServerQuery,
  clearSearchFilters
} from "@/utils/app-util";
import {
  Patient,
  Order,
  Entity,
  PatientInfo,
  PatientOptions,
  MeasureData,
  PatientFormData
} from "@/types";
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { patientModule } from "@/store/modules/patients";
import { appModule } from "@/store/modules/app";
import {
  getDefaultPagination,
  getPagination,
  GENDER
} from "@/utils/store-util";
import http from "@/http/axios";

@Component({
  components: {
    SearchPanel,
    ConfirmDialog
  }
})
export default class PatientList extends Vue {
  public dialog = false;
  public dialogTitle = "Patient Delete Dialog";
  public dialogText = "Do you want to delete this patient?";
  private showSearchPanel = false;
  public right = true;
  public loading = true;
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
    { text: "信箱", sortable: false, value: "email" },
    { text: "其他操作", value: "actions", sortable: false }
  ];

  public pagination = getDefaultPagination();
  public totalPages = 0;
  public currentPage = 1;
  public patientRecords = undefined;
  public patients: Patient[] = [];
  public totalPatients = 0;
  public items: PatientInfo[] = [];

  private searchFilter = {
    contains: {
      firstName: "",
      lastName: ""
    },
    between: {
      rewards: { former: 0, latter: 0 }
    }
  };
  private query = "";
  private color = "";
  private quickSearchFilter = "";
  private itemId = -1;
  private patientOptions = {
    page: 1,
    q: "",
    order: "asc",
    sort: ""
  };
  private lastSearch = "";

  async created() {
    this.setPagination(getDefaultPagination());
    await this.updateTableData();
  }

  async updateTableData() {
    if (!this.loading) {
      if (this.patientOptions.q !== this.lastSearch) {
        this.patientOptions.page = 1;
        this.lastSearch = this.patientOptions.q;
      }
    }
    this.loading = true;
    const result = await http.get(
      `/user?q=${this.patientOptions.q}&page=${this.patientOptions.page}&limit=10`
    );
    if (result) {
      const data = result.data.data;
      this.totalPatients = data.total_users;
      this.totalPages = data.total_page;
      this.patients = data.users;
      this.currentPage = this.patientOptions.page;
      // Extract Table Data
      await this.extractPatientInfo(data.users);
      const pagination = getPagination(
        this.items,
        this.totalPages,
        this.currentPage
      );
      this.setPagination(pagination);
      this.loading = false;
    } else {
      console.error(result);
    }
  }

  async extractPatientInfo(patients: Patient[]) {
    patients.forEach(element => {
      if (element.user) {
        element.user.gender = GENDER[element.user.gender];
        this.items.push(element.user);
      }
    });
  }

  setPagination(pagination) {
    this.pagination = pagination;
  }

  createPatient() {
    this.$router.push("newPatient");
  }

  changeToPatientRecordPage(item) {
    this.$router.push({
      name: `病人紀錄`,
      params: {
        id: item.uuid
      }
    });
  }

  edit() {
    appModule.setSnackbar;
    appModule.sendErrorNotice("編輯未做");
  }

  remove() {
    appModule.setSnackbar;
    appModule.sendErrorNotice("刪除未做");
  }
  onConfirm() {
    // patientModule.deleteCustomer(this.itemId);
    this.dialog = false;
  }
  onCancel() {
    this.dialog = false;
  }

  searchCustomers() {
    buildSearchFilters(this.searchFilter);
    this.query = buildJsonServerQuery(this.searchFilter);
    this.quickSearch = "";
    // patientModule.searchCustomers(this.query);
    this.showSearchPanel = false;
  }

  clearSearchFilters() {
    this.showSearchPanel = !this.showSearchPanel;
    clearSearchFilters(this.searchFilter);
    // patientModule.getAllCustomers();
  }

  reloadData() {
    this.query = "";
    //patientModule.getAllCustomers();
  }

  updateSearchPanel() {
    this.rightDrawer = !this.rightDrawer;
  }

  cancelSearch() {
    this.showSearchPanel = false;
  }

  quickSearchCustomers = debounce(function() {
    // patientModule.quickSearch(this.headers, this.quickSearchFilter);
  }, 500);

  get rightDrawer() {
    return this.showSearchPanel;
  }

  set rightDrawer(_showSearchPanel: boolean) {
    this.showSearchPanel = _showSearchPanel;
  }

  get quickSearch() {
    return this.quickSearchFilter;
  }
  set quickSearch(val) {
    this.quickSearchFilter = val;
    this.quickSearchFilter && this.quickSearchCustomers();
  }
}
</script>
