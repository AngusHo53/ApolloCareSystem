<template>
  <v-app id="apollo" class="overflow-auto" style="background:#EEEEF3;">
    <vue-progress-bar></vue-progress-bar>
    <template v-if="!signedIn">
      <router-view></router-view>
    </template>
    <template v-if="signedIn">
      <v-navigation-drawer
        class="blue lighten-5"
        mini-variant-width="70"
        width="250"
        light
        :mini-variant.sync="mini"
        v-model="drawer"
        app
      >
        <v-list class="pa-0">
          <v-list-item tag="div">
            <v-list-item-action>
              <v-img max-width="2.5em" class="avatar" src="@/assets/avatar0.png" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ user.firstName }}{{ user.lastName }}</v-list-item-title>
            </v-list-item-content>
            <!-- <v-spacer></v-spacer> -->
            <v-list-item-action style="max-width:1em">
              <v-menu bottom right offset-y origin="bottom right" transition="v-slide-y-transition">
                <template v-slot:activator="{ on }">
                  <v-btn icon small light slot="activator" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="item in userMenus"
                    :key="item.title"
                    value="true"
                    @click="handleUserActions(item)"
                    router
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.title"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
            <v-list-item-action style="max-width:1em">
              <v-btn icon small @click.native.stop="mini = !mini">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            @click="handleNavigtiion(item)"
            router
          >
            <v-list-item-action class="pr-1 pl-2 mr-1">
              <v-awesome-icon :title="item.title" :icon="item.icon" />
            </v-list-item-action>
            <v-list-item-content :class="activeMenuItem.includes(item.title) ? 'blue--text' : ''">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar app elevation="1">
        <v-app-bar-nav-icon @click.native.stop="drawer = !drawer" light></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <v-snackbar v-model="snackbar" :top="true" :timeout="2000" :color="mode">
            {{ notice }}
            <!-- <v-btn dark text @click.native="closeSnackbar">取消</v-btn> -->
          </v-snackbar>
          <router-view></router-view>
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { userModule } from "@/store/modules/user";
import { appModule } from "./store/modules/app";

@Component
export default class App extends Vue {
  get signedIn() {
    return userModule.isSignedIn;
  }

  get user() {
    return userModule.user;
  }

  private mini = false;
  private isRootComponent = true;
  public drawer = window.innerWidth > 960;
  private fixed = false;
  private items: AppMenu[] = [
    {
      icon: "home",
      title: "社區狀態顯示表",
      vertical: "community",
      link: "communities"
    },
    {
      icon: "check",
      title: "病人審核",
      vertical: "verifyPatients",
      link: "verifyPatients"
    },
    {
      icon: "users",
      title: "病人名單",
      vertical: "Patient",
      link: "patients"
    },
    {
      icon: "key",
      title: "API列表",
      vertical: "apiList",
      link: "apilist"
    }
  ];

  private userMenus: AppMenu[] = [
    {
      icon: "bubble_chart",
      title: "登出",
      link: "login"
    }
  ];

  private miniVariant = false;
  private right = true;
  private rightDrawer = false;
  private menuItem = "";

  created() {
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    // this.$Progress.start();
    //  hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, _from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        const meta = to.meta.progress;
        // parse meta tags
        this.$Progress.parseMeta(meta);
      }
      //  start the progress bar
      this.$Progress.start();
      //  continue to next page
      next();
    });
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach(to => {
      if (to.name !== "ErrorPage") {
        this.menuItem = to.name;
      }
      //  finish the progress bar
      this.$Progress.finish();
    });
  }

  get activeMenuItem() {
    return this.menuItem;
  }

  get loading() {
    return appModule.loading;
  }

  get snackbar() {
    return appModule.snackbar;
  }

  get notice() {
    return appModule.notice;
  }

  get mode() {
    return appModule.mode;
  }

  closeSnackbar() {
    appModule.closeNotice();
  }

  handleNavigtiion(item: TODO) {
    if (!this.loading) {
      this.menuItem = item.title;
      this.$router.push({
        name: item.title
      });
    }
  }

  async handleUserActions(item: TODO) {
    this.menuItem = item.title;
    if (item.title === "登出") {
      await userModule.logout();
    }
    this.$router.push(item.link);
  }

  mounted() {}
}
</script>
<style scoped>
@import "/assets/font/style.css";
.avatar {
  border-radius: 50%;
}
#apollo {
  font-family: "SF UI Display Medium";
}
</style>
