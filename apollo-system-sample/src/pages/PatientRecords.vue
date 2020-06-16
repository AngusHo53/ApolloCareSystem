
<template>
  <v-container fluid v-if='loading === false || patient'>
     <v-tabs
      v-model="tab"
      background-color="indigo"
      dark
    >
     <v-tab
        v-for="item in tab_items"
        :key="item.tab"
      >
        {{ item.content }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        :key="'patientInfo'"
      >
        <v-container fluid grid-list-sm>
          <v-row
          >
            <v-col
              cols="12"
              md="4"
            >
              <v-img
                src="/assets/img/avatar1.png"
                lazy-src="https://picsum.photos/id/11/100/60"
                aspect-ratio="1"
                class="grey lighten-2"
                max-width="480"
                max-height="320"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
            <v-flex md6 sm12 class="mx-1 px-0">
              <v-text-field
                name="姓名"
                label="姓名"
                value="Victor"
                class="input-group--focused"
                readonly
                ></v-text-field>
            </v-flex>
            <v-flex md6 sm12 class="mx-1 px-0">
                <v-text-field
                name="ID"
                label="ID"
                value="D0444074566"
                class="input-group--focused"
                readonly
                ></v-text-field>
            </v-flex>
            <v-flex md6 sm12 class="mx-1 px-0">
                <v-text-field
                name="性別"
                label="性別"
                value="男"
                class="input-group--focused"
                readonly
                ></v-text-field>
            </v-flex>
            <v-flex md6 sm12 class="mx-1 px-0">
                <v-text-field
                name="生日"
                label="生日"
                value="2020/08/27"
                class="input-group--focused"
                readonly
                ></v-text-field>
            </v-flex>
            <v-flex md6 sm12 class="mx-1 px-0">
                <v-text-field
                name="電話"
                label="電話"
                value="0983154789"
                class="input-group--focused"
                readonly
                ></v-text-field>
            </v-flex>
             <v-flex md6 sm12 class="mx-1 px-0">
                <v-text-field
                name="地址"
                label="地址"
                value="台中市西屯區"
                class="input-group--focused"
                readonly
                ></v-text-field>
            </v-flex>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item
        :key="'records'"
      >
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
            <Table v-if="loading === false" loading loading-text="Loading... Please wait" :headers="headers" :items="records" :pagination="pagination"></Table>
          </v-card>
        </v-flex>
      </v-tab-item>
    </v-tabs-items>
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

@Component({
  components: {
    Table,
    TableHeaderButtons,
    SearchPanel,
    ConfirmDialog
  }
})
export default class PatientRecords extends Vue {
  dialog = false;
  singleExpand = false;
  expanded= [];
  patientInfo = {};
  tab = null;
  tab_items = [
    { tab: 'patientInfo', content: '病人資訊' },
    { tab: 'records', content: '病人歷史紀錄' },
  ];
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