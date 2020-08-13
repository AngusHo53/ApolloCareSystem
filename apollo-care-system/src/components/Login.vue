<template>
  <v-container fill-height justify-center align-center>
    <!-- <v-layout row > -->
    <v-flex xs12 sm6 md5 lg4>
      <v-card class="mt-0 pt-0" elevation="2">
        <v-card-title class="blue darken-1">
          <h2 style="color:white">阿波羅照護系統</h2>
          <h4 style="color:white">Apollo Care Systems</h4>
        </v-card-title>
        <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
        <v-card-text>
          <v-form @submit.prevent="login" :lazy-validation="true" v-model="valid">
            <v-layout row wrap>
              <v-flex xs12 md4>
                <v-subheader>使用者信箱</v-subheader>
              </v-flex>
              <v-flex xs12 md8>
                <v-text-field
                  class="input-group--focused mr-2"
                  name="email"
                  v-model="email"
                  label="email"
                  value="Input text"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12 md4>
                <v-subheader>密碼</v-subheader>
              </v-flex>
              <v-flex xs12 md8>
                <v-text-field
                  class="input-group--focused mr-2"
                  name="password"
                  type="password"
                  v-model="pass"
                  label="password"
                  value="Input text"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex class="d-flex">
              <v-alert
                class="pa-2"
                v-if="error"
                type="error"
                text
                dense
                outlined
                dismissible
              >{{ text }}</v-alert>
              <v-dialog ref="dialog" v-model="registerDialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on">註冊</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">註冊阿波羅照護系統</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field v-model="id_card" label="身分證字號*" clearable required>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field v-model="email" label="Email*" clearable required>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field v-model="name" label="姓名*" clearable required>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field v-model="phone" label="手機*" clearable required>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field
                            v-model="pass"
                            :append-icon="show_pass ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show_pass ? 'text' : 'password'"
                            label="密碼*"
                            clearable
                            @click:append="show_pass = !show_pass"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field
                            v-model="confirm_pass"
                            :append-icon="show_confim_pass ? 'mdi-eye' : 'mdi-eye-off'"
                            label="確認密碼*"
                            clearable
                            :rules="[(pass === confirm_pass) || 'Password must match']"
                            :type="show_confim_pass ? 'text' : 'password'"
                            @click:append="show_confim_pass = !show_confim_pass"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-select :items="['男性','女性']" v-model="gender" label="性別*" required></v-select>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
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
                                v-model="date"
                                label="出生年月日*"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="date" no-title scrollable>
                              <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="dateMenu = false">取消</v-btn>
                              <v-btn text color="primary" @click="$refs.menu.save(date)">確認</v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="registerDialog = false">Close</v-btn>
                    <v-btn color="blue darken-1" text @click="register()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn class="ml-auto pa-2" color="primary" @click="login()">登入</v-btn>
            </v-flex>
          </v-form>
        </v-card-text>
      </v-card>
      <v-overlay :value="loading"></v-overlay>
    </v-flex>
    <!-- </v-layout> -->
  </v-container>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { userModule } from "@/store/modules/user";
import http from "@/http/axios";

@Component
export default class Login extends Vue {
  private email = "";
  private show_pass = false;
  private show_confim_pass = false;
  private pass = "";
  private confirm_pass = "";
  private id_card = "";
  private name = "";
  private gender = "";
  private phone = "";
  private error = false;
  private text = "No Response";
  private loading = false;
  private valid = true;
  private timeout = 500000;
  private registerDialog = false;
  private dateMenu = false;
  private date = new Date().toISOString().substr(0, 10);
  public gotoDashboard() {
    this.$router.push("/");
  }

  public async register() {
    this.loading = true;
    const params = {
      email: this.email,
      password: this.pass,
      confirm_password: this.confirm_pass,
      birthday: this.date,
      id_card: this.id_card,
      name: this.name,
      gender: this.gender,
      phone: this.phone
    };
    const result = await http.put("/auth", params);
    console.log(result);
    if (result) {
      if (result.data.status === "Success") {
        console.log("註冊成功");
        this.registerDialog = false;
      } else {
        console.log("註冊失敗");
      }
      this.loading = false;
    }
  }

  async created() {
    if (userModule.isSignedIn) {
      userModule.logout();
    }
  }

  public async login() {
    this.loading = true;
    // this.$Progress.start();
    const params = {
      email: this.email,
      password: this.pass
    };
    const result = await http.post("/auth", params);
    console.log(result);
    if (result) {
      if (result.data.status === "Success") {
        // Login Successful
        const data = result.data.data;
        const userData = {
          accessToken: data.session.token,
          user: data.user
        };
        userModule.signIn(userData);


        this.$router.push({ name: "社區狀態顯示表" }).catch(err => {
          console.log("catch test");
          console.log(err);
        });
      } else {
        // Login Failed
        this.error = true;
        this.text = result.data.message;
        console.log(`Login Failed`);
      }
    } else {
      this.error = true;
      this.text = "No Response";
      console.log(`error`);
    }
    this.loading = false;
  }
}
</script>
<style>
.snacker {
  background: #000000;
}
</style>
