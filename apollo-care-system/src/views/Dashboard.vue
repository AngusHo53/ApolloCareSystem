<template>
  <v-container id="dashboard" fluid grid-list-lg class="mx-0 pa-0">
    <v-flex xs12>
      <v-card :loading="loading">
        <v-card-title>
          <v-toolbar-title>所有個案即時圖表 {{ totalPatients ? '(' + totalPatients + ')' : '' }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-row no-gutters v-for="(item,index) in patients_record" :key="index">
          <v-col cols="3" class="pa-1">
            <v-row>
              <v-col cols="12" class="pt-0 pb-0">
                <v-card>
                  <v-card-title class="text-h6 font-weight-bold">{{item.user.user.name}}</v-card-title>
                  <v-card-subtitle class="text-subtitle-1 font-weight-bold">{{item.user.user.place}}</v-card-subtitle>
                  <v-divider></v-divider>
                  <v-list :subheader="true">
                    <v-list-item>
                      <v-col cols="1" class="pa-0">
                        <v-list-item-icon>
                          <v-icon
                            small
                            v-if="item.user.record.blood_pressure.systolic.value > 170 || item.user.record.blood_pressure.diastolic.value > 120"
                            color="red darken-2"
                          >fas fa-circle</v-icon>
                          <v-icon
                            small
                            v-if="item.user.record.blood_pressure.systolic.value > 140 && item.user.record.blood_pressure.systolic.value < 170 || item.user.record.blood_pressure.diastolic.value > 80 && item.user.record.blood_pressure.diastolic.value < 120"
                            color="yellow darken-2"
                          >fas fa-circle</v-icon>
                        </v-list-item-icon>
                      </v-col>
                      <v-list-item-content
                        class="align-start font-weight-black text-xl-h6 text-md-body-1"
                      >
                        <div style="display:flex">
                          血壓
                          <span
                            :class="[item.user.record.blood_pressure.systolic.value > 170 ? 'red--text text--darken-2':'' || item.user.record.blood_pressure.systolic.value > 140 && item.user.record.blood_pressure.systolic.value < 170 ? 'yellow--text text--darken-2':'']"
                          >{{item.user.record.blood_pressure.systolic.value}}</span>
                          <span
                            v-show="item.user.record.blood_pressure.systolic.value && item.user.record.blood_pressure.diastolic.value"
                          >/</span>
                          <span
                            :class="[item.user.record.blood_pressure.diastolic.value > 120 ? 'red--text text--darken-2':'' || item.user.record.blood_pressure.diastolic.value > 80 && item.user.record.blood_pressure.diastolic.value < 120 ? 'yellow--text text--darken-2':'']"
                          >{{item.user.record.blood_pressure.diastolic.value}}</span>
                        </div>
                      </v-list-item-content>
                      <v-list-item-content
                        class="align-end flex-column text-caption"
                      >{{item.user.record.blood_pressure.systolic.measure_at}}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-col cols="1">
                        <v-list-item-icon>
                          <v-icon
                            small
                            v-if="item.user.record.blood_pressure.pulse.value > 170"
                            color="red darken-2"
                          >fas fa-circle</v-icon>
                          <v-icon
                            small
                            v-if="item.user.record.blood_pressure.pulse.value > 140 && item.user.record.blood_pressure.pulse.value < 170"
                            color="yellow darken-2"
                          >fas fa-circle</v-icon>
                        </v-list-item-icon>
                      </v-col>

                      <v-list-item-content
                        class="align-center font-weight-black text-xl-h6 text-md-body-1"
                      >
                        <div style="display:flex">
                          脈搏
                          <span
                            :class="[item.user.record.blood_pressure.pulse.value > 170 ? 'red--text text--darken-2':'' || item.user.record.blood_pressure.pulse.value > 140 && item.user.record.blood_pressure.pulse.value < 170 ? 'yellow--text text--darken-2':'']"
                          >{{item.user.record.blood_pressure.pulse.value}}</span>
                        </div>
                      </v-list-item-content>
                      <v-list-item-content
                        class="align-end flex-column text-caption"
                      >{{item.user.record.blood_pressure.pulse.measure_at}}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-col cols="1">
                        <v-list-item-icon>
                          <v-icon
                            small
                            v-if="item.user.record.blood_glucose.blood_glucose.value > 400"
                            color="red darken-2"
                          >fas fa-circle</v-icon>
                          <v-icon
                            small
                            v-if="item.user.record.blood_glucose.blood_glucose.value > 200 && item.user.record.blood_glucose.blood_glucose.value < 400"
                            color="yellow darken-2"
                          >fas fa-circle</v-icon>
                        </v-list-item-icon>
                      </v-col>

                      <v-list-item-content
                        class="align-center font-weight-black text-xl-h6 text-md-body-1"
                      >
                        <div style="display:flex">
                          血糖
                          <span
                            :class="[item.user.record.blood_glucose.blood_glucose.value > 400 ? 'red--text text--darken-2':'' || item.user.record.blood_glucose.blood_glucose.value > 200 && item.user.record.blood_glucose.blood_glucose.value < 400 ? 'yellow--text text--darken-2':'']"
                          >{{item.user.record.blood_glucose.blood_glucose.value}}</span>
                        </div>
                      </v-list-item-content>
                      <v-list-item-content
                        class="align-end flex-column text-caption"
                      >{{item.user.record.blood_glucose.blood_glucose.measure_at}}</v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" class="pa-1" v-if="!loading">
            <v-card height="100%">
              <v-card-text v-if="chart_loading">
                <VueApexCharts
                  :type="'line'"
                  :options="s_chartOptions[index]"
                  :series="s_series[index]"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="3" class="pa-1" v-if="!loading">
            <v-card height="100%">
              <v-card-text v-if="chart_loading">
                <VueApexCharts
                  :type="'line'"
                  :options="p_chartOptions[index]"
                  :series="p_series[index]"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="3" class="pa-1" v-if="!loading">
            <v-card height="100%">
              <v-card-text v-if="chart_loading">
                <VueApexCharts
                  :type="'line'"
                  :options="b_chartOptions[index]"
                  :series="b_series[index]"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-xs-center pt-2">
          <v-pagination
            v-model="patientOptions.page"
            :length="pagination.pages"
            :total-visible="9"
            @input="updateCard()"
            circle
          ></v-pagination>
        </div>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script lang="ts">
import { Patient, PatientInfo, PatientsRecord } from "@/types";
import {
  MEASUREITEM,
  MEASUREMENT_STATUS,
  MEASUREMENT_COLORS
} from "@/utils/store-util";
import { Component, Watch } from "vue-property-decorator";
import { recordModule } from "@/store/modules/records";
import VueApexCharts from "vue-apexcharts";
import Vue from "vue";
import { getDefaultPagination, getPagination } from "@/utils/store-util";
import http from "@/http/axios";
import {} from "../types";
Vue.use(VueApexCharts);
@Component({
  components: {
    VueApexCharts
  }
})
export default class Dashboard extends Vue {
  public loading = false;
  public patients: Patient[] = [];
  public patients_record: PatientsRecord[] = [];
  public chart_loading = false;

  public totalPatients = 0;
  public items: PatientInfo[] = [];
  public pagination = getDefaultPagination();
  public totalPages = 0;
  public currentPage = 1;
  private patientOptions = {
    page: 1,
    q: "",
    order: "asc",
    sort: ""
  };
  private lastSearch = "";
  public place = {
    branch_name: [],
    index: [],
    shortcode: []
  };

  public s_chartOptions = [];
  public s_series = [];
  public s_rule = {
    warning: [],
    bad: []
  };

  public p_chartOptions = [];
  public p_series = [];
  public p_rule = {
    warning: [],
    bad: []
  };

  public b_chartOptions = [];
  public b_series = [];
  public b_rule = {
    warning: [],
    bad: []
  };

  @Watch("loading", { immediate: true, deep: true })
  updateData() {
    this.chart_loading = true;
  }

  async created() {
    this.setPagination(getDefaultPagination());
    await this.getPlaceList();
    await this.getMeasurementTypes();
    await this.updateCard();
    console.log(JSON.parse(JSON.stringify(this.patients_record)));
  }

  async updateCard() {
    await this.allPatients();
    await this.updateChart();
  }

  async destroyed() {
    this.clearPatient();
  }

  async allPatients() {
    this.loading = true;
    this.clearPatient();
    if (!this.loading) {
      if (this.patientOptions.q !== this.lastSearch) {
        this.patientOptions.page = 1;
        this.lastSearch = this.patientOptions.q;
      }
    }

    const result = await http.get(
      `/users?with=record&q=${this.patientOptions.q}&page=${this.patientOptions.page}&limit=10&sort=measure,desc&record=mode%3Afull%7Cfield%3Aall&role=Patient`
    );
    if (result) {
      const data = result.data.data;
      this.totalPatients = data.total_users;
      this.totalPages = data.total_page;
      this.currentPage = this.patientOptions.page;
      // Extract Table Data
      this.patients_record = await this.extractPatientInfo(data.users);
      const pagination = getPagination(
        this.items,
        this.totalPages,
        this.currentPage
      );
      this.setPagination(pagination);
    } else {
      console.error(result);
    }
  }

  async extractPatientInfo(patients) {
    const patients_record = [];
    for (const patient of patients) {
      if (patient.user) {
        const len = patient.user.name.length;
        switch (len) {
          case 2:
            patient.user.name = patient.user.name.substring(0, 1) + "◯";
            break;
          case 3:
            patient.user.name = patient.user.name.substring(0, 1) + "◯" + patient.user.name.substring(2, 3);
            break;
          case 4:
            patient.user.name = patient.user.name.substring(0, 1) + "◯◯" + patient.user.name.substring(3, 4);
            break;
          default:
            patient.user.name = patient.user.name.substr(0, 3) + "◯".repeat((len-6) > 0 ? len-6 : 1) + patient.user.name.substr(len-3, 3);
            break;
        }
        patient.user.place = this.codetoPlace(patient.user);

        if (patient.record.blood_pressure.systolic.measure_at !== null) {
          patient.record.blood_pressure.systolic.measure_at = new Date(
            patient.record.blood_pressure.systolic.measure_at * 1000
          ).toLocaleString();
        }
        if (patient.record.blood_pressure.pulse.measure_at !== null) {
          patient.record.blood_pressure.pulse.measure_at = new Date(
            patient.record.blood_pressure.pulse.measure_at * 1000
          ).toLocaleString();
        }
        if (
          patient.record.blood_glucose.blood_glucose.measure_at !== null
        ) {
          patient.record.blood_glucose.blood_glucose.measure_at = new Date(
            patient.record.blood_glucose.blood_glucose.measure_at * 1000
          ).toLocaleString();
        }
        patients_record.push({
          user: patient,
          record: await this.patientRecord(patient)
        });
      }
    }
    return patients_record;
  }

  setPagination(pagination) {
    this.pagination = pagination;
  }

  async getPlaceList() {
    const result = await http.get(`/place`);
    if (result) {
      for (let i = 0; i < result.data.data.place.length; i++) {
        this.place.branch_name.push(result.data.data.place[i].branch_name);
        this.place.index.push(result.data.data.place[i].index);
        this.place.shortcode.push(result.data.data.place[i].shortcode);
      }
    } else {
      console.error(result.data.status);
    }
  }

  codetoPlace(item) {
    if (item.place !== null) {
      const pCode = item.place.split(",");
      for (let i = 0; i < this.place.branch_name.length; i++) {
        if (this.place.shortcode[i] == pCode[0]) {
          if (this.place.index[i] == pCode[1]) {
            return this.place.branch_name[i];
          }
        }
      }
    } else return;
  }

  async getMeasurementTypes(): Promise<TODO> {
    const result = await http.get(`/measurements/types`);
    if (result) {
      const data = result.data.data.measurement_type;
      this.s_rule = this.updateRule(data.systolic.rule);
      this.p_rule = this.updateRule(data.pulse.rule);
      this.b_rule = this.updateRule(data.blood_glucose.rule);
    } else {
      console.error(result);
    }
    return result;
  }

  async patientRecord(user: Patient) {
    this.loading = true;
    const result = await http.get(
      `/user/${user.user.uuid}/record?limit=-1&range=7,d`
    );
    const record = {
      systolic: [],
      diastolic: [],
      pulse: [],
      blood_glucose: []
    };

    if (result.data.data) {
      const data = result.data.data;
      for (const i in data.records) {
        if (data.records[i].key === "systolic") {
          const date = new Date(
            data.records[i].measure_at * 1000
          ).toLocaleString();
          data.records[i].measure_at = date.substring(5, date.length - 3);
          record.systolic.push({
            measure_at: data.records[i].measure_at,
            value: data.records[i].value
          });
        } else if (data.records[i].key === "diastolic") {
          const date = new Date(
            data.records[i].measure_at * 1000
          ).toLocaleString();
          data.records[i].measure_at = date.substring(5, date.length - 3);
          record.diastolic.push({
            measure_at: data.records[i].measure_at,
            value: data.records[i].value
          });
        } else if (data.records[i].key === "pulse") {
          const date = new Date(
            data.records[i].measure_at * 1000
          ).toLocaleString();
          data.records[i].measure_at = date.substring(5, date.length - 3);
          record.pulse.push({
            measure_at: data.records[i].measure_at,
            value: data.records[i].value
          });
        } else if (data.records[i].key === "blood_glucose") {
          const date = new Date(
            data.records[i].measure_at * 1000
          ).toLocaleString();
          data.records[i].measure_at = date.substring(5, date.length - 3);
          record.blood_glucose.push({
            measure_at: data.records[i].measure_at,
            value: data.records[i].value
          });
        }
      }
      return record;
    } else {
      console.error(result);
    }
  }

  updateRule(rule) {
    const value = {
      warning: [],
      bad: []
    };

    for (const i in rule) {
      if (rule[i].result === MEASUREMENT_STATUS.WARNING) {
        value.warning.push(rule[i].value);
      } else if (rule[i].result === MEASUREMENT_STATUS.BAD) {
        value.bad.push(rule[i].value);
      }
    }

    return value;
  }

  updateChart() {
    const s_value = [];
    const s_measure_at = [];
    const p_value = [];
    const p_measure_at = [];
    const b_value = [];
    const b_measure_at = [];
    const s_warning = [];
    const s_bad = [];
    const p_warning = [];
    const p_bad = [];
    const b_warning = [];
    const b_bad = [];
    const b_low_bad = [];
    for (const i in this.patients_record) {
      s_value[i] = [];
      s_measure_at[i] = [];
      p_value[i] = [];
      p_measure_at[i] = [];
      b_value[i] = [];
      b_measure_at[i] = [];
      s_warning[i] = [];
      s_bad[i] = [];
      p_warning[i] = [];
      p_bad[i] = [];
      b_warning[i] = [];
      b_bad[i] = [];
      b_low_bad[i] = [];
      if (this.patients_record[i].record) {
        for (const j in this.patients_record[i].record.systolic) {
          s_value[i][j] = this.patients_record[i].record.systolic[j].value;
          s_measure_at[i][j] = this.patients_record[i].record.systolic[
            j
          ].measure_at;
          s_warning[i][j] = this.s_rule.warning[0];
          s_bad[i][j] = this.s_rule.bad[0];
        }
        for (const j in this.patients_record[i].record.pulse) {
          p_value[i][j] = this.patients_record[i].record.pulse[j].value;
          p_measure_at[i][j] = this.patients_record[i].record.pulse[
            j
          ].measure_at;
          p_warning[i][j] = this.p_rule.warning[0];
          p_bad[i][j] = this.p_rule.bad[0];
        }
        for (const j in this.patients_record[i].record.blood_glucose) {
          b_value[i][j] = this.patients_record[i].record.blood_glucose[j].value;
          b_measure_at[i][j] = this.patients_record[i].record.blood_glucose[
            j
          ].measure_at;
          b_warning[i][j] = this.b_rule.warning[0];
          b_bad[i][j] = this.b_rule.bad[0];
          b_low_bad[i][j] = this.b_rule.bad[1];
        }
        this.s_series[i] = [
          {
            name: "測量值",
            data: s_value[i]
          },
          {
            name: "警告值",
            data: s_warning[i]
          },
          {
            name: "異常值",
            data: s_bad[i]
          }
        ];
        this.p_series[i] = [
          {
            name: "測量值",
            data: p_value[i]
          },
          {
            name: "警告值",
            data: p_warning[i]
          },
          {
            name: "異常值",
            data: p_bad[i]
          }
        ];
        this.b_series[i] = [
          {
            name: "測量值",
            data: b_value[i]
          },
          {
            name: "警告值",
            data: b_warning[i]
          },
          {
            name: "異常值",
            data: b_bad[i]
          },
          {
            name: "異常值",
            data: b_low_bad[i]
          }
        ];

        this.s_chartOptions[i] = {
          title: {
            text: "收縮壓",
            align: "left"
          },
          chart: {
            type: "line",
            width: "100%",
            zoom: {
              enabled: false
            }
          },
          xaxis: {
            categories: s_measure_at[i]
          },
          yaxis: {
            labels: {
              minWidth: 10
            }
          },

          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [3, 3, 3],
            curve: "straight",
            dashArray: [0, 3, 3]
          },
          markers: {
            size: [6, 0, 0],
            hover: {
              sizeOffset: 10
            }
          },
          grid: {
            borderColor: "#f1f1f1"
          },
          colors: ["#757575", MEASUREMENT_COLORS[1], MEASUREMENT_COLORS[2]],
          tooltip: {
            enabledOnSeries: [0]
          }
        };

        this.p_chartOptions[i] = {
          title: {
            text: "脈搏",
            align: "left"
          },
          chart: {
            type: "line",
            width: "100%",
            zoom: {
              enabled: false
            }
          },
          xaxis: {
            categories: p_measure_at[i]
          },
          yaxis: {
            labels: {
              minWidth: 10
            }
          },
          zoom: {
            enabled: false
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [3, 3, 3],
            curve: "straight",
            dashArray: [0, 3, 3]
          },
          markers: {
            size: [6, 0, 0],
            hover: {
              sizeOffset: 10
            }
          },
          grid: {
            borderColor: "#f1f1f1"
          },
          colors: ["#757575", MEASUREMENT_COLORS[1], MEASUREMENT_COLORS[2]],
          tooltip: {
            enabledOnSeries: [0]
          }
        };

        this.b_chartOptions[i] = {
          title: {
            text: "血糖",
            align: "left"
          },
          chart: {
            type: "line",
            width: "100%",
            zoom: {
              enabled: false
            }
          },
          xaxis: {
            categories: b_measure_at[i]
          },
          yaxis: {
            labels: {
              minWidth: 10
            }
          },
          zoom: {
            enabled: false
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [3, 3, 3, 3],
            curve: "straight",
            dashArray: [0, 3, 3, 3]
          },
          markers: {
            size: [6, 0, 0, 0],
            hover: {
              sizeOffset: 10
            }
          },
          grid: {
            borderColor: "#f1f1f1"
          },
          colors: [
            "#757575",
            MEASUREMENT_COLORS[1],
            MEASUREMENT_COLORS[2],
            MEASUREMENT_COLORS[2]
          ],
          tooltip: {
            enabledOnSeries: [0]
          }
        };
      }
    }
    this.loading = false;
  }

  updateSeries(value, type) {
    const Series = [
      {
        name: "測量值",
        data: value
      },
      {
        name: "警告值",
        data: []
      },
      {
        name: "異常值",
        data: []
      }
    ];
    return Series;
  }
  updateOptions(value, type) {}

  clearPatient() {
    this.patients = [];
    this.patients_record = [];
    this.items = [];
    this.totalPages = 0;
    this.totalPatients = 0;
    this.pagination = getDefaultPagination();
    this.s_chartOptions = [];
    this.s_series = [];
    this.p_chartOptions = [];
    this.p_series = [];
    this.b_chartOptions = [];
    this.b_series = [];
  }
}
</script>

<style scoped>
.danger {
  color: red;
}

.warning {
  color: yellow;
}

.normal {
  color: black;
}
</style>
