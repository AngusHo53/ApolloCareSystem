
<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card style='margin-bottom:10px'>
        <v-card-title>
          <v-toolbar flat>
            <!-- <div class='blue rounded-circle d-inline-flex pa-2' style='width:16px;height:16px;'></div> -->
            <v-toolbar-title class='text-h4 pa-2 ont-weight-bold '>最新測量記錄</v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text v-if="patient && patient.user">
          <v-row>
            <v-col
              cols="3"
              md="3"
              lg="3"
            >
            <v-subheader>基本資訊</v-subheader>
            <v-list>
                <v-list-item >
                  <v-list-item-content :class="['font-weight-bold text-h6']">姓名: </v-list-item-content>
                  <v-list-item-content :class="['text-left text-h6']">{{patient.user.name}}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">ID: </v-list-item-content>
                  <v-list-item-content :class="['text-h6']">{{patient.user.iid}}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">性別: </v-list-item-content>
                  <v-list-item-content :class="['text-h6']" >{{patient.user.gender}}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">生日: </v-list-item-content>
                  <v-list-item-content :class="['text-h6']" >{{patient.user.birthday}}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="['font-weight-bold text-h6']">電話: </v-list-item-content>
                  <v-list-item-content :class="['text-h6']" >{{patient.user.phone}}</v-list-item-content>
                </v-list-item>
            </v-list>
            </v-col>
            <v-col >
              <v-tabs
                v-model="measureTab"
                centered
                background-color="blue"
                dark
                grow>
              <v-tab
                v-for="item  in measureItem"
                :key="item.name_zn">
                {{ item.name_ch }}
              </v-tab>
            </v-tabs>
              <v-tabs-items v-model="measureTab">
                <v-tab-item
                  v-for="(item) in measureItem"
                  :key="item.name_zn"
                >
                  <v-card
                    color="basil"
                    flat
                  >
                  <v-card-title>
                  </v-card-title>
                  <template v-for="(data, name) in patient.record[item.name_zn]">
                    <v-card-text :key='name'>
                      <MeasureCard :header="data.name.zh" :normalRange="data.normalRange" :measure_at="data.measure_at" :unit="data.unit" :value='data.value' ></MeasureCard>
                    </v-card-text>
                  </template>
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
        <Table  :headers="headers" :items="items" :pagination="pagination" :loading="loading" :options="recordsOptions" @updateTableData = "updateTableData" ></Table>
      </v-card-text>
    </v-card>
    </v-flex>
  <!-- <v-overlay  :value="loading"></v-overlay> -->
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
import { recordModule } from '@/store/modules/records';

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
                { name_zn: 'blood_glucose1',
                name_ch: '血糖1'},
                { name_zn: 'blood_glucose2',
                name_ch: '血糖2'}]
  headers = [
    // {
    //   text: '量測時間',
    //   left: true,
    //   sortable: false,
    //   value: 'updated_at'
    // },
    // { text: '血壓',sortable: false, value: 'blood_pressure' },
    // { text: '血糖',sortable: false, value: 'blood_glucose' },
    //  { text: '體溫',sortable: false, value: 'body_temperature' },
    // { text: '心跳',sortable: false, value: 'heart_beat' },
    // { text: '握力',sortable: false, value: 'grip' },
    // { text: '五次坐站(秒)',sortable: false, value: 'ftsst' },
    // { text: '走路速度(公尺/秒)',sortable: false, value: 'walkspeed' },
    // { text: '走路時間(秒)',sortable: false, value: 'walktime' }
    { text: '類別',sortable: false, value: 'category' },
    { text: '測量時間',sortable: false, value: 'measure_at' },
    { text: '型態',sortable: false, value: 'type' },
    { text: '值',sortable: false, value: 'value' }
  ];

  recordsOptions = {
      page: 1,
      q: '',
      order: 'asc',
      sort: '',
      uuid: ''
  }

  async created() {
    this.recordsOptions.uuid = this.$router.currentRoute.params.id;
    patientModule.getPatientByUuid(this.recordsOptions.uuid);
    this.updateTableData();
  }

  updateTableData() {
    recordModule.clearRecords();
    
    this.recordsOptions.page = this.pagination.page;
    recordModule.getPatientRecordByUuid(this.recordsOptions);
  }
  
  test() {

  }
  
  get pagination() {
    return recordModule.pagination;
  }

  get patient() {
    return patientModule.patient;
  }

 get loading() {
    return recordModule.loading;
  }

  get items() {
    return recordModule.items;
  }

  get totalRecords() {
    return recordModule.totalRecords;
  }

}
</script>