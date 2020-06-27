<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card class="lighten-4 elevation-0">
        <v-card-title class="title">
          {{ title }}
          <v-spacer></v-spacer>
          <v-btn fab small dark class="grey mr-2" @click.native="cancel()">
            <v-icon dark="">mdi-close-circle-outline</v-icon>
          </v-btn>
          &nbsp;
          <v-btn fab small dark class="blue" @click.native="save()">
            <v-icon>mdi-content-save-all</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="loading !== true">
          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-flex md3 sm12>
                <v-img small max-width="20em" :src="avatar" class="avatar "  :srcset="avatar" />
              </v-flex>
              <v-flex md9 sm12>
                <v-container fluid grid-list-sm>
                  <v-layout row wrap>
                    <v-flex md4 sm12 xs12 class="mx-1 px-0">
                      <v-text-field
                        name="firstName"
                        label="姓名"
                        hint="Last name is required"
                        value="Input text"
                        v-model="customer.firstName"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 sm12 class="mx-1 px-0">
                      <v-text-field
                        name="lastName"
                        label="性別"
                        maxlength="10"
                        hint="Last name is required"
                        value="Input text"
                        v-model="customer.lastName"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 sm12 xs12 class="mx-1 px-0">
                      <v-text-field
                        name="email"
                        type="email"
                        label="ID卡"
                        value="Input text"
                        v-model="customer.email"
                        v-bind:rules="rules.email"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 sm12 xs12 class="mx-1 px-0">
                      <v-text-field
                        name="age"
                        type="number"
                        label="年齡"
                        v-model="customer.mobile"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 sm12 xs12 class="mx-1 px-0">
                      <v-text-field
                        name="mobile"
                        type="text"
                        label="電話"
                        v-model="customer.mobile"
                        class="input-group--focused"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
            <v-snackbar
              v-if="loading === false"
              :right="true"
              :timeout="2000"
              :color="modeTest"
              v-model="test"
            >
              {{ notice }} testsetatw
              <v-btn dark text @click.native="closeSnackbar">Close</v-btn>
            </v-snackbar>
            
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { Customer, Entity } from "@/types";
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
  modeTest = 'error';
  test = true;

  avatar = '';

  customerAvatar() {
    console.log(`${this.customer.avatar}`);
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
  get mode() {
    return appModule.mode;
  }
  get snackbar() {
    return appModule.snackbar;
  }
  get notice() {
    return appModule.notice;
  }

  save() {
    appModule.sendSuccessNotice('New customer has been added.');
    appModule.closeNoticeWithDelay(1500);
  }

  cancel() {
    this.$router.push({ name: "病人名單" });
  }

  closeSnackbar() {
    appModule.closeNotice();
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
