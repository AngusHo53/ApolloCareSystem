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
              <v-btn class="teal darken-2  mr-2" fab small dark @click.native="test()">
              <v-icon>mdi-printer</v-icon>
              </v-btn>
            </div>
        </v-card-title>
        <Table v-if="loading === false" :headers="headers" :items="items" :pagination="pagination" @updateTableData="updateTableData"
        @search="searchPatients" @dataTableClickHandler="changeToPatientRecordPage"></Table>
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
    <v-overlay  :value="loading"></v-overlay>
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
      value: 'name'
    },
    { text: 'ID Card', value: 'id_card' },
    { text: '性別', value: 'gender' },
    { text: '年齡', value: 'age' },
    { text: '上一次測量', value: 'updated_at' }
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
  private nowPage = 1;
  created() {
    patientModule.getPatientsByPages(this.nowPage);
  }

  add() {
    this.$router.push('NewPatient');
  }

  test() {
      console.log('test');
  }

  changeToPatientRecordPage($event){
    this.$router.push({name:`病人紀錄`, params:{
      id: $event.id,
      patient: $event
    }});
  }

  searchPatients(keyword: string) {
      // To Do
      console.log(keyword);
      patientModule.clearPatients();
      keyword !== ''? patientModule.getPatientsByKeyword(keyword): this.updateTableData(this.nowPage);
  }

  updateTableData(page: number) {
      this.nowPage = page;
      patientModule.getPatientsByPages(page);
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
    return appModule.loading;
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
