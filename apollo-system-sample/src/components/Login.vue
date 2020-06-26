<template>
  <v-container fill-height justify-center align-center>
    <!-- <v-layout row > -->
    <v-flex xs12 sm6 md5 lg4>
      <v-card class="mt-0 pt-0" elevation="2">
        <v-card-title class="blue darken-1">
          <h2 style="color:white">阿波羅照護系統</h2>
          <h4 style="color:white">Apollo Care Systems</h4>
        </v-card-title>
        <v-card-text>
          <form @submit.prevent="login">
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
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn type="submit">登入</v-btn>
            <v-snackbar
              v-if="error"
              :timeout="timeout"
              :top="true"
              :multi-line="mode === 'multi-line'"
              :vertical="mode === 'vertical'"
              v-model="error"
            >
              {{ text }}
              <v-btn class="pink--text" text @click.native="error = false">Close</v-btn>
            </v-snackbar>
          </form>
        </v-card-text>
      </v-card>
      <v-overlay  :value="loading">
    </v-overlay>
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
  private pass = "";
  private error = false;
  private text = "";
  private loading = false;

  public gotoDashboard() {
    this.$router.push("/");
  }

  public async login() {
    this.loading = true;
    this.$Progress.start();
    const params = {
      email: this.email,
      password: this.pass
    };
    const result = await http.post('/user/login', params);
    console.log(result);
    if(result) {
      if(result.data.status === 'Success'){  // Login Successful
      const data = result.data.data;
      const userData = {
        accessToken: data.session.token,
        user: data.user
      }
      userModule.signIn(userData);
      this.$router.push({ name: "社區狀態顯示表" });
      }else{ // Login Failed
        this.error = true;
        this.text = result.data.message;
        console.log(`Login Failed`);
      }
    }else {
      this.error = true;
      this.text = "No Response";
      console.log(`error`);
    }

    this.loading = false;
  }
}
</script>
