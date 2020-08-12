<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <span class="title"
            >病人名單 {{ totalPatients ? '(' + totalPatients + ')' : '' }}
          </span>
          <v-spacer></v-spacer>
            <div>
              <v-btn class="blue darken-2  mr-2" fab small dark @click.native="createPatient()">
              <v-icon>mdi-account-plus</v-icon>
              </v-btn>
              <v-btn class="teal darken-2  mr-2" fab small dark @click.native="test()">
              <v-icon>mdi-printer</v-icon>
              </v-btn>
            </div>
        </v-card-title>
        <v-card-text>
        <Table :headers="headers" :items="items" :pagination="pagination" :loading="loading"
        :options="patientOptions" @updateTableData = "updateTableData" @dataTableClickHandler="changeToPatientRecordPage"></Table>
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
    <v-snackbar v-if="loading === false" :right="true" :timeout="2000" :color="mode" v-model="snackbar">
      {{ notice }}
      <v-btn dark text @click.native="closeSnackbar">Close</v-btn>
    </v-snackbar>
    </v-container>
</template>
<script lang="ts">
import Table from '@/components/Table.vue';
import TableHeaderButtons from '@/components/TableHeaderButtons.vue'
import SearchPanel from '@/components/SearchPanel.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { debounce } from 'lodash';
import { buildSearchFilters, buildJsonServerQuery, clearSearchFilters } from '@/utils/app-util';
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { patientModule } from '@/store/modules/patients';
import { appModule } from '@/store/modules/app';
import { getDefaultPagination } from '@/utils/store-util';

@Component({
  components: {
    Table,
    TableHeaderButtons,
    SearchPanel,
    ConfirmDialog
  }
})
export default class PatientList extends Vue {
  public dialog = false;
  public dialogTitle = 'Patient Delete Dialog';
  public dialogText = 'Do you want to delete this patient?';
  private showSearchPanel = false;
  public right = true;
  public headers = [
    {
      text: '名稱',
      left: true,
      sortable: false,
      value: 'name'
    },
    { text: 'ID',sortable: false, value: 'iid' },
    { text: '性別',sortable: false, value: 'gender' },
    { text: '年齡',sortable: false, value: 'age' },
    { text: '生日',sortable: false, value: 'birthday' },
    { text: '電話',sortable: false, value: 'phone'},
    { text: '信箱',sortable: false, value: 'email' },
    { text: '其他操作', value: 'actions', sortable: false }
  ];
  private searchFilter = {
    contains: {
      firstName: '',
      lastName: ''
    },
    between: {
      rewards: { former: 0, latter: 0 }
    }
  };
  private customerId = '';
  private query = '';
  private color = '';
  private quickSearchFilter = '';
  private itemId = -1;
  private patientOptions = {
      page: 1,
      q: '',
      order: 'asc',
      sort: ''
  }
  private lastSearch = '';
  created() {
    patientModule.setPagination(getDefaultPagination());
    this.updateTableData();
  }

  test() {
      console.log('test');
  }

  createPatient() {
    this.$router.push('newPatient');
  }

  changeToPatientRecordPage($event){
    console.log($event);
    this.$router.push({name:`病人紀錄`, params:{
      id: $event.uuid
    }});
  }

  updateTableData() {
    patientModule.clearPatients();
    if(this.patientOptions.q !== this.lastSearch) {
      this.patientOptions.page = 1;
      this.lastSearch = this.patientOptions.q;
    } else {
      this.patientOptions.page = this.pagination.page;
    }
    console.log(this.patientOptions);
    patientModule.getPatientsByPages(this.patientOptions);
  }

  onConfirm() {
    // patientModule.deleteCustomer(this.itemId);
    this.dialog = false;
  }
  onCancel() {
    this.customerId = '';
    this.dialog = false;
  }

  searchCustomers() {
    buildSearchFilters(this.searchFilter);
    this.query = buildJsonServerQuery(this.searchFilter);
    this.quickSearch = '';
    // patientModule.searchCustomers(this.query);
    this.showSearchPanel = false;
  }

  clearSearchFilters() {
    this.showSearchPanel = !this.showSearchPanel;
    clearSearchFilters(this.searchFilter);
    // patientModule.getAllCustomers();
  }

  reloadData() {
    this.query = '';
    //patientModule.getAllCustomers();
  }

  updateSearchPanel(){
    this.rightDrawer=!this.rightDrawer;
  }

  cancelSearch() {
    this.showSearchPanel = false;
  }

  closeSnackbar() {
    appModule.closeNotice();
  }

  quickSearchCustomers = debounce(function() {
    // patientModule.quickSearch(this.headers, this.quickSearchFilter);
  }, 500);

  get patients() {
    return patientModule.patients;
  }
  get pagination() {
    return patientModule.pagination;
  }

  get items() {
    return patientModule.items;
  }

  get totalPatients() {
    return patientModule.totalPatients;
  }

  get loading() {
    return patientModule.loading;
  }
  get mode() {
    return appModule.mode;
  }

  get snackbar() {
    return appModule.snackbar;
  }

  get notice() {
    return appModule.notice;
  }

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

  mounted() {
  }
}
</script>