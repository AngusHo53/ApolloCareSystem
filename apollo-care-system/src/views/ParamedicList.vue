<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar-title>照護人員名單 {{ totalParamedics ? '(' + totalParamedics + ')' : '' }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-text-field
            clearable
            flat
            solo-inverted
            hide-details
            v-model="search"
            append-icon="mdi-magnify"
            label="關鍵字搜尋"
          ></v-text-field>
          <v-data-table
            item-key="iid"
            :headers="headers"
            :items="paramedics_items"
            :loading="loading"
            loading-text="請稍後..."
            :search="search"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn fab class="indigo mr-2" small dark @click="changeToPatient(item)">
                <v-awesome-icon icon="user" size="lg" />
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script lang="ts">
import { Patient } from "@/types";
import { Component } from "vue-property-decorator";
import Vue from "vue";
import http from "@/http/axios";
import { PatientInfo } from "../types";
import { GENDER } from "@/utils/store-util";

@Component
export default class ParamedicList extends Vue {
  public loading = true;
  public search = "";
  public headers = [
    {
      text: "名稱",
      left: true,
      sortable: false,
      value: "name"
    },
    { text: "身份證字號", sortable: false, value: "iid" },
    { text: "性別", sortable: false, value: "gender" },
    { text: "年齡", sortable: false, value: "age" },
    { text: "生日", sortable: false, value: "birthday" },
    { text: "電話", sortable: false, value: "phone" },
    { text: "信箱", sortable: false, value: "email" },
    { text: "負責個案", value: "actions", sortable: false }
  ];
  public paramedics: PatientInfo[] = [];
  public paramedics_items: PatientInfo[] = [];
  public totalParamedics = 0;

  async created() {
    await this.updateTableData();
  }

  async destroyed() {
    await this.cleanParamedics();
  }

  async updateTableData() {
    this.loading = true;
    const result = await http.get("/accounts");
    if (result) {
      if (result.data.status === "Success") {
        const data = result.data.data;
        this.paramedics = data.accounts;
        this.totalParamedics = data.accounts.length;
        this.paramedics.forEach(element => {
          if (element && element.roles.includes("Paramedic")) {
            element.gender = GENDER[element.gender];
            this.paramedics_items.push(element);
          }
        });
        this.loading = false;
      } else {
        console.log("error");
      }
    } else {
      console.log("error");
    }
  }

  cleanParamedics() {
    this.totalParamedics = 0;
    this.paramedics = [];
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
}
</script>
