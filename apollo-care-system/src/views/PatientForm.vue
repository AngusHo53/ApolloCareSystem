<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8" lg="6">
        <v-flex xs12>
          <v-card class="lighten-4 elevation-0">
            <v-card-title class="title">
              <v-icon>mdi-account</v-icon>
              {{ title }}
              <v-spacer></v-spacer>
              <v-btn fab small dark class="grey mr-2" @click.native="cancel()">
                <v-icon dark>mdi-close-circle-outline</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text v-if="loading !== true">
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
                            hint="Last name is required"
                            value="Input text"
                            v-model="customer.firstName"
                            class="input-group--focused"
                            counter="25"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-autocomplete
                            ref="gender"
                            v-model="customer.gender"
                            :rules="[() => !!customer.gender || 'This field is required']"
                            :items="['男', '女']"
                            label="*性別"
                            placeholder
                            required
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-text-field
                            name="email"
                            type="email"
                            label="信箱"
                            value="Input text"
                            v-model="customer.email"
                            v-bind:rules="rules.email"
                            class="input-group--focused"
                          ></v-text-field>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-text-field
                            name="birthday"
                            type="date"
                            label="*生日"
                            v-model="customer.birthday"
                            class="input-group--focused"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-text-field
                            name="mobile"
                            type="phone"
                            label="*電話"
                            v-model="customer.mobile"
                            class="input-group--focused"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex md4 sm12 xs12 class="mx-1 px-0">
                          <v-autocomplete
                            ref="area"
                            v-model="customer.country"
                            :rules="[() => !!country || 'This field is required']"
                            :items="countries"
                            label="*縣市"
                            placeholder
                            required
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex md4 sm12 xs12 class="mx-1 px-0">
                          <v-autocomplete
                            ref="area"
                            v-model="customer.country"
                            :rules="[() => !!country || 'This field is required']"
                            :items="countries"
                            label="*鄉鎮[市]區"
                            placeholder
                            required
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex md8 sm12 xs12 class="mx-1 px-0">
                          <v-text-field
                            name="area"
                            type="text"
                            label="*縣市/鄉鎮[市]區"
                            v-model="customer.mobile"
                            class="input-group--focused"
                            required
                          ></v-text-field>
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
                <v-tooltip v-if="formHasErrors" left>
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
import { Customer, Entity, Patient } from "@/types";
import { customerModule } from "@/store/modules/customers";
import { appModule } from "@/store/modules/app";
import { isValidEmail, isValidRewards } from "@/utils/app-util";

@Component
export default class CustomerForm extends Vue {
  title = "";
  rules = {
    rewards: [() => isValidRewards(this.customer.rewards)],
    email: [() => isValidEmail(this.customer.email)]
  };

  avatar = "";
  countries = ["台北市", "台中市", "台南市"];

  patients: Patient;

  customerAvatar() {
    appModule.sendSuccessNotice("New customer has been added.");
    this.avatar = customerModule.customer.avatar;
    return this.customer.avatar;
  }

  get customer() {
    console.log(customerModule.customer);
    return customerModule.customer;
  }

  get orders() {
    return customerModule.getOrders();
  }

  get pagination() {
    return customerModule.pagination;
  }
  get loading() {
    return appModule.loading;
  }

  save() {
    appModule.sendSuccessNotice("New customer has been added.");
    appModule.closeNoticeWithDelay(1500);
  }

  cancel() {
    this.$router.push({ name: "病人名單" });
  }

  created() {
    customerModule.getCustomerById(this.$route.params.id);
  }
  mounted() {
    if (this.$route.params.id) {
      this.title = "編輯病人資料";
      this.customerAvatar();
    } else this.title = "新增病人資料";
  }
}
</script>
<style scoped>
.avatar {
  border-radius: 50%;
}
</style>
