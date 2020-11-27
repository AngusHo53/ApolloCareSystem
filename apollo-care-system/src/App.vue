<template>
  <v-app id="apollo" class="overflow-auto" style="background: #eeeef3">
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
              <v-img
                max-width="2.5em"
                class="avatar"
                src="@/assets/avatar0.png"
              />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                >{{ user.firstName }}{{ user.lastName }}</v-list-item-title
              >
            </v-list-item-content>
            <!-- <v-spacer></v-spacer> -->
            <v-list-item-action style="max-width: 1em">
              <v-menu
                bottom
                right
                offset-y
                origin="bottom right"
                transition="v-slide-y-transition"
              >
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
                      <v-list-item-title
                        v-text="item.title"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
            <v-list-item-action style="max-width: 1em">
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
            <v-list-item-content
              :class="activeMenuItem.includes(item.title) ? 'blue--text' : ''"
            >
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar app elevation="1">
        <v-app-bar-nav-icon
          @click.native.stop="drawer = !drawer"
          light
        ></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <v-snackbar
            v-model="snackbar"
            :top="true"
            :timeout="2000"
            :color="mode"
          >
            {{ notice }}
            <!-- <v-btn dark text @click.native="closeSnackbar">取消</v-btn> -->
          </v-snackbar>
          <router-view></router-view>
          <v-dialog v-model="editDialog" max-width="500px">
            <v-card>
              <v-card-title class="headline">個人資料修改</v-card-title>
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
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="電話"
                        prefix="(+886)"
                        v-model="editItem.phone"
                        hint="電話號碼請省略0"
                        persistent-hint
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="信箱"
                        disabled
                        v-model="editItem.email"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeEdit()"
                  >取消</v-btn
                >
                <v-btn color="blue darken-1" text @click="saveEdit()"
                  >儲存</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>
<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import Vue from "vue";
import { userModule } from "@/store/modules/user";
import { appModule } from "./store/modules/app";
import http from "@/http/axios";

@Component
export default class App extends Vue {
  get signedIn() {
    return userModule.isSignedIn;
  }

  get user() {
    return userModule.user;
  }
  public role = false;
  private mini = false;
  private isRootComponent = true;
  public drawer = window.innerWidth > 960;
  private fixed = false;
  public adminItems: AppMenu[] = [
    {
      icon: "tachometer-alt",
      title: "首頁",
      vertical: "Dashboard",
      link: "dashboard",
    },
    {
      icon: "users",
      title: "個案名單",
      vertical: "Patient",
      link: "patients",
    },
    {
      icon: "user-nurse",
      title: "照護人員名單",
      vertical: "Paramedic",
      link: "paramedic",
    },
    {
      icon: "check",
      title: "個案審核",
      vertical: "verifyPatients",
      link: "verifyPatients",
    },
    {
      icon: "key",
      title: "API列表",
      vertical: "apiList",
      link: "apilist",
    },
    {
      icon: "user-tag",
      title: "權限列表",
      vertical: "roleList",
      link: "rolelist",
    },
  ];

  public developItems: AppMenu[] = [
    {
      icon: "key",
      title: "API列表",
      vertical: "apiList",
      link: "apilist",
    },
  ];

  public paramedicItems: AppMenu[] = [
    {
      icon: "tachometer-alt",
      title: "首頁",
      vertical: "Dashboard",
      link: "dashboard",
    },
    {
      icon: "users",
      title: "個案名單",
      vertical: "Patient",
      link: "patients",
    },
  ];

  public items: AppMenu[] = [
    // {
    //   icon: "home",
    //   title: "社區狀態顯示表",
    //   vertical: "community",
    //   link: "communities"
    // },
  ];

  private userMenus: AppMenu[] = [
    {
      icon: "bubble_chart",
      title: "修改個人資料",
      link: "userInfo",
    },
    {
      icon: "bubble_chart",
      title: "登出",
      link: "Login",
    },
  ];

  private miniVariant = false;
  private right = true;
  private rightDrawer = false;
  private menuItem = "";

  private editDialog = false;
  private dateMenu = false;
  private date = new Date().toISOString().substr(0, 10);
  private editItem = {
    age: 0,
    birthday: "",
    created_at: "",
    gender: "",
    health_state: 0,
    iid: 0,
    id_card: "",
    name: "",
    phone: "",
    updated_at: "",
    uuid: "",
    email: "",
    place: "",
  };

  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(to, from) {
    if (this.signedIn && from.name == "Login") {
      this.role = true;
      location.reload();
    }
  }

  @Watch("this.role", { immediate: true, deep: true })
  onsignedIn() {
    this.roleItem();
  }

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
    this.$router.afterEach((to) => {
      if (to.name !== "ErrorPage") {
        this.menuItem = to.name;
      }
      //  finish the progress bar
      this.$Progress.finish();
    });
  }

  roleItem() {
    if (!this.signedIn) return;
    else {
      if (
        this.user.roles.includes("Owner") ||
        this.user.roles.includes("Admin")
      ) {
        this.items = this.items.concat(this.adminItems);
        return;
      } else if (this.user.roles.includes("Developer")) {
        this.items = this.items.concat(this.developItems);
        return;
      } else if (this.user.roles.includes("Paramedic")) {
        this.items = this.items.concat(this.paramedicItems);
        return;
      }
    }
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
    this.menuItem = item.title;
    this.$router.push({
      name: item.title,
    });
  }

  async handleUserActions(item: TODO) {
    this.menuItem = item.title;
    if (item.title === "登出") {
      await userModule.logout();
      this.$router.push({ path: "/login" });
    } else if (item.title === "修改個人資料") {
      this.editDialog = true;
      this.editItem = JSON.parse(JSON.stringify(this.user));
      this.editItem.phone = this.editItem.phone.substring(4,this.editItem.phone.length);
    }
  }

  async saveEdit() {
    if (this.editItem.gender === "1") this.editItem.gender = "男";
    else if (this.editItem.gender === "2") this.editItem.gender = "女";
    if (this.editItem.phone != "") {
      this.editItem.phone = "+886" + this.editItem.phone;
    }

    const params = {
      age: this.editItem.age,
      gender: this.editItem.gender,
      name: this.editItem.name,
      phone: this.editItem.phone,
      place: this.editItem.place,
    };

    const result = await http.put("/user/" + this.editItem.uuid, params);
    if (result) {
      if (result.data.status === "Success") {
        appModule.sendSuccessNotice("修改成功，請重新登入以便檢查資料是否正確");
      } else {
        appModule.sendErrorNotice("修改失敗");
      }
    } else {
      console.error(result.data.status);
    }
    this.closeEdit();
  }

  closeEdit() {
    this.editItem = {
      age: 0,
      birthday: "",
      created_at: "",
      gender: "",
      health_state: 0,
      iid: 0,
      id_card: "",
      name: "",
      phone: "",
      updated_at: "",
      uuid: "",
      email: "",
      place: "",
    };
    this.editDialog = false;
  }
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
