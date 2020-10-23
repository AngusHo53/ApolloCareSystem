<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar-title>{{paramedic_name}}負責個案 {{ totalPatient ? '(' + totalPatient + ')' : '' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-col cols="12" md="2">
            <v-btn class="mb-3 blue white--text" @click="addDialog()">新增個案</v-btn>
          </v-col>-->
          <v-col cols="12" md="2">
            <v-btn class="mb-3 red white--text" @click="removeDialog()">移除個案</v-btn>
          </v-col>
        </v-card-title>
        <v-card-text>
          <v-text-field
            clearable
            flat
            solo-inverted
            hide-details
            v-model="search"
            append-icon="mdi-magnify"
            label="關鍵字搜尋"
          ></v-text-field>
          <v-data-table
            v-model="modify_items"
            item-key="iid"
            :headers="headers"
            :items="patient_items"
            :loading="loading"
            loading-text="請稍後..."
            :search="search"
            show-select
            :single-select="false"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn fab class="indigo mr-2" small dark @click="changeToPatient(item)">
                <v-awesome-icon icon="user" size="lg" />
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-if="modify_items" v-model="remove_dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">移除個案({{modify_items.length}})</span>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-list-item two-line v-for="item in modify_items" :key="item.iid">
            <v-list-item-avatar class="grey lighten-1 white--text">
              <v-awesome-icon icon="user" size="lg" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>名稱: {{item.name}}</v-list-item-title>
              <v-list-item-subtitle>身份證字號: {{item.iid}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">取消</v-btn>
          <v-btn color="blue darken-1" text @click="save">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="modify_items" v-model="add_dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">新增個案({{modify_items.length}})</span>
        </v-card-title>
        <v-card-text>
          <v-divider></v-divider>
          <v-list-item two-line v-for="item in modify_items" :key="item.iid">
            <v-list-item-avatar class="grey lighten-1 white--text">
              <v-awesome-icon icon="user" size="lg" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>名稱: {{item.name}}</v-list-item-title>
              <v-list-item-subtitle>身份證字號: {{item.iid}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">取消</v-btn>
          <v-btn color="blue darken-1" text @click="save">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import { Patient, PatientInfo } from "@/types";
import { GENDER } from "@/utils/store-util";
import { Component } from "vue-property-decorator";
import Vue from "vue";
import http from "@/http/axios";
import { appModule } from "@/store/modules/app";

@Component
export default class ParamedicCharge extends Vue {
  public loading = true;
  public search = "";
  public paramedic_name = "";
  public paramedic_id = "";
  public headers = [
    {
      text: "名稱",
      left: true,
      sortable: false,
      value: "name"
    },
    { text: "身份證字號", sortable: false, value: "iid" },
    { text: "性別", sortable: false, value: "gender" },
    { text: "年齡", sortable: false, value: "age" },
    { text: "生日", sortable: false, value: "birthday" },
    { text: "電話", sortable: false, value: "phone" },
    { text: "信箱", sortable: false, value: "email" }
  ];
  public patient: PatientInfo[] = [];
  public patient_items: PatientInfo[] = [];
  public modify_items = [
    {
      iid: "",
      name: ""
    }
  ];
  public totalPatient = 0;

  public remove_dialog = false;
  public add_dialog = false;
  public dialogTitle = "";

  async created() {
    this.paramedic_name = this.$route.params.name;
    this.paramedic_id = this.$route.params.id;
    await this.updateTableData();
  }

  async destroyed() {
    await this.cleanPatient();
  }

  async updateTableData() {
    this.loading = true;
    const result = await http.get("/user/" + this.paramedic_id + "/patients");
    if (result) {
      if (result.data.status === "Success") {
        const data = result.data.data;
        this.patient = data.accounts;
        this.totalPatient = this.patient.length;
        this.patient.forEach(element => {
          if (element) {
            element.gender = GENDER[element.gender];
            this.patient_items.push(element);
          }
        });
        this.loading = false;
      } else {
        console.log("error");
      }
    } else {
      console.log("error");
    }
  }

  cleanPatient() {
    this.totalPatient = 0;
    this.patient = [];
    this.patient_items = [];
    this.modify_items = [];
  }

  removeDialog() {
    this.remove_dialog = true;
    this.dialogTitle = "移除個案";
  }

  addDialog() {
    this.add_dialog = true;
    this.dialogTitle = "新增個案";
  }

  showDialog(title) {
    this.remove_dialog = true;
    this.dialogTitle = title;
  }

  async modifyPatient() {
    const params = {
      add: [],
      remove: []
    };
    if (this.dialogTitle === "新增個案") {
      const add_id = [];
      this.modify_items.forEach(function(item) {
        add_id.push(item.iid);
      });
      params.add = add_id;
    } else {
      const remove_id = [];
      this.modify_items.forEach(function(item) {
        remove_id.push(item.iid);
      });
      params.remove = remove_id;
    }

    const result = await http.post(
      "/user/" + this.paramedic_id + "/patients",
      params
    );
    if (result) {
      location.reload();
      appModule.sendSuccessNotice("變更成功");
    } else {
      appModule.sendErrorNotice("變更失敗");
    }
  }

  close() {
    this.remove_dialog = false;
    this.add_dialog = false;
    // this.updateTableData();
  }

  public async save() {
    this.remove_dialog = false;
    this.add_dialog = false;
    this.modifyPatient();
  }
}
</script>
