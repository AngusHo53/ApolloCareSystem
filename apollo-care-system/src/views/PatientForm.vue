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
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-text-field
                            name="firstName"
                            label="*姓名"
                            :rules="[() => !!patientFormData.name || 'This field is required']"
                            value="Input text"
                            v-model="patientFormData.name"
                            class="input-group--focused"
                            counter="25"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-autocomplete
                            ref="gender"
                            v-model="patientFormData.gender"
                            :rules="[() => !!patientFormData.gender || 'This field is required']"
                            :items="['男', '女']"
                            label="*性別"
                            placeholder
                            required
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-text-field
                            name="iid"
                            label="*身份證字號"
                            v-model="patientFormData.iid"
                            class="input-group--focused"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-text-field
                            name="email"
                            type="email"
                            label="信箱"
                            value="Input text"
                            v-model="patientFormData.email"
                            v-bind:rules="rules.email"
                            class="input-group--focused"
                          ></v-text-field>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-text-field
                            name="birthday"
                            label="*生日"
                            hint="1996-01-01"
                            v-model="patientFormData.birthday"
                            class="input-group--focused"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-text-field
                            name="mobile"
                            type="phone"
                            label="*電話"
                            v-model="patientFormData.phone"
                            class="input-group--focused"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-autocomplete
                            ref="place"
                            v-model="patientFormData.place"
                            :rules="[() => !!patientFormData.place || 'This field is required']"
                            :items="countries"
                            label="*地區"
                            placeholder
                            required
                          ></v-autocomplete>
                        </v-flex>
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
import { Entity, PatientFormData } from "@/types";
import { appModule } from "@/store/modules/app";
import { isValidEmail, isValidRewards } from "@/utils/app-util";
import { patientModule } from "@/store/modules/patients";
import { GENDER } from "@/utils/store-util";

@Component
export default class PatientForm extends Vue {
  title = "";
  loading = false;
  rules = {
    email: [() => isValidEmail(this.patientFormData.email)]
  };

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
    this.$router.push({ name: "病人名單" });
  }

  created() {}

  mounted() {
    if (this.$route.params.id) {
      this.title = "編輯病人資料";
    } else this.title = "新增病人資料";
  }
}
</script>
<style scoped>
.avatar {
  border-radius: 50%;
}
</style>
