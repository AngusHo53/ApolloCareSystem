<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar-title>病人名單 {{ totalPatients ? '(' + totalPatients + ')' : '' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <div>
            <v-btn class="blue darken-2 mr-2" fab small dark @click.native="createPatient()">
              <v-awesome-icon icon="user-plus" size="lg" />
            </v-btn>
          </div>
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
              <v-btn fab class="indigo mr-2" small dark @click="changeToPatientRecordPage(item)">
                <v-awesome-icon icon="user" size="lg" />
              </v-btn>
              <v-btn fab class="teal mr-2" small dark @click="edit(item)">
                <v-awesome-icon icon="edit" size="lg" />
              </v-btn>
              <v-btn fab class="cyan" small @click="remove(item)">
                <v-awesome-icon icon="trash" size="lg" />
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
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">個案資料修改</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="姓名" v-model="editItem.name"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="ID" disabled v-model="editItem.iid"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="4">
                  <v-select :items="['男', '女']" label="性別" v-model="editItem.gender"></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field label="年齡" v-model="editItem.age"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="4">
                  <v-menu
                    ref="menu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editItem.birthday"
                        label="生日"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="editItem.birthday" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dateMenu = false">取消</v-btn>
                      <v-btn text color="primary" @click="$refs.menu.save(editItem.birthday)">確認</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="電話" v-model="editItem.phone"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="信箱" v-model="editItem.email"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeEdit()">取消</v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">儲存</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
export default class PatientList extends Vue {
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

  changeToPatientRecordPage(item) {
    this.$router.push({
      name: `病人紀錄`,
      params: {
        id: item.uuid
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
