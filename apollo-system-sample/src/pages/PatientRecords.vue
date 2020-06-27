
<template>
  <v-container fluid v-if='loading === false || patient'>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar flat>
            <v-toolbar-title>歷年紀錄</v-toolbar-title>
          </v-toolbar>
          <v-spacer></v-spacer>
            <div>
              <v-btn class="teal darken-2  mr-1" fab small dark @click.native="test()">
              <v-icon>mdi-printer</v-icon>
              </v-btn>
            </div>
        </v-card-title>
        <v-card-body>
      <v-row
      >
        <v-col
          cols="2"
          md="2"
          lg="2"
        >
        <v-list dense>
            <v-list-item>
              <v-list-item-content :class="['font-weight-bold']">姓名: </v-list-item-content>
              <v-list-item-content :class="['text-left']"
              >黃曉明
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content :class="[' font-weight-bold']">ID: </v-list-item-content>
              <v-list-item-content :class="['']">D0444074566</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content :class="[' font-weight-bold']">性別: </v-list-item-content>
              <v-list-item-content :class="['']" >男生</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content :class="[' font-weight-bold']">生日: </v-list-item-content>
              <v-list-item-content :class="['']" >2020/08/27</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content :class="[' font-weight-bold']">電話: </v-list-item-content>
              <v-list-item-content :class="['']" >0983154789</v-list-item-content>
            </v-list-item>
        </v-list>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="9"
        >
          <v-layout class="">
          <v-flex md4 xs12>
            <v-card light>
              <doughnut-chart></doughnut-chart>
            </v-card>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex md4 xs12>
              <v-card light>
                <bar-chart></bar-chart>
              </v-card>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex md4 xs12>
              <v-card light>
                <line-chart></line-chart>
              </v-card>
            </v-flex>
          </v-layout>
        </v-col>
      </v-row>
        <Table v-if="loading === false" loading loading-text="Loading... Please wait" :headers="headers" :items="records" :pagination="pagination" :options="options"></Table>
        </v-card-body>
      </v-card>
    </v-flex>
    <v-overlay  :value="loading"></v-overlay>
  </v-container>
</template>
<script>

import Table from '@/components/Table.vue';
import TableHeaderButtons from '@/components/TableHeaderButtons.vue'
import SearchPanel from '@/components/SearchPanel.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { patientModule } from '@/store/modules/patients';
import { appModule } from '@/store/modules/app';

import BarChart from "@/components/chart/Bar";
import DoughnutChart from "@/components/chart/Doughnut";
import LineChart from "@/components/chart/LineChart";

@Component({
  components: {
    Table,
    TableHeaderButtons,
    SearchPanel,
    ConfirmDialog,
    BarChart,
    DoughnutChart,
    LineChart
  }
})
export default class PatientRecords extends Vue {
  dialog = false;
  singleExpand = false;
  expanded= [];
  patientInfo = {};
  headers = [
    {
      text: '量測時間',
      left: true,
      sortable: false,
      value: 'updated_at'
    },
    { text: '血壓',sortable: false, value: 'blood_pressure' },
    { text: '血糖',sortable: false, value: 'blood_glucose' },
     { text: '體溫',sortable: false, value: 'body_temperature' },
    { text: '心跳',sortable: false, value: 'heart_beat' },
    { text: '握力',sortable: false, value: 'grip' },
    { text: '五次坐站(秒)',sortable: false, value: 'ftsst' },
    { text: '走路速度(公尺/秒)',sortable: false, value: 'walkspeed' },
    { text: '走路時間(秒)',sortable: false, value: 'walktime' }
  ];

  options = {
      page: 1,
      q: '',
      order: 'desc',
      sort: ''
  }

  pagination = {
    page: 1,
    totalItems: 0,
    rowsPerPage: 10,
    pages: 0
  };

  records = [
    {
      updated_at: '2020/6/9 下午2:24:56',
      blood_pressure: '150/88',
      blood_glucose: 103,
      ftsst:7.1,
      grip: 20,
      body_temperature: 36.6,
      heart_beat: 90,
      walkspeed: 1.25,
      walktime: 4.78
    },
    {
      updated_at: '2020/6/9 下午2:24:57',
      blood_pressure: '150/88',
      blood_glucose: 103,
      ftsst:7.1,
      grip: 20,
      body_temperature: 36.6,
      heart_beat: 90,
      walkspeed: 1.25,
      walktime: 4.78
    },{
      updated_at: '2020/6/9 下午2:24:58',
      blood_pressure: '150/88',
      blood_glucose: 103,
      ftsst:7.1,
      grip: 20,
      body_temperature: 36.6,
      heart_beat: 90,
      walkspeed: 1.25,
      walktime: 4.78
    },
    {
      updated_at: '2020/6/9 下午2:24:59',
      blood_pressure: '150/88',
      blood_glucose: 103,
      ftsst:7.1,
      grip: 20,
      body_temperature: 36.6,
      heart_beat: 90,
      walkspeed: 1.25,
      walktime: 4.78
    }
  ]

  async created() {
    console.log(this.loading);
    console.log(typeof this.loading);
    patientModule.getPatientById(this.$router.currentRoute.params.id);
    console.log(this.loading);
    this.patientInfo = this.patient;
    console.log(this.patientInfo);
  }
  
  test() {

  }
  

  get patient() {
    return patientModule.patient;
  }

  get loading() {
    return appModule.loading;
  }
}
</script>