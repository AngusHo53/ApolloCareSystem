
<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card v-if="!loading" style="margin-bottom: 10px">
        <v-card-title>
          <v-toolbar flat>
            <!-- <div class='blue rounded-circle d-inline-flex pa-2' style='width:16px;height:16px;'></div> -->
            <v-toolbar-title class="text-h4 pa-2 ont-weight-bold"
              >最新測量記錄</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn
              class="blue darken-2 mr-2"
              fab
              small
              dark
              @click.native="changeToChartPage()"
            >
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
                  <v-list-item-content :class="['font-weight-bold text-h6']"
                    >姓名:</v-list-item-content
                  >
                  <v-list-item-content :class="['text-left text-h6']">{{
                    patient.user.name
                  }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']"
                    >身份證字號:</v-list-item-content
                  >
                  <v-list-item-content :class="['text-h6']">{{
                    patient.user.iid
                  }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']"
                    >性別:</v-list-item-content
                  >
                  <v-list-item-content :class="['text-h6']">{{
                    patient.user.gender
                  }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']"
                    >生日:</v-list-item-content
                  >
                  <v-list-item-content :class="['text-h6']">{{
                    patient.user.birthday
                  }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']"
                    >電話:</v-list-item-content
                  >
                  <v-list-item-content :class="['text-h6']">{{
                    patient.user.phone
                  }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']"
                    >社區:</v-list-item-content
                  >
                  <v-list-item-content :class="['text-left text-h6']">{{
                    place
                  }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col>
              <v-tabs
                v-model="measureTab"
                centered
                background-color="blue"
                dark
                grow
              >
                <v-tab v-for="item in measureItem" :key="item.name_en">{{
                  item.name
                }}</v-tab>
              </v-tabs>
              <v-tabs-items v-model="measureTab">
                <v-tab-item
                  v-for="item in measureItem"
                  :key="item.name_en"
                  style="transition: none"
                >
                  <v-card color="basil" flat>
                    <v-card-title></v-card-title>
                    <v-row>
                      <template
                        v-for="(data, name, index) in patient.record[
                          item.name_en
                        ]"
                      >
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
                            <MeasureCard
                              v-else
                              :header="data.name.zh"
                              :value="'--'"
                            ></MeasureCard>
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
            <v-toolbar-title>歷史量測紀錄({{ totalRecords }})</v-toolbar-title>
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
            :loading="r_loading"
            loading-text="Loading..."
            :group-by="'measure_at'"
            :group-desc="true"
          >
            <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
              <th colspan="3">
                <v-awesome-icon
                  @click="toggle"
                  :icon="isOpen ? 'minus' : 'plus'"
                  size="lg"
                />
                {{ items[0].category }}
                {{ items[0].measure_at | formatMeasureAt }}
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
  </v-container>
</template>
<script lang="ts">
import Table from "@/components/Table.vue";
import TableHeaderButtons from "@/components/TableHeaderButtons.vue";
import MeasureCard from "@/components/MeasureCard.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { getDefaultPagination, MEASUREITEM } from "@/utils/store-util";
import { patientRecordsModule } from "@/store/modules/patientRecords";
import { placeModule } from "@/store/modules/place";
import { formatValue } from "@/utils/app-util";
import { formatMeasureAt } from "@/utils/app-util";

Vue.filter("formatValue", function (value) {
  return formatValue(value);
});

Vue.filter("formatMeasureAt", function (value) {
  // {{new Date(measure_at * 1000).toLocaleString()
  return formatMeasureAt(value);
});

@Component({
  components: {
    Table,
    TableHeaderButtons,
    ConfirmDialog,
    MeasureCard,
  },
})
export default class PatientRecords extends Vue {
  public dialog = false;
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
      width: "25%",
    },
    { text: "值", sortable: false, value: "value" },
  ];

  public recordsOptions = {
    page: 1,
    q: "",
    order: "asc",
    sort: "",
    uuid: "",
    limit: 10,
    formatMeasureAt: true,
  };

  get totalPages() {
    return patientRecordsModule.totalPages;
  }

  get currentPage() {
    return patientRecordsModule.currentPage;
  }

  get totalRecords() {
    return patientRecordsModule.totalRecords;
  }

  get records() {
    return patientRecordsModule.records;
  }

  get items() {
    return patientRecordsModule.items;
  }

  get loading() {
    return patientRecordsModule.loading;
  }

  get r_loading() {
    return patientRecordsModule.r_loading;
  }

  get measurementTypes() {
    return patientRecordsModule.measurementTypes;
  }

  get patient() {
    return patientRecordsModule.patient;
  }

  get pagination() {
    return patientRecordsModule.pagination;
  }

  set pagination(pagination) {
    patientRecordsModule.setPagination(pagination);
  }

  async created() {
    this.recordsOptions.formatMeasureAt = true;
    this.pagination = getDefaultPagination();
    this.recordsOptions.uuid = this.$router.currentRoute.params.id;
    await this.getPatientByUuid(this.recordsOptions.uuid);
    await this.updateTableData();
  }

  async getPatientByUuid(uuid) {
    await patientRecordsModule.getPatientByUuid(uuid);
    await placeModule.placeList();
    if (this.patient.user.place !== null) {
      this.place = await placeModule.codetoPlace(this.patient.user);
    }
  }

  async updateTableData() {
    await patientRecordsModule.getPatientRecordByUuid(this.recordsOptions);
  }

  changeToChartPage() {
    this.$router.push({ name: "個案紀錄圖表" });
  }
}
</script>
