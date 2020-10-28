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
                  @keyup.enter="login()"
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
                  <v-btn class="blue darken-1" dark v-bind="attrs" v-on="on">註冊</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">註冊阿波羅照護系統</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field v-model="id_card" label="身分證字號*" clearable required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field v-model="email" label="Email*" clearable required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field v-model="name" label="姓名*" clearable required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field v-model="phone" label="手機*" clearable required></v-text-field>
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
              <v-dialog v-model="forgetDialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="ml-2 pa-2 blue darken-1" dark v-bind="attrs" v-on="on">忘記密碼</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">忘記密碼</span>
                  </v-card-title>
                  <v-card-text class="subtitle-1 font-weight-bold">請輸入登入信箱，並在點擊「送出」後前往信箱確認驗證碼。</v-card-text>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field v-model="verify.email" label="信箱" clearable required></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closePass()">Close</v-btn>
                    <v-btn color="blue darken-1" text @click="forgetPassword()">送出</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="verifyDialog" persistent max-width="600px">
                <v-card>
                  <v-card-title>
                    <span class="headline">驗證信箱</span>
                  </v-card-title>
                  <v-card-subtitle>
                    <span class="subtitle-1">已發送驗證碼至信箱{{verify.email}}，請至信箱查看並複製驗證碼。</span>
                  </v-card-subtitle>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field
                            v-model="verify.email"
                            label="信箱*"
                            required
                            :rules="[() => !!verify.email || '信箱不能為空']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field
                            v-model="verify.verify_code"
                            label="驗證碼*"
                            clearable
                            required
                            persistent-hint
                            :rules="[() => !!verify.verify_code || '驗證碼不能為空，請至信箱接收驗證信，並複製驗證碼']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field
                            v-model="verify.new_pass"
                            :append-icon="show_pass ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show_pass ? 'text' : 'password'"
                            label="新密碼*"
                            clearable
                            @click:append="show_pass = !show_pass"
                            required
                            :rules="[() => !!verify.new_pass || '新密碼不能為空']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                          <v-text-field
                            v-model="verify.new_pass_verify"
                            :append-icon="show_confim_pass ? 'mdi-eye' : 'mdi-eye-off'"
                            label="確認新密碼*"
                            clearable
                            :rules="[(verify.new_pass_verify === verify.new_pass) || 'Password must match']"
                            :type="show_confim_pass ? 'text' : 'password'"
                            @click:append="show_confim_pass = !show_confim_pass"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closePass()">Close</v-btn>
                    <v-btn color="blue darken-1" text @click="newPassword()">送出</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn class="ml-auto pa-2 blue darken-1" dark @click="login()">登入</v-btn>
            </v-flex>
          </v-form>
        </v-card-text>
        <v-snackbar v-model="snackbar" :color="s_color" :timeout="6000">{{ s_text }}</v-snackbar>
      </v-card>
      <v-overlay :value="loading"></v-overlay>
    </v-flex>
    <!-- </v-layout> -->
  </v-container>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import { GENDER } from "@/utils/store-util";
import Vue from "vue";
import { userModule } from "@/store/modules/user";
import http from "@/http/axios";

@Component
export default class Login extends Vue {
  private email = "";
  private show_pass = false;
  private show_confim_pass = false;
  public notice = "";
  private pass = "";
  private confirm_pass = "";
  private id_card = "";
  private name = "";
  private snackbar = false;
  private gender = "";
  private phone = "";
  private error = false;
  private s_text = "";
  private s_color = "";
  private text = "No Response";
  private loading = false;
  private valid = true;
  private timeout = 500000;
  private registerDialog = false;
  private forgetDialog = false;
  private verifyDialog = false;
  private dateMenu = false;
  private date = new Date().toISOString().substr(0, 10);
  public gotoDashboard() {
    this.$router.push("/");
  }

  private verify = {
    email: "",
    verify_code: "",
    new_pass: "",
    new_pass_verify: ""
  };

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

  async destroyed() {
    await this.clearLogin();
  }

  async forgetPassword() {
    const params = {
      email: this.verify.email
    };
    const result = await http.post("/auth/password/reset", params);
    if (result) {
      if (result.data.status === "Success") {
        this.verifyDialog = true;
      } else {
        this.s_color = "error";
        this.s_text = "傳送驗證碼錯誤，請確認信箱是否輸入正確";
        this.snackbar = true;
      }
    } else {
      this.s_color = "error";
      this.s_text = "傳送驗證碼錯誤，請確認信箱是否輸入正確";
      this.snackbar = true;
    }
  }

  async newPassword() {
    if (this.verify.new_pass_verify !== this.verify.new_pass) {
      this.s_color = "error";
      this.s_text = "新密碼與確認新密碼不相同";
      this.snackbar = true;
      return;
    }
    const params = {
      email: this.verify.email,
      code: this.verify.verify_code,
      password: this.verify.new_pass,
      password_confirm: this.verify.new_pass_verify
    };
    const result = await http.put("/auth/password/reset", params);

    if (result) {
      if (result.data.status === "Success") {
        this.s_color = "success";
        this.s_text = "修改新密碼成功";
        this.snackbar = true;
        this.closePass();
      } else {
        this.s_color = "error";
        this.s_text = result.data.message;
        this.snackbar = true;
      }
    } else {
      this.s_color = "error";
      this.s_text = result.data.message;
      this.snackbar = true;
    }
  }

  closePass() {
    this.forgetDialog = false;
    this.verifyDialog = false;
    this.verify = {
      email: "",
      verify_code: "",
      new_pass: "",
      new_pass_verify: ""
    };
  }

  public async login() {
    this.loading = true;
    // this.$Progress.start();
    const params = {
      email: this.email,
      password: this.pass
    };
    const result = await http.post("/auth", params);
    if (result) {
      if (result.data.status === "Success") {
        // Login Successful
        const data = result.data.data;
        data.user.gender = GENDER[data.user.gender];
        const userData = {
          accessToken: data.session.token,
          user: data.user
        };
        userModule.signIn(userData);

        this.$router.push({ name: "個案名單" }).catch(err => {
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

  clearLogin() {
    this.closePass();
    this.email = "";
    this.pass = "";
    this.confirm_pass = "";
    this.id_card = "";
    this.name = "";
    this.gender = "";
    this.phone = "";
  }
}
</script>
<style>
.snacker {
  background: #000000;
}
</style>
