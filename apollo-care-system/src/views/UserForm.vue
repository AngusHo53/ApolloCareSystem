<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8" lg="6">
        <v-flex xs12>
          <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
          <v-card class="lighten-4 elevation-0">
            <v-card-title class="title">
              <v-icon>mdi-account</v-icon>
              {{ title }}
              <v-spacer></v-spacer>
              <v-btn fab small dark class="grey mr-2" @click.native="cancel()">
                <v-awesome-icon icon="times-circle" size="lg" />
              </v-btn>
            </v-card-title>
            <v-card-text v-if="patientFormData">
              <v-container fluid grid-list-sm>
                <v-layout row wrap>
                  <v-flex md3 sm12>
                    <v-img small max-width="20em" :src="avatar" class="avatar" :srcset="avatar" />
                  </v-flex>
                  <v-flex md9 sm12>
                    <v-container fluid grid-list-sm>
                      <v-layout row wrap>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field label="姓名"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field label="ID" disabled></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="4">
                          <v-select :items="['男', '女']" label="性別"></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field label="年齡"></v-text-field>
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
                                label="生日"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker no-title scrollable>
                              <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="dateMenu = false">取消</v-btn>
                              <v-btn
                                text
                                color="primary"

                              >確認</v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field label="電話"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field label="信箱"></v-text-field>
                        </v-col>
                      </v-layout>
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-slide-x-reverse-transition>
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon class="my-0" v-bind="attrs" @click="resetForm" v-on="on">
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>Refresh form</span>
                </v-tooltip>
              </v-slide-x-reverse-transition>
              <v-btn text @click="cancel()">取消</v-btn>
              <v-btn color="primary" text @click="save()">送出</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { PatientFormData } from "@/types";
import { appModule } from "@/store/modules/app";
import { isValidEmail } from "@/utils/app-util";
import { patientModule } from "@/store/modules/patients";
import { GENDER } from "@/utils/store-util";

@Component
export default class UserForm extends Vue {
  title = "修改個人資料";
  loading = false;
  rules = {
    email: [() => isValidEmail(this.patientFormData.email)]
  };

  private dateMenu = false;
  private date = new Date().toISOString().substr(0, 10);

  avatar = "";
  countries = ["DN,1", "台中市", "台南市"];
  patientFormData: PatientFormData = {
    birthday: "",
    gender: "",
    name: "",
    phone: "",
    email: "",
    iid: "",
    role: "Patient",
    place: ""
  };

  save() {
    this.patientFormData.gender = Object.keys(GENDER).find(
      key => GENDER[key] === this.patientFormData.gender
    );
    this.loading = true;
    // this.place.country + this.place.township + this.place.areaDetail;
    patientModule.createPatient(this.patientFormData).then(result => {
      if (result.data.status === "Success") {
        appModule.sendSuccessNotice("新增成功");
      } else {
        appModule.sendErrorNotice("新增失敗" + result.data.message);
      }
      this.loading = false;
    });
  }

  resetForm() {
    this.patientFormData = {
      birthday: "",
      gender: "",
      name: "",
      phone: "",
      email: "",
      iid: "",
      role: "Patient",
      place: ""
    };
    appModule.setSnackbar;
  }

  cancel() {
    this.$router.push({ name: "個案名單" });
  }

  created() {}

  mounted() {}
}
</script>
<style scoped>
.avatar {
  border-radius: 50%;
}
</style>
