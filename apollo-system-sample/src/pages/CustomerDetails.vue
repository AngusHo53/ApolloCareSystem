<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <span class="title"
            >用戶量測歷史 {{ pagination ? '(' + pagination.totalItems + ')' : '' }}
          </span>
          <v-spacer></v-spacer>
          <table-header-buttons :add="add" :reloadData="reloadData" :updateSearchPanel="updateSearchPanel"></table-header-buttons>
        </v-card-title>
        <Table v-if="loading === false"  :headers="headers" :items="items" :pagination="pagination"></Table>
      </v-card>
    </v-flex>
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
import {  Entity } from '../types';
import { customerModule } from '@/store/modules/customers';
import { appModule } from '@/store/modules/app';
import axios from "axios";
import { getToken } from "../utils/app-util";

@Component({
  components: {
    Table,
    TableHeaderButtons,
    SearchPanel,
    ConfirmDialog
  }
})

export default class CustomerDetails extends Vue {
  public dialog = false;
  public dialogTitle = 'Customer Delete Dialog';
  public dialogText = 'Do you want to delete this customer?';
  private showSearchPanel = false;
  public right = true;
  public search = '';
  public headers = [
    {
      text: '名稱',
      left: true,
      value: 'name'
    },
    { text: 'ID', value: 'id_card' },
    { text: '年齡', value: 'age' },
    { text: '測量', value: 'created_at' },
     { text: '', value: 'actions', sortable: false }
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



  edit(item: Entity) {
    this.$router.push(`customer/${item.id}`);
  }

  remove(item: Entity) {
    this.itemId = item.id;
    this.dialog = true;
  }

  add() {
    this.$router.push('NewCustomer');
  }

  onConfirm() {
    customerModule.deleteCustomer(this.itemId);
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
    customerModule.searchCustomers(this.query);
    this.showSearchPanel = false;
  }

  clearSearchFilters() {
    this.showSearchPanel = !this.showSearchPanel;
    clearSearchFilters(this.searchFilter);
    customerModule.getAllCustomers();
  }

  reloadData() {
    this.query = '';
    customerModule.getAllCustomers();
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
    customerModule.quickSearch(this.headers, this.quickSearchFilter);
  }, 500);

  get items() {
    return customerModule.items;
  }
  get pagination() {
    return customerModule.pagination;
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

  created() {
    customerModule.getAllCustomers();

  }

  mounted() {
  }
}
</script>