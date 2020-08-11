<template>
  <v-container fluid>
      <v-card v-if='!loading'>
        <v-card-title>
            圖表
            <v-spacer></v-spacer>
            <v-btn-toggle
                v-model="text"
                tile
                color="deep-purple accent-3"
                group
                >
                <v-btn value="left">
                    一周
                </v-btn>
                <v-btn value="center">
                    一個月
                </v-btn>

                <v-btn value="right">
                    半年
                </v-btn>

                <v-btn value="justify">
                    一年
                </v-btn>
            </v-btn-toggle>
        </v-card-title>
        <v-card-text>
            <VueApexCharts :height="300" :type="'line'" :options="chartOptions" :series="series"/>
        </v-card-text>
      </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import VueApexCharts from "vue-apexcharts";
import colors from 'vuetify/es5/util/colors';
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
    async created() {
        this.text = 'left';

        this.series = [
            {
                name: "標準最高值",
                data: [100, 100, 100, 100, 100, 100, 100]
            },
            {
                name: "值",
                data:  [25, 40, 60, 0, 110, 23, 45]
            },
            {
                name: "標準最低值",
                data: [10, 10, 10, 10, 10, 10, 10]
            }
        ];
        this.chartOptions = {
            xaxis: {
                type: "datetime",
                categories: [
                    "2019-01-01",
                    "2019-01-02",
                    "2019-01-03",
                    "2019-01-04",
                    "2019-01-05",
                    "2019-01-06",
                    "2019-01-07"
                ]
            },
            yaxis: {
                labels: {
                    minWidth: 10
                },
                min: 0,
                max: 120,
            },
            zoom: {
                enabled: false
            },
            dataLabels: {
            enabled: false
            },
            stroke: {
                width: [3, 5, 3],
                curve: 'straight',
                dashArray: [10, 0, 10],
                // colors: ['#EF5350', '#2196F3', '#EF5350']
            },
            markers: {
                size: 0,
                hover: {
                    sizeOffset: 10
                }
            },
            grid: {
                borderColor: '#f1f1f1',
            }
        };
        this.loading = false;
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


</script>
