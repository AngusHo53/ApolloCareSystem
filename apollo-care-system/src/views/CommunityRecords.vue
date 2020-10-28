<template>
  <v-container fluid>
    <v-card style="margin-bottom:10px">
      <v-card-title>
        <span class="text-h4 mb-1 font-weight-black">{{communtiyName}}</span>
      </v-card-title>
      <v-spacer></v-spacer>
      <v-card-subtitle class="text-subtitle-1 font-weight-bold">
        <span>本月測量人數{{this_records.num}}人</span>
        <v-icon
          v-if="this_records.num > last_records.num"
          large
          color="red darken-2"
        >mdi-arrow-up-bold</v-icon>
        <v-icon
          v-if="this_records.num < last_records.num"
          large
          color="green darken-2"
        >mdi-arrow-down-bold</v-icon>
        <br />
        <span>上月測量人數{{last_records.num}}人</span>
      </v-card-subtitle>
      <v-tabs v-model="measureTab" background-color="transparent" color="basil" grow>
        <v-tab v-for="item in measureItem" :key="item.name_zn">{{ item.name_ch }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="measureTab">
        <v-tab-item v-for="item in measureItem" :key="item.name_zn" style="transition: none;">
          <v-card color="basil" flat>
            <v-card-title>
              <v-toolbar flat>
                <v-toolbar-title class="text-h5 mb-1 font-weight-black">{{item.name_ch}}</v-toolbar-title>
              </v-toolbar>
            </v-card-title>
            <v-row dense>
              <v-col v-for="data in measureType" :key="data.name_zn" :cols="6">
                <v-card>
                  <v-card-title v-text="data.name_ch"></v-card-title>
                  <v-card-text class="text-h4">
                    <span>{{this_records[item.name_zn][data.name_zn]}}</span>
                    <v-icon
                      v-if="this_records[item.name_zn][data.name_zn] > last_records[item.name_zn][data.name_zn]"
                      large
                      color="red darken-2"
                    >mdi-arrow-up-bold</v-icon>
                    <v-icon
                      v-if="this_records[item.name_zn][data.name_zn] < last_records[item.name_zn][data.name_zn]"
                      large
                      color="green darken-2"
                    >mdi-arrow-down-bold</v-icon>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <v-card style="margin-bottom:10px">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title class="text-h6 mb-1 font-weight-black">本月量測資料</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="teal darken-2 mr-2" fab small dark>
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-data-table :headers="p_headers" :items="p_items"></v-data-table>
    </v-card>
    <v-card>
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title class="text-h6 mb-1 font-weight-black">個案連續測量記錄</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="teal darken-2 mr-2" fab small dark>
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-col class="d-flex" cols="12" sm="3">
        <v-select
          :items="c_time"
          item-text="name_ch"
          item-value="name_zn"
          label="時間區間"
          v-model="c_select"
          @input="cTableList()"
          return-object
        ></v-select>
      </v-col>
      <v-data-table :headers="c_headers" :items="c_items"></v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import http from "@/http/axios";
import { appModule } from "@/store/modules/app";

@Component({
  components: {}
})
export default class CommunityRecords extends Vue {
  private loading = false;
  public communtiyName = "";
  public errorMsg = "";
  public search = "";
  public page = 1;
  public itemsPerPage = 6;
  private customerId = "";
  private query = "";
  private name = null;
  private measureTab = null;
  private itemId = -1;
  private c_select = { name_zn: "oneMonth", name_ch: "連續一個月" };
  private c_time = [
    { name_zn: "oneMonth", name_ch: "連續一個月" },
    { name_zn: "threeMonth", name_ch: "連續三個月" },
    { name_zn: "sixMonth", name_ch: "連續六個月" },
    { name_zn: "year", name_ch: "連續一年" }
  ];
  private measureItem = [
    { name_zn: "systolic", name_ch: "收縮壓" },
    { name_zn: "diastolic", name_ch: "舒張壓" },
    { name_zn: "pulse", name_ch: "脈搏" },
    { name_zn: "ftsst", name_ch: "五次坐站" },
    { name_zn: "walkspeed", name_ch: "走路速度" },
    { name_zn: "grip", name_ch: "握力" }
  ];

  private measureType = [
    { name_zn: "avg", name_ch: "平均數" },
    { name_zn: "SD", name_ch: "標準差" },
    { name_zn: "Q1", name_ch: "四分位差Q1" },
    { name_zn: "Q3", name_ch: "四分位差Q3" }
  ];
  private last_records = {
    systolic: { avg: 20, SD: 30, Q1: 5, Q3: 5 },
    diastolic: { avg: 10, SD: 50, Q1: 50, Q3: 50 },
    pulse: { avg: 50, SD: 50, Q1: 50, Q3: 50 },
    ftsst: { avg: 50, SD: 50, Q1: 50, Q3: 50 },
    walkspeed: { avg: 50, SD: 50, Q1: 50, Q3: 50 },
    grip: { avg: 50, SD: 50, Q1: 50, Q3: 50 },
    num: 23
  };

  private this_records = {
    systolic: { avg: 10, SD: 12, Q1: 9, Q3: 10 },
    diastolic: { avg: 10, SD: 5, Q1: 50, Q3: 50 },
    pulse: { avg: 50, SD: 50, Q1: 50, Q3: 50 },
    ftsst: { avg: 50, SD: 50, Q1: 50, Q3: 50 },
    walkspeed: { avg: 50, SD: 50, Q1: 50, Q3: 50 },
    grip: { avg: 50, SD: 50, Q1: 50, Q3: 50 },
    num: 20
  };

  private p_headers = [
    { text: "個案姓名", sortable: false, value: "name" },
    { text: "收縮壓", sortable: false, value: "systolic" },
    { text: "舒張壓", sortable: false, value: "diastolic" },
    { text: "脈搏", sortable: false, value: "pulse" },
    { text: "五次坐站", sortable: false, value: "ftsst" },
    { text: "走路速度", sortable: false, value: "walkspeed" },
    { text: "握力", sortable: false, value: "grip" }
  ];

  private c_headers = [
    { text: "個案姓名", sortable: false, value: "name" },
    { text: "身分證字號", sortable: false, value: "iid" },
    { text: "年齡", sortable: false, value: "age" },
    { text: "性別", sortable: false, value: "gender" }
  ];

  private p_items = [
    {
      name: "黃",
      systolic: 85,
      diastolic: 120,
      pulse: 80,
      ftsst: 4,
      walkspeed: 6,
      grip: 120
    },
    {
      name: "黃",
      systolic: 85,
      diastolic: 120,
      pulse: 80,
      ftsst: 4,
      walkspeed: 6,
      grip: 120
    },
    {
      name: "黃",
      systolic: 85,
      diastolic: 120,
      pulse: 80,
      ftsst: 4,
      walkspeed: 6,
      grip: 120
    },
    {
      name: "黃",
      systolic: 85,
      diastolic: 120,
      pulse: 80,
      ftsst: 4,
      walkspeed: 6,
      grip: 120
    },
    {
      name: "黃",
      systolic: 85,
      diastolic: 120,
      pulse: 80,
      ftsst: 4,
      walkspeed: 6,
      grip: 120
    },
    {
      name: "黃",
      systolic: 85,
      diastolic: 120,
      pulse: 80,
      ftsst: 4,
      walkspeed: 6,
      grip: 120
    }
  ];

  private c_items = [];

  cTableList() {
    console.log(this.c_select.name_zn);
    if (this.c_select.name_zn == "oneMonth") {
      console.log("一個月");
      this.c_items = [
        {
          name: "黃",
          iid: 123,
          age: 20,
          gender: "男"
        },
        {
          name: "王",
          iid: 456,
          age: 30,
          gender: "女"
        }
      ];
    } else if (this.c_select.name_zn == "threeMonth") {
      console.log("三個月");
      this.c_items = [
        {
          name: "黃",
          iid: 123,
          age: 20,
          gender: "男"
        },
        {
          name: "王",
          iid: 456,
          age: 30,
          gender: "女"
        },
        {
          name: "陳",
          iid: 789,
          age: 40,
          gender: "男"
        },
        {
          name: "何",
          iid: 2234,
          age: 45,
          gender: "男"
        }
      ];
    } else if (this.c_select.name_zn == "sixMonth") {
      console.log("六個月");
      this.c_items = [
        {
          name: "黃",
          iid: 123,
          age: 20,
          gender: "男"
        },
        {
          name: "王",
          iid: 456,
          age: 30,
          gender: "女"
        },
        {
          name: "陳",
          iid: 789,
          age: 40,
          gender: "男"
        },
        {
          name: "何",
          iid: 2234,
          age: 45,
          gender: "男"
        },
        {
          name: "李",
          iid: 1234,
          age: 43,
          gender: "女"
        }
      ];
    } else {
      console.log("一年");
      this.c_items = [
        {
          name: "黃",
          iid: 123,
          age: 20,
          gender: "男"
        },
        {
          name: "王",
          iid: 456,
          age: 30,
          gender: "女"
        },
        {
          name: "陳",
          iid: 789,
          age: 40,
          gender: "男"
        },
        {
          name: "何",
          iid: 2234,
          age: 45,
          gender: "男"
        },
        {
          name: "李",
          iid: 1234,
          age: 43,
          gender: "女"
        },
        {
          name: "王",
          iid: 2324,
          age: 23,
          gender: "男"
        }
      ];
    }
  }
  created() {
    const param = this.$route.params.name;
    this.communtiyName = param;
    this.cTableList();
  }



  mounted() {}
}
</script>
