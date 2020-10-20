<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar-title>看護名單 {{ totalPatients ? '(' + totalPatients + ')' : '' }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-text-field
            clearable
            flat
            solo-inverted
            hide-details
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
  </v-container>
</template>
<script lang="ts">
import SearchPanel from "@/components/SearchPanel.vue";
import { debounce } from "lodash";
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
import { Component, Watch } from "vue-property-decorator";
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
    SearchPanel
  }
})
export default class ParamedicList extends Vue {
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
    { text: "負責個案", value: "actions", sortable: false }
  ];

  public editDialog = false;
  public pagination = getDefaultPagination();
  public totalPages = 0;
  public currentPage = 1;
  public patients: Patient[] = [];
  public totalPatients = 0;
  public items: PatientInfo[] = [];
  public editItem: PatientInfo[] = [];
  private dateMenu = false;
  private date = new Date().toISOString().substr(0, 10);
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

  async destroyed() {
    await this.clearPatient();
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

  clearPatient() {
    this.patients = [];
    this.items = [];
    this.totalPages = 0;
    this.totalPatients = 0;
    this.pagination = getDefaultPagination();
  }

  changeToPatient(item) {
    this.$router.push({
      name: `負責個案`,
      params: {
        id: item.uuid,
        name: item.name
      }
    });
  }

  edit(item: PatientInfo[]) {
    this.editDialog = true;
    this.editItem = JSON.parse(JSON.stringify(item));
  }

  closeEdit() {
    this.editItem = [];
    this.editDialog = false;
  }

  remove() {
    appModule.setSnackbar;
    appModule.sendErrorNotice("刪除未做");
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

  @Watch("patientOptions.q")
  watchSearch(newVal, oldVal) {
    if (newVal != oldVal && newVal == "") {
      this.updateTableData();
    }
  }
}
</script>
