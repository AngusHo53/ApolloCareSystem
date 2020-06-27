<template>
  <div>
     <v-card-text>
       <v-row>
        <v-col
          cols="12"
          md="4"
        >
        <v-text-field
          v-model="options.q"
          append-icon="mdi-magnify"
          label='關鍵字搜尋'
          @keyup.enter="$emit('updateTableData')"
        ></v-text-field>
        </v-col>
        <v-col
            cols="12"
            md="4"
          >
          <v-select
            v-model="sort"
            :items="['姓名','性別', 'ID', 'ID卡', '測量']"
            label="排序"
            @change="fomateSort()"
            @keyup.enter="$emit('updateTableData')"
            required
          ></v-select>
        </v-col>
        <v-col
            cols="1"
            md="1">
          <v-switch v-model="order" flat :label="order?`升序`:`降序`" @change='fomateOrder(order)'></v-switch>
        </v-col>
      </v-row>
    </v-card-text>
    
    <!--  @click:row="$emit('dataTableClickHandler',$event)"  -->
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="items"
      :page.sync="pagination.page"
      :items-per-page="pagination.rowsPerPage"
      hide-default-footer
    >
    <template v-slot:item.actions="{ item }">
      <v-btn fab class="indigo mr-2" small dark @click.native="$emit('dataTableClickHandler', item)">
        <v-icon>
          mdi-account
        </v-icon>
      </v-btn>
      <v-btn fab class="teal mr-2" small dark @click.native="$emit('edit', item)">
        <v-icon>
          mdi-pencil
        </v-icon>
      </v-btn>
      <v-btn fab class="cyan" small  @click.native="$emit('remove', item)">
        <v-icon>
          mdi-trash-can-outline
        </v-icon>
      </v-btn>
    </template>

      <template slot="no-data">
        <span>
          <p class="pt-2 blue--text subheading"><v-icon medium class="blue--text">mdi-info</v-icon>查無此資料</p>
        </span>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2" v-if="isNotEmpty">
      <v-pagination v-model="pagination.page" :length="pagination.pages"  :total-visible="9"  @input="$emit('updateTableData')" circle></v-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Entity, PatientOptions } from '@/types';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Table extends Vue {
  @Prop() readonly headers: TableHeader[];
  @Prop() readonly items: Entity[];
  @Prop() readonly pagination: Pagination;
  @Prop() readonly options:PatientOptions;
  
  //
  order = true;
  sort= '';

  created() {
    this.options.order === 'asc'? this.order = true: this.order = false;
    if(this.options.sort !== '') {
      this.sort = this.recoverySort(this.options.sort);
    }
  }
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

  hasHeader(header: TODO) {
    return header?.value ? true : false;
  }

  fomateOrder(order: string){
    if(order) {
      this.options.order = `asc`; 
    }else {
      this.options.order = `desc`; 
    }
    this.$emit('updateTableData');
  } 

  fomateSort() {
    const sortDir = {
      '姓名': 'name',
      '性別': 'gender',
      'ID': 'id',
      'ID卡': 'id_card',
      '測量': 'measure'
    }
    this.options.sort = sortDir[this.sort];
    this.$emit('updateTableData');
  }

  recoverySort(key: string) {
    const sortDir = {
      name: '姓名',
      gender: '性別',
      id: 'ID',
      id_card: 'ID卡',
      measure: '測量'
    }
    return sortDir[key];
  }
}
</script>
