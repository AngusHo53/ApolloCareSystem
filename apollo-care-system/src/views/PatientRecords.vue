
<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card v-if="!pLoading" style="margin-bottom:10px">
        <v-card-title>
          <v-toolbar flat>
            <!-- <div class='blue rounded-circle d-inline-flex pa-2' style='width:16px;height:16px;'></div> -->
            <v-toolbar-title class="text-h4 pa-2 ont-weight-bold">最新測量記錄</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="blue darken-2 mr-2" fab small dark @click.native="changeToChartPage()">
              <v-awesome-icon icon="chart-line" size="lg" />
            </v-btn>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-row :key="patient.user.name">
            <v-col cols="4" md="4" lg="4">
              <v-subheader>基本資訊</v-subheader>
              <v-list>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">姓名:</v-list-item-content>
                  <v-list-item-content :class="['text-left text-h6']">{{patient.user.name}}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">身份證字號:</v-list-item-content>
                  <!-- <v-list-item-content :class="['text-h6']">{{patient.user.iid}}</v-list-item-content> -->
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">性別:</v-list-item-content>
                  <v-list-item-content :class="['text-h6']">{{patient.user.gender}}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">生日:</v-list-item-content>
                  <v-list-item-content :class="['text-h6']">{{patient.user.birthday}}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">電話:</v-list-item-content>
                  <v-list-item-content :class="['text-h6']">{{patient.user.phone}}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">社區:</v-list-item-content>
                  <v-list-item-content :class="['text-left text-h6']">{{place}}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col>
              <v-tabs v-model="measureTab" centered background-color="blue" dark grow>
                <v-tab v-for="item  in measureItem" :key="item.name_en">{{ item.name }}</v-tab>
              </v-tabs>
              <v-tabs-items v-model="measureTab">
                <v-tab-item
                  v-for="(item) in measureItem"
                  :key="item.name_en"
                  style="transition: none;"
                >
                  <v-card color="basil" flat>
                    <v-card-title></v-card-title>
                    <v-row>
                      <template v-for="(data, name, index) in patient.record[item.name_en]">
                        <v-col cols="6" md="6" lg="6" :key="index">
                          <v-card-text :key="name">
                            <MeasureCard
                              :key="data.value"
                              v-if="data && data.value !== null"
                              :header="data.name.zh"
                              :measure_at="data.measure_at | formatMeasureAt"
                              :state="data.state"
                              :unit="data.unit"
                              :value="data.value | formatValue"
                            ></MeasureCard>
                            <MeasureCard v-else :header="data.name.zh" :value="'--'"></MeasureCard>
                          </v-card-text>
                        </v-col>
                      </template>
                    </v-row>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>
          <v-toolbar flat>
            <v-toolbar-title>歷史量測紀錄({{totalRecords}})</v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-data-table
            class="elevation-1"
            :headers="headers"
            :items="items"
            :page.sync="recordsOptions.page"
            :items-per-page="pagination.rowsPerPage"
            hide-default-footer
            :loading="loading"
            loading-text="Loading..."
            :group-by="'measure_at'"
            :group-desc="true"
          >
            <template v-slot:group.header="{items, isOpen, toggle}">
              <th colspan="3">
                <v-awesome-icon @click="toggle" :icon="isOpen ? 'minus' : 'plus' " size="lg" />
                {{items[0].category}} {{ items[0].measure_at | formatMeasureAt}}
              </th>
            </template>
          </v-data-table>
          <div class="text-xs-center pt-2">
            <v-pagination
              v-model="recordsOptions.page"
              :length="pagination.pages"
              :total-visible="9"
              @input="updateTableData()"
              circle
            ></v-pagination>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
    <!-- <v-overlay  :value="loading"></v-overlay> -->
  </v-container>
</template>
<script lang="ts">
import Table from "@/components/Table.vue";
import TableHeaderButtons from "@/components/TableHeaderButtons.vue";
import MeasureCard from "@/components/MeasureCard.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { Patient, MeasureData } from "@/types";
import {
  getDefaultPagination,
  MEASUREITEM,
  GENDER,
  getPagination
} from "@/utils/store-util";
import { formatValue } from "@/utils/app-util";
import { formatMeasureAt } from "@/utils/app-util";
import http from "@/http/axios";

Vue.filter("formatValue", function(value) {
  return formatValue(value);
});

Vue.filter("formatMeasureAt", function(value) {
  // {{new Date(measure_at * 1000).toLocaleString()
  return formatMeasureAt(value);
});

@Component({
  components: {
    Table,
    TableHeaderButtons,
    ConfirmDialog,
    MeasureCard
  }
})
export default class PatientRecords extends Vue {
  public dialog = false;
  public singleExpand = false;
  public expanded = [];
  public patientInfo = {};
  public totalPages = 0;
  public currentPage = 1;
  public totalRecords = 0;
  public records: MeasureData[] = [];
  public items = [];
  public loading = true;
  public pLoading = true;
  public measurementTypes = {};

  public pagination = getDefaultPagination();
  public patient: Patient = {
    user: {
      age: 0,
      birthday: "",
      created_at: "",
      gender: "",
      health_state: 0,
      id: 0,
      id_card: "",
      name: "",
      phone: "",
      updated_at: "",
      uuid: "",
      email: "",
      place: "",
      roles: [""]
    },
    id: 0,
    record: {
      blood: null,
      blood_glucose: null,
      blood_pressure: null,
      body_temperature: null,
      bone: null,
      frailty: null,
      mental: null,
      metabolic: null,
      spo2: null
    }
  };
  public place = "";
  public measureTab = null;
  public measureItem = MEASUREITEM;
  public headers = [
    { text: "測量時間", sortable: false, value: "measure_at" },
    {
      text: "關鍵字",
      sortable: false,
      value: "zh",
      align: "start",
      width: "25%"
    },
    { text: "值", sortable: false, value: "value" }
  ];

  public recordsOptions = {
    page: 1,
    q: "",
    order: "asc",
    sort: "",
    uuid: "",
    limit: -1,
    formatMeasureAt: true
  };

  async created() {
    this.clearRecords();
    this.recordsOptions.formatMeasureAt = true;
    this.setPagination(getDefaultPagination());
    this.recordsOptions.uuid = this.$router.currentRoute.params.id;
    // this.recordModule.getMeasurementType();
    await this.getPatientByUuid(this.recordsOptions.uuid);
    await this.updateTableData();
  }

  async destroyed() {
    await this.clearRecords();
  }

  setPagination(pagination) {
    this.pagination = pagination;
  }

  async getPatientByUuid(uuid) {
    this.pLoading = true;
    this.setPatient(undefined);
    const result = await http.get(
      `/user/${uuid}?with=record&record=mode%3Afull%7Cfield%3Aall`
    );
    if (result.data.data) {
      const data = result.data.data;
      if (
        data.user.name !== "廖小栩" &&
        data.user.name !== "廖德" &&
        data.user.name !== "廖大德"
      ) {
        data.user.name = " ";
      }
      data.user.gender = GENDER[data.user.gender];
      this.setPatient(data);
    } else {
      console.error(result);
    }
    await this.getPlaceList();
    this.pLoading = false;
  }

  async updateTableData() {
    await this.getPatientRecordByUuid(this.recordsOptions);
  }

  changeToChartPage() {
    this.$router.push({ name: "病人紀錄圖表" });
  }

  changeDataToCH(item, name) {
    const data = item.children.find(obj => {
      return obj.name_zn === name;
    });
    if (data) return data.name;
  }

  clearRecords() {
    this.patient = undefined;
    this.patientInfo = {};
    this.totalPages = 0;
    this.totalRecords = 0;
    this.records = [];
    this.items = [];
    this.measurementTypes = {};
    this.pagination = getDefaultPagination();
  }

  async getPatientRecordByUuid(options) {
    this.loading = true;
    const result = await http.get(
      `/user/${options.uuid}/record?limit=${options.limit}&page=${options.page}`
    );
    if (result.data.data) {
      const data = result.data.data;
      // this.setPatient(result.data.data);
      this.totalPages = data.total_page;
      this.currentPage = data.current_page;
      this.records = data.records;
      await this.getMeasurementTypes();
      await this.formateData({
        data: data.records,
        formatTime: options.formatMeasureAt
      });
      await this.setRecordDataTable(data.records);
      this.loading = false;
    } else {
      console.error(result);
    }
  }

  async getMeasurementTypes() {
    const result = await http.get(`/measurements/types`);
    if (result) {
      this.measurementTypes = result.data.data.measurement_type;
    } else {
      console.error(result);
    }
    return result;
  }

  async getPlaceList() {
    if (this.patient.user.place !== null) {
      const pCode = this.patient.user.place.split(",");
      const result = await http.get(`/place`);
      if (result) {
        for (let i = 0; i < result.data.data.place.length; i++) {
          if (result.data.data.place[i].shortcode == pCode[0]) {
            if (result.data.data.place[i].index == pCode[1]) {
              this.place = result.data.data.place[i].branch_name;
            }
          }
        }
      } else {
        console.error(result);
      }
      return result;
    } else return;
  }

  async formateData(obj) {
    const total = new Set();

    await obj.data.sort((a, b) => {
      return new Date(a.measure_at).getTime() > new Date(b.measure_at).getTime()
        ? 1
        : new Date(b.measure_at).getTime() > new Date(a.measure_at).getTime()
        ? -1
        : 0;
    });
    await obj.data.forEach(element => {
      if (element) {
        if (!obj.formatTime) {
          element.measure_at = new Date(
            element.measure_at * 1000
          ).toLocaleString();
        }
        // Calculate the total records
        total.add(element.measure_at);
        element.zh = this.measurementTypes[element.key].i18n.zh;
        if (this.measurementTypes[element.category]) {
          element.category = this.measurementTypes[element.category].i18n.zh;
        }
        element.value = formatValue(element.value);
      }
      this.items.push(element);
    });
    this.totalRecords = total.size;
  }

  async setRecordDataTable(data) {
    const pagination = getPagination(
      data,
      this.totalPages,
      this.currentPage,
      data.length
    );
    this.setPagination(pagination);
  }

  setPatient(patient) {
    this.patient = patient;
  }
}
</script>
