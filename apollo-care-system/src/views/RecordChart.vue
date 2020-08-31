<template>
  <v-container fluid>
    <v-card :loading="loading">
      <v-card-title class="title">
        <v-toolbar flat>
          <!-- <div class='blue rounded-circle d-inline-flex pa-2' style='width:16px;height:16px;'></div> -->
          <v-toolbar-title class="text-h4 pa-2 ont-weight-bold">圖表</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn fab small dark class="grey mr-2" @click.native="cancel()">
            <v-icon>mdi-close-circle-outline</v-icon>
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
            >
              <template v-slot:prepend="{ item }">
                <v-icon v-if="!item.children">mdi-account</v-icon>
              </template>
            </v-treeview>
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
            <v-btn-toggle v-model="text" tile color="deep-purple accent-3" group>
              <v-btn value="left">一周</v-btn>
              <v-btn value="center">一個月</v-btn>

              <v-btn value="right">半年</v-btn>

              <v-btn value="justify">一年</v-btn>
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
  text;
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
    page: 1,
    q: "",
    order: "asc",
    sort: "",
    uuid: "",
    limit: -1
  };

  async created() {
    this.recordsOptions.uuid = this.$router.currentRoute.params.id;
    recordModule.getPatientRecordByUuid(this.recordsOptions).then(() => {
      this.update();
    });
    // Initial
    this.text = "left";
  }

  color(status) {
    return MEASUREMENT_COLORS[status];
  }

  async update() {
    let measurementName = "systolic";
    if (this.selected.length) {
      measurementName = this.selected[0].name_en;
    }
    console.log(this.mearsumentAt);
    await this.resetChart();
    this.getDataByCategory(measurementName);
    this.updataChart();
  }

  updataChart() {
    this.series = [
      {
        name: "目前測量值",
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
        width: [3, 3, 3, 5],
        curve: "straight"
        // colors: ['#EF5350', '#2196F3', '#EF5350']
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 10
        }
      },
      grid: {
        borderColor: "#f1f1f1"
      },
      colors: [
        MEASUREMENT_COLORS[0],
        MEASUREMENT_COLORS[1],
        MEASUREMENT_COLORS[2]
      ]
    };
  }

  resetChart() {
    this.mearsumentValue = [];
    this.mearsumentGoodValue = [];
    this.mearsumentWarningValue = [];
    this.mearsumentBadValue = [];
  }

  async getDataByCategory(name: string) {
    const data = this.items.filter(data => data.key === name);
    this.mearsumentAt = data.map(d =>
      d.measure_at.replace("下午", "").replace("上午", "")
    );
    this.mearsumentValue = data.map(d => d.value);
    console.log(this.mearsumentValue);

    // GOOD
    this.STATUS_GOOD = this.measurementTypes[name].rule.find(r => {
      return r.result === MEASUREMENT_STATUS.GOOD;
    });

    if (this.STATUS_GOOD) {
      this.mearsumentGoodValue = data.map(() => this.STATUS_GOOD.value);
      console.log("STATUS_GOOD");
      console.log(this.STATUS_GOOD);
    }

    // WARNING
    this.STATUS_WARNING = this.measurementTypes[name].rule.find(r => {
      return r.result === MEASUREMENT_STATUS.WARNING;
    });
    if (this.STATUS_WARNING) {
      this.mearsumentWarningValue = data.map(() => this.STATUS_WARNING.value);
      console.log("STATUS_WARNING");
      console.log(this.STATUS_WARNING);
    }

    // BAD
    this.STATUS_BAD = this.measurementTypes[name].rule.find(r => {
      return r.result === MEASUREMENT_STATUS.BAD;
    });
    if (this.STATUS_BAD) {
      this.mearsumentBadValue = data.map(() => this.STATUS_BAD.value);
      console.log("STATUS_BAD");
      console.log(this.STATUS_BAD);
    }
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  cancel() {
    this.$router.push({ name: "病人紀錄" });
  }

  get items() {
    return recordModule.items;
  }

  get measurementTypes() {
    return recordModule.measurementTypes;
  }

  get loading() {
    return appModule.loading;
  }
}
</script>
