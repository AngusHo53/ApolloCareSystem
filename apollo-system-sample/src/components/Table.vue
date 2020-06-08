<template>
  <div>
     <v-card-text>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        @keyup="$emit('search', search)"
      ></v-text-field>
    </v-card-text>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="items"
      :page.sync="pagination.page"
      :items-per-page="pagination.rowsPerPage"
      @click:row="$emit('dataTableClickHandler',$event)"
      hide-default-footer
    >
      <template slot="no-data">
        <span>
          <p class="pt-2 blue--text subheading"><v-icon medium class="blue--text">mdi-info</v-icon>Sorry, nothing to display here :(</p>
        </span>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2" v-if="isNotEmpty">
      <v-pagination v-model="pagination.page" :length="pagination.pages"  :total-visible="5"  @input="searchDataTable($event)" circle></v-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Entity } from '@/types';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Table extends Vue {
  @Prop() readonly headers: TableHeader[];
  @Prop() readonly items: Entity[];
  @Prop() readonly pagination: Pagination;

  search ='';

  renderData = (item: TODO, header: TODO) => {
    let val = '';
    if (header.value.includes('.')) {
      const vals = header.value.split('.');
      val = vals.reduce((acc: TODO, val: TODO) => acc[val], item);
    } else {
      val = item[header.value];
    }
    if (typeof val === 'boolean') {
      val = val ? 'Yes' : 'No';
    }
    return val;
  };
  isNotEmpty() {
    return this.items && this.items.length > 0;
  }

  searchDataTable(event) {
    if(this.search === ''){
      console.log('updateTableData');
      this.$emit('updateTableData',event);
    }else {
      // console.log('searchPatients');
      // this.$emit('searchPatients', this.search);
    }
  }

  hasHeader(header: TODO) {
    return header?.value ? true : false;
  }
}
</script>
