<template>
  <v-container fluid>
    <v-card v-if="!loading">
      <v-card-title class="indigo white--text">圖表</v-card-title>
      <v-row class="pa-4" justify="space-between">
        <v-col cols="2">
          <v-card-text>
            <v-treeview
              activatable
              open-on-click
              :multiple-active="false"
              transition
              :items="measureType"
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

        <v-col cols="10">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="text" tile color="deep-purple accent-3" group>
              <v-btn value="left">一周</v-btn>
              <v-btn value="center">一個月</v-btn>

              <v-btn value="right">半年</v-btn>

              <v-btn value="justify">一年</v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
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
import colors from "vuetify/es5/util/colors";
import { recordModule } from "@/store/modules/records";
import { MEASUREITEM } from "@/utils/store-util";

Vue.use(VueApexCharts);
@Component({
  components: {
    VueApexCharts
  }
})
export default class RecordChart extends Vue {
  text;
  loading = true;
  chartOptions;
  series;
  mearsumentAt = [];
  mearsumentValue = [];
  mearsumentMaxValue = [];
  mearsumentMinValue = [];
  selected = [];

  measureType = MEASUREITEM;

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

  update() {
    if (!this.selected.length) this.getDataByCategory("metabolic");
    else this.getDataByCategory(this.selected[0].name);
    this.updataChart();
  }

  updataChart() {
    this.series = [
      {
        name: "標準最高值",
        data: this.mearsumentMaxValue
      },
      {
        name: "值",
        data: this.mearsumentValue
      },
      {
        name: "標準最低值",
        data: this.mearsumentMinValue
      }
    ];
    this.chartOptions = {
      xaxis: {
        type: "datetime",
        categories: this.mearsumentAt

        // [
        //   "2019-01-01",
        //   "2019-01-02",
        //   "2019-01-03",
        //   "2019-01-04",
        //   "2019-01-05",
        //   "2019-01-06",
        //   "2019-01-07"
        // ]
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
        width: [3, 5, 3],
        curve: "straight",
        dashArray: [10, 0, 10]
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
      }
    };
    this.loading = false;
  }

  async getDataByCategory(name: string) {
    const data = this.items.filter(data => data.key === name);
    this.mearsumentAt = data.map(d => d.measure_at.replace("下午", ""));
    this.mearsumentValue = data.map(d => d.value);
    this.mearsumentMaxValue = data.map(d => 100);
    this.mearsumentMinValue = data.map(d => 20);
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  get items() {
    return recordModule.items;
  }
}
</script>
