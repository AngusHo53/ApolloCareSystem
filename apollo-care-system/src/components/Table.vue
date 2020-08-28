<template>
  <div>
    <v-data-table
      v-if="!showSelect"
      class="elevation-1"
      :headers="headers"
      :items="items"
      :page.sync="options.page"
      :items-per-page="pagination.rowsPerPage"
      hide-default-footer
      :loading="loading"
      item-key="uuid"
      loading-text="Loading..."
      :group-by="groupBy"
      :group-desc="true"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          fab
          class="indigo mr-2"
          small
          dark
          @click.native="$emit('dataTableClickHandler', item)"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn fab class="teal mr-2" small dark @click.native="$emit('edit', item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn fab class="cyan" small @click.native="$emit('remove', item)">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
      <template slot="no-data">
        <span>
          <p class="pt-2 blue--text subheading">
            <v-icon medium class="blue--text">mdi-info</v-icon>查無此資料
          </p>
        </span>
      </template>
    </v-data-table>
    <v-data-table
      v-if="showSelect"
      v-model="select.patients"
      class="elevation-1"
      :headers="headers"
      :items="items"
      :page.sync="options.page"
      :items-per-page="pagination.rowsPerPage"
      hide-default-footer
      :loading="loading"
      loading-text="Loading..."
      item-key="uuid"
      :show-select="true"
      :single-select="false"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn fab class="teal mr-2" small dark @click.native="$emit('edit', item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn fab class="cyan" small @click.native="$emit('remove', item)">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
      <template slot="no-data">
        <span>
          <p class="pt-2 blue--text subheading">
            <v-icon medium class="blue--text">mdi-info</v-icon>查無此資料
          </p>
        </span>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2" v-if="isNotEmpty">
      <v-pagination
        v-model="options.page"
        :length="pagination.pages"
        :total-visible="9"
        @input="$emit('updateTableData')"
        circle
      ></v-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Entity, PatientOptions, VerifyPatientsOptions } from "@/types";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class Table extends Vue {
  @Prop() readonly headers: TableHeader[];
  @Prop() readonly items: Entity[];
  @Prop() readonly pagination: Pagination;
  @Prop() readonly options: PatientOptions;
  @Prop() readonly loading: boolean;
  @Prop() readonly showSelect: boolean;
  @Prop() readonly select: VerifyPatientsOptions;
  @Prop() readonly groupBy: string;
  //
  order = true;
  sort = "";

  created() {
    this.options.order === "asc" ? (this.order = true) : (this.order = false);
    if (this.options.sort !== "") {
      this.sort = this.recoverySort(this.options.sort);
    }
  }

  renderData = (item: TODO, header: TODO) => {
    let val = "";
    if (header.value.includes(".")) {
      const vals = header.value.split(".");
      val = vals.reduce((acc: TODO, val: TODO) => acc[val], item);
    } else {
      val = item[header.value];
    }
    if (typeof val === "boolean") {
      val = val ? "Yes" : "No";
    }
    return val;
  };
  isNotEmpty() {
    return this.items && this.items.length > 0;
  }

  hasHeader(header: TODO) {
    return header?.value ? true : false;
  }

  fomateOrder(order: string) {
    if (order) {
      this.options.order = `asc`;
    } else {
      this.options.order = `desc`;
    }
    this.$emit("update-table-data");
  }

  fomateSort() {
    const sortDir = {
      姓名: "name",
      性別: "gender",
      ID: "iid",
      信箱: "email"
    };
    this.options.sort = sortDir[this.sort];
    this.$emit("update-table-data");
  }

  recoverySort(key: string) {
    const sortDir = {
      name: "姓名",
      gender: "性別",
      iid: "ID",
      measure: "測量",
      email: "信箱"
    };
    return sortDir[key];
  }
}
</script>
