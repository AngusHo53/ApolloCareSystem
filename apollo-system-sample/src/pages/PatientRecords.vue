
<template>
  <v-container fluid v-if='loading === false || patient'>
    <v-flex xs12>
      <v-card style='margin-bottom:10px'>
        <v-card-title>
          <v-toolbar flat>
           <flex-row class='blue rounded-circle d-inline-flex pa-2' style='width:16px;height:16px;'></flex-row>
            <v-toolbar-title class='text-h4 pa-2 ont-weight-bold '>最新測量記錄</v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-tabs
          v-model="measureTab"
          background-color="transparent"
          color="basil"
          grow
        >
          <v-tab
            v-for="item in measureItem"
            :key="item"
          >
            {{ item.name_ch }}
          </v-tab>
        </v-tabs>
        <v-card-text>
          <v-row
          >
            <v-col
              cols="3"
              md="3"
              lg="3"
            >
            <v-subheader>基本資訊</v-subheader>
            <v-list>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">姓名: </v-list-item-content>
                  <v-list-item-content :class="['text-left text-h6']"
                  >黃曉明
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">編號: </v-list-item-content>
                  <v-list-item-content :class="['text-h6']">D0444074566</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">性別: </v-list-item-content>
                  <v-list-item-content :class="['text-h6']" >男</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">生日: </v-list-item-content>
                  <v-list-item-content :class="['text-h6']" >2020/08/27</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">電話: </v-list-item-content>
                  <v-list-item-content :class="['text-h6']" >0983154789</v-list-item-content>
                </v-list-item>
            </v-list>
            </v-col>
            <v-col >
        <v-tabs-items v-model="measureTab">
          <v-tab-item
            v-for="item in measureItem"
            :key="item"
          >
            <v-card
              color="basil"
              flat
            >
              <v-card-title>
                <v-toolbar flat>
                  <v-icon large>
                    mdi-pause
                  </v-icon>
                  <v-toolbar-title class='text-h4 pa-2'>{{item.name_ch}}</v-toolbar-title>
                </v-toolbar>
              </v-card-title>
              <v-card-text v-for="data in measureData[item.name_zn]" :key="data">
                <MeasureCard :header="data.header" :normalRange="data.normalRange" :value='data.value' ></MeasureCard>
              </v-card-text>
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
          <v-toolbar-title>歷年量測紀錄</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <Table v-if="loading === false" loading loading-text="Loading... Please wait" :headers="headers" :items="records" :pagination="pagination" :options="options"></Table>
    </v-card>
    </v-flex>
  <v-overlay  :value="loading"></v-overlay>
  </v-container>
</template>
<script>

import Table from '@/components/Table.vue';
import TableHeaderButtons from '@/components/TableHeaderButtons.vue'
import SearchPanel from '@/components/SearchPanel.vue';
import MeasureCard from '@/components/MeasureCard.vue';
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
    LineChart,
    MeasureCard
  }
})
export default class PatientRecords extends Vue {
  dialog = false;
  singleExpand = false;
  expanded= [];
  patientInfo = {};

  measureData={
    blood_pressure:[
      {
        header: '收縮壓',
        normalRange: [100, 120],
        value: 130
      },
      {
        header: '舒張壓',
        normalRange: [60, 80],
        value: 70
      },
      {
        header: '脈搏',
        normalRange: [50, 120],
        value: 70
      }
    ],
    blood_glucose:[
      {
        header: '血糖',
        normalRange: [20, 600],
        value: 400
      }
    ],
    metabolic:[
      {
        header: '身高',
        normalRange: [0, 250],
        value: 177
      },
      {
        header: '體重',
        normalRange: [2.5, 150],
        value: 80
      }
    ]
  }
  measureTab = null;
  measureItem = [{name_zn: 'blood_pressure',
                  name_ch: '血壓'},
                { name_zn: 'blood_glucose',
                  name_ch: '血糖'},
                { name_zn: 'metabolic',
                name_ch: '新陳代謝'},
                { name_zn: 'blood_glucose',
                name_ch: '血糖'},
                { name_zn: 'blood_glucose',
                name_ch: '血糖'}]
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