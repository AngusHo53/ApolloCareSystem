<template>
  <v-container fluid>
    <v-card :loading="loading">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title class="text-h4 pa-2 ont-weight-bold">圖表</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn fab small dark class="grey mr-2" @click.native="cancel()">
            <v-awesome-icon icon="times-circle" size="lg" />
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <v-row class="pa-4" justify="space-between">
        <v-col cols="2">
          <v-card-text>
            <v-treeview
              activatable
              open-on-click
              :multiple-active="false"
              transition
              :items="measurement"
              :active.sync="selected"
              return-object
              rounded
              @update:active="update();"
            ></v-treeview>
          </v-card-text>
        </v-col>

        <v-col cols="10" v-if="!loading">
          <v-card-title>
            <div class="text-center" v-if="true">
              {{selected.length ? selected[0].name : '收縮壓'}}
              <v-chip
                v-if="STATUS_GOOD"
                class="ma-2"
                :color="color(0)"
              >{{STATUS_GOOD.operation}} {{STATUS_GOOD.value}}</v-chip>
              <v-chip
                v-if="STATUS_WARNING"
                class="ma-2"
                :color="color(1)"
              >{{STATUS_WARNING.operation}} {{STATUS_WARNING.value}}</v-chip>
              <v-chip
                class="ma-2"
                :color="color(2)"
                v-if="STATUS_BAD"
              >{{STATUS_BAD.operation}} {{STATUS_BAD.value}}</v-chip>
            </div>
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="recordsOptions.range"
              tile
              color="deep-purple accent-3"
              group
              @click.native="changeRange()"
            >
              <v-btn value="7,d">一周</v-btn>
              <v-btn value="1,m">一個月</v-btn>

              <v-btn value="6,m">半年</v-btn>

              <v-btn value="12,m">一年</v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text v-if="chartOptions">
            <VueApexCharts :height="300" :type="'line'" :options="chartOptions" :series="series" />
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import VueApexCharts from "vue-apexcharts";
import { recordModule } from "@/store/modules/records";
import { patientRecordsModule } from "@/store/modules/patientRecords";
import {
  MEASUREITEM,
  MEASUREMENT_STATUS,
  MEASUREMENT_COLORS
} from "@/utils/store-util";
import { appModule } from "@/store/modules/app";
Vue.use(VueApexCharts);

interface STASUS {
  value: number;
}

@Component({
  components: {
    VueApexCharts
  }
})
export default class RecordChart extends Vue {
  chartOptions = {};
  series = [];
  mearsumentAt = [];
  mearsumentValue = [];
  mearsumentGoodValue = [];
  mearsumentWarningValue = [];
  mearsumentBadValue = [];
  selected = [];

  measureTypeShow = ["blood_pressure", "blood_glucose"];
  measurement = MEASUREITEM.filter(item => {
    return this.measureTypeShow.includes(item.name_en);
  });

  STATUS_GOOD: STASUS = {
    value: 0
  };
  STATUS_WARNING: STASUS = {
    value: 0
  };
  STATUS_BAD: STASUS = {
    value: 0
  };

  recordsOptions = {
    q: "",
    order: "asc",
    sort: "",
    uuid: "",
    limit: -1,
    formatMeasureAt: false,
    range: "7,d"
  };

  async created() {
    this.recordsOptions.uuid = this.$router.currentRoute.params.id;
    this.changeRange();
  }

  async changeRange() {
    this.resetChart();
    patientRecordsModule.clearRecord();
    await patientRecordsModule.getPatientRecordByUuid(this.recordsOptions);
    this.update();
  }

  color(status) {
    return MEASUREMENT_COLORS[status];
  }

  async update() {
    let measurementName = "systolic";
    if (this.selected.length) {
      measurementName = this.selected[0].name_en;
    }
    await this.resetChart();
    await this.getDataByCategory(measurementName);
    await this.updataChart();
  }

  updataChart() {
    this.series = [
      {
        name: "測量值",
        data: this.mearsumentValue
      },
      {
        name: "警告值",
        data: this.mearsumentWarningValue
      },
      {
        name: "異常值",
        data: this.mearsumentBadValue
      }
    ];
    this.chartOptions = {
      xaxis: {
        type: "datetime",
        categories: this.mearsumentAt
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
  }

  resetChart() {
    this.chartOptions = {};
    this.mearsumentAt = [];
    this.mearsumentValue = [];
    this.mearsumentGoodValue = [];
    this.mearsumentWarningValue = [];
    this.mearsumentBadValue = [];
  }

  async getDataByCategory(name: string) {
    const data = this.items.filter(data => data.key === name);
    for (const d of data) {
      this.mearsumentAt.push(
        d.measure_at.substring(5, d.measure_at.length - 3)
      );
      this.mearsumentValue.push(d.value);
    }

    // GOOD
    this.STATUS_GOOD = this.measurementTypes[name].rule.find(r => {
      return r.result === MEASUREMENT_STATUS.GOOD;
    });

    if (this.STATUS_GOOD) {
      this.mearsumentGoodValue = data.map(() => this.STATUS_GOOD.value);
    }

    // WARNING
    this.STATUS_WARNING = this.measurementTypes[name].rule.find(r => {
      return r.result === MEASUREMENT_STATUS.WARNING;
    });
    if (this.STATUS_WARNING) {
      this.mearsumentWarningValue = data.map(() => this.STATUS_WARNING.value);
    }

    // BAD
    this.STATUS_BAD = this.measurementTypes[name].rule.find(r => {
      return r.result === MEASUREMENT_STATUS.BAD;
    });
    if (this.STATUS_BAD) {
      this.mearsumentBadValue = data.map(() => this.STATUS_BAD.value);
    }
  }

  cancel() {
    this.resetChart();
    this.$router.push({ name: "個案紀錄" });
  }

  get items() {
    return patientRecordsModule.items;
  }

  get measurementTypes() {
    return patientRecordsModule.measurementTypes;
  }

  get loading() {
    return patientRecordsModule.loading;
  }
}
</script>
