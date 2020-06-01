<template>
  <v-container fill-height justify-center align-center>
    <!-- <v-layout row > -->
    <v-flex xs12 sm6 md5 lg4>
      <v-card class="mt-0 pt-0"   elevation="2" >
        <v-card-title class="blue darken-1">
          <h4 style="color:white">Apollo System</h4>
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
              <v-btn class="pink--text" text @click.native="error = false"
                >Close</v-btn
              >
            </v-snackbar>
          </form>
        </v-card-text>
      </v-card>
    </v-flex>
    <!-- </v-layout> -->
  </v-container>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { userModule } from "@/store/modules/user";


@Component
export default class Login extends Vue {
  private email = "";
  private pass = "";
  private error = false;
  private text = "";

  public gotoDashboard() {
    this.$router.push("/");
  }

  public async login() {
    const params = {
      email: this.email,
      password: this.pass,
    };
    Vue.prototype.$http.post(`/user/login`,params);
    this.$router.push({name: '儀錶板'}).catch((err) => {
      console.log(err);
    })
  }

}
</script>
