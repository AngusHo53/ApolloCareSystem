<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar-title
            >個案名單
            {{
              totalPatients ? '(' + totalPatients + ')' : ''
            }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <div>
            <v-btn
              class="blue darken-2 mr-2"
              fab
              small
              dark
              @click.native="createPatient()"
            >
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
            <template v-slot:[`item.phone`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    class="indigo mr-2"
                    color="primary"
                    small
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-awesome-icon icon="phone" size="lg" />
                  </v-btn>
                </template>
                <span>{{ item.phone }}</span>
              </v-tooltip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                fab
                class="indigo mr-2"
                small
                dark
                @click="changeToPatientRecordPage(item)"
              >
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
                  <v-text-field
                    label="姓名"
                    v-model="editItem.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="身份證字號"
                    disabled
                    v-model="editItem.iid"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="4">
                  <v-select
                    :items="['男', '女']"
                    label="性別"
                    v-model="editItem.gender"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="年齡"
                    v-model="editItem.age"
                  ></v-text-field>
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
                    <v-date-picker
                      v-model="editItem.birthday"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dateMenu = false"
                        >取消</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(editItem.birthday)"
                        >確認</v-btn
                      >
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
                  <v-text-field
                    label="信箱"
                    disabled
                    v-model="editItem.email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="editItem.place"
                    :items="place"
                    item-text="branch_name"
                    item-value="branch_name"
                    label="地區"
                    persistent-hint
                    single-line
                  ></v-select>
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
import { PatientInfo } from '@/types';
import { Component, Watch } from 'vue-property-decorator';
import Vue from 'vue';
import { placeModule } from '@/store/modules/place';
import {
  getDefaultPagination,
  getDefaultPatientOptions,
} from '@/utils/store-util';
import { patientModule } from '../store/modules/patients';

@Component
export default class PatientList extends Vue {
  public headers = [
    {
      text: '名稱',
      left: true,
      sortable: false,
      value: 'name',
    },
    { text: '身份證字號', sortable: false, value: 'iid' },
    { text: '性別', sortable: false, value: 'gender' },
    { text: '年齡', sortable: false, value: 'age' },
    { text: '生日', sortable: false, value: 'birthday' },
    { text: '電話', sortable: false, value: 'phone' },
    { text: '信箱', sortable: false, value: 'email' },
    { text: '其他操作', value: 'actions', sortable: false },
  ];
  public editDialog = false;
  public editItem = {
    age: 0,
    birthday: '',
    created_at: '',
    gender: '',
    health_state: 0,
    iid: 0,
    id_card: '',
    name: '',
    phone: '',
    updated_at: '',
    uuid: '',
    email: '',
    place: '',
  };
  private dateMenu = false;
  private date = new Date().toISOString().substr(0, 10);
  private patientOptions = getDefaultPatientOptions();

  private lastSearch = '';

  get loading() {
    return patientModule.loading;
  }

  get place() {
    return placeModule.place;
  }

  get pagination() {
    return patientModule.pagination;
  }

  set pagination(pagination) {
    patientModule.setPagination(pagination);
  }

  get patients() {
    return patientModule.patients;
  }

  get totalPatients() {
    return patientModule.totalPatients;
  }

  get items() {
    return patientModule.items;
  }

  async created() {
    this.pagination = getDefaultPagination();
    await placeModule.placeList();
    await this.updateTableData();
  }

  async updateTableData() {
    if (!this.loading) {
      if (this.patientOptions.q !== this.lastSearch) {
        this.patientOptions.page = 1;
        this.lastSearch = this.patientOptions.q;
      }
    }
    patientModule.getPatientsByPages(this.patientOptions);
  }

  createPatient() {
    this.$router.push('newPatient');
  }

  changeToPatientRecordPage(item) {
    this.$router.push({
      name: `個案紀錄`,
      params: {
        id: item.uuid,
      },
    });
  }

  async edit(item: PatientInfo[]) {
    this.editDialog = true;
    this.editItem = JSON.parse(JSON.stringify(item));
    if (this.editItem.phone != null) {
      this.editItem.phone = this.editItem.phone.substring(
        4,
        this.editItem.phone.length
      );
    }
    this.editItem.place = await placeModule.codetoPlace(item);
  }

  closeEdit() {
    this.editItem = {
      age: 0,
      birthday: '',
      created_at: '',
      gender: '',
      health_state: 0,
      iid: 0,
      id_card: '',
      name: '',
      phone: '',
      updated_at: '',
      uuid: '',
      email: '',
      place: '',
    };
    this.editDialog = false;
  }

  async saveEdit() {
    if (this.editItem.gender === '男') this.editItem.gender = '1';
    else if (this.editItem.gender === '女') this.editItem.gender = '2';
    if (this.editItem.phone != null) {
      this.editItem.phone = '+886' + this.editItem.phone;
    }

    await placeModule.placetoCode(this.editItem);

    const params = {
      age: this.editItem.age,
      gender: this.editItem.gender,
      name: this.editItem.name,
      phone: this.editItem.phone,
      place: this.editItem.place,
    };

    const data = {
      uuid: this.editItem.uuid,
      params: params,
    };

    await patientModule.setPatientsInfo(data);
    this.closeEdit();
    await patientModule.getPatientsByPages(this.patientOptions);
  }

  @Watch('patientOptions.q')
  watchSearch(newVal, oldVal) {
    if (newVal != oldVal && newVal == '') {
      this.updateTableData();
    }
  }
}
</script>
