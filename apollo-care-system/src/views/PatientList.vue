<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar-title>個案名單 {{ totalPatients ? '(' + totalPatients + ')' : '' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <div>
            <v-btn class="blue darken-2 mr-2" fab small dark @click.native="createPatient()">
              <v-awesome-icon icon="user-plus" size="lg" />
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            flat
            solo-inverted
            hide-details
            v-model="patientOptions.q"
            append-icon="mdi-magnify"
            label="關鍵字搜尋"
            @keyup.enter="updateTableData()"
          ></v-text-field>
          <v-data-table
            item-key="patients.iid"
            :headers="headers"
            :items="items"
            :page.sync="patientOptions.page"
            :items-per-page="pagination.rowsPerPage"
            :options="patientOptions"
            hide-default-footer
            :loading="loading"
            loading-text="請稍候..."
          >
            <template v-slot:item.phone="{item}">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn fab class="indigo mr-2" color="primary" small dark v-bind="attrs" v-on="on">
                    <v-awesome-icon icon="phone" size="lg" />
                  </v-btn>
                </template>
                <span>{{item.phone}}</span>
              </v-tooltip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn fab class="indigo mr-2" small dark @click="changeToPatientRecordPage(item)">
                <v-awesome-icon icon="user" size="lg" />
              </v-btn>
              <v-btn fab class="teal mr-2" small dark @click="edit(item)">
                <v-awesome-icon icon="edit" size="lg" />
              </v-btn>
              <v-btn fab class="cyan" small @click="remove(item)">
                <v-awesome-icon icon="trash" size="lg" />
              </v-btn>
            </template>
          </v-data-table>
          <div class="text-xs-center pt-2">
            <v-pagination
              v-model="patientOptions.page"
              :length="pagination.pages"
              :total-visible="9"
              @input="updateTableData()"
              circle
            ></v-pagination>
          </div>
        </v-card-text>
      </v-card>
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">個案資料修改</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="姓名" v-model="editItem.name"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="身份證字號" disabled v-model="editItem.iid"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="4">
                  <v-select :items="['男', '女']" label="性別" v-model="editItem.gender"></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field label="年齡" v-model="editItem.age"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="4">
                  <v-menu
                    ref="menu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editItem.birthday"
                        label="生日"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="editItem.birthday" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dateMenu = false">取消</v-btn>
                      <v-btn text color="primary" @click="$refs.menu.save(editItem.birthday)">確認</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="電話"
                    prefix="(+886)"
                    v-model="editItem.phone"
                    hint="電話號碼請省略0"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field label="信箱" disabled v-model="editItem.email"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select :items="place.branch_name" label="地區" v-model="editItem.place"></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeEdit()">取消</v-btn>
            <v-btn color="blue darken-1" text @click="saveEdit()">儲存</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-container>
</template>
<script lang="ts">
import { Patient, PatientInfo } from "@/types";
import { Component, Watch } from "vue-property-decorator";
import Vue from "vue";
import { appModule } from "@/store/modules/app";
import { placeModule } from "@/store/modules/place";
import {
  getDefaultPagination,
  getPagination,
  GENDER
} from "@/utils/store-util";
import http from "@/http/axios";

@Component
export default class PatientList extends Vue {
  public loading = true;
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
    { text: "信箱", sortable: false, value: "email" },
    { text: "其他操作", value: "actions", sortable: false }
  ];

  public place = {
    branch_name: [],
    index: [],
    shortcode: []
  };

  // get place(){
  //   return placeModule.place;
  // }

  public editDialog = false;
  public pagination = getDefaultPagination();
  public totalPages = 0;
  public currentPage = 1;
  public patients: Patient[] = [];
  public totalPatients = 0;
  public items: PatientInfo[] = [];
  public editItem = {
    age: 0,
    birthday: "",
    created_at: "",
    gender: "",
    health_state: 0,
    iid: 0,
    id_card: "",
    name: "",
    phone: "",
    updated_at: "",
    uuid: "",
    email: "",
    place: ""
  };
  private dateMenu = false;
  private date = new Date().toISOString().substr(0, 10);
  private patientOptions = {
    page: 1,
    q: "",
    order: "asc",
    sort: ""
  };

  private lastSearch = "";

  async created() {
    this.setPagination(getDefaultPagination());
    await this.updateTableData();
    placeModule.placeList();
    await this.getPlaceList();
  }

  async destroyed() {
    await this.clearPatient();
  }

  async updateTableData() {
    this.loading = true;
    this.clearPatient();
    if (!this.loading) {
      if (this.patientOptions.q !== this.lastSearch) {
        this.patientOptions.page = 1;
        this.lastSearch = this.patientOptions.q;
      }
    }

    const result = await http.get(
      `/user?q=${this.patientOptions.q}&page=${this.patientOptions.page}&limit=10&role=Patient`
    );
    if (result) {
      const data = result.data.data;
      this.totalPatients = data.total_users;
      this.totalPages = data.total_page;
      this.patients = data.users;
      this.currentPage = this.patientOptions.page;
      // Extract Table Data
      await this.extractPatientInfo(data.users);
      const pagination = getPagination(
        this.items,
        this.totalPages,
        this.currentPage
      );
      this.setPagination(pagination);
      this.loading = false;
    } else {
      console.error(result);
    }
  }

  async extractPatientInfo(patients: Patient[]) {
    patients.forEach(element => {
      if (element.user) {
        console.log()
        const len = element.user.name.length;
        switch (len) {
          case 2:
            element.user.name = element.user.name.substring(0, 1) + "◯";
            break;
          case 3:
            element.user.name =
              element.user.name.substring(0, 1) +
              "◯" +
              element.user.name.substring(2, 3);
            break;
          case 4:
            element.user.name =
              element.user.name.substring(0, 1) +
              "◯◯" +
              element.user.name.substring(3, 4);
            break;
          default:
            element.user.name = element.user.name.substr(0, 3) + "◯".repeat(len-6) + element.user.name.substr(len-3, 3);
            break;
        }

        element.user.iid = element.user.iid.substring(0, 3) + "*****" + element.user.iid.substring(8, 10);

        element.user.gender = GENDER[element.user.gender];
        this.items.push(element.user);
      }
    });
  }

  setPagination(pagination) {
    this.pagination = pagination;
  }

  createPatient() {
    this.$router.push("newPatient");
  }

  clearPatient() {
    this.patients = [];
    this.items = [];
    this.totalPages = 0;
    this.totalPatients = 0;
    this.pagination = getDefaultPagination();
  }

  changeToPatientRecordPage(item) {
    this.$router.push({
      name: `個案紀錄`,
      params: {
        id: item.uuid
      }
    });
  }

  edit(item: PatientInfo[]) {
    this.editDialog = true;
    this.editItem = JSON.parse(JSON.stringify(item));
    this.codetoPlace(item);
  }

  async getPlaceList() {
    const result = await http.get(`/place`);
    if (result) {
      for (let i = 0; i < result.data.data.place.length; i++) {
        this.place.branch_name.push(result.data.data.place[i].branch_name);
        this.place.index.push(result.data.data.place[i].index);
        this.place.shortcode.push(result.data.data.place[i].shortcode);
      }
    } else {
      console.error(result.data.status);
    }
  }

  codetoPlace(item) {
    if (item.place !== null) {
      const pCode = item.place.split(",");
      for (let i = 0; i < this.place.branch_name.length; i++) {
        if (this.place.shortcode[i] == pCode[0]) {
          if (this.place.index[i] == pCode[1]) {
            this.editItem.place = this.place.branch_name[i];
          }
        }
      }
    } else return;
  }

  placetoCode() {
    if (this.editItem.place != null) {
      for (let i = 0; i < this.place.branch_name.length; i++) {
        if (this.editItem.place == this.place.branch_name[i]) {
          this.editItem.place =
            this.place.shortcode[i] + "," + this.place.index[i];
        }
      }
    } else return;
  }

  closeEdit() {
    this.editItem = {
      age: 0,
      birthday: "",
      created_at: "",
      gender: "",
      health_state: 0,
      iid: 0,
      id_card: "",
      name: "",
      phone: "",
      updated_at: "",
      uuid: "",
      email: "",
      place: ""
    };
    this.editDialog = false;
  }

  async saveEdit() {
    if (this.editItem.gender === "1") this.editItem.gender = "男";
    else if (this.editItem.gender === "2") this.editItem.gender = "女";

    this.editItem.phone = "+886" + this.editItem.phone;
    await this.placetoCode();

    const params = {
      age: this.editItem.age,
      gender: this.editItem.gender,
      name: this.editItem.name,
      phone: this.editItem.phone,
      place: this.editItem.place
    };

    const result = await http.put("/user/" + this.editItem.uuid, params);
    if (result) {
      if (result.data.status === "Success") {
        appModule.sendSuccessNotice("修改成功");
      } else {
        appModule.sendErrorNotice("修改失敗");
      }
    } else {
      console.error(result.data.status);
    }
    this.closeEdit();
    // location.reload();
  }

  @Watch("patientOptions.q")
  watchSearch(newVal, oldVal) {
    if (newVal != oldVal && newVal == "") {
      this.updateTableData();
    }
  }
}
</script>
