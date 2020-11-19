<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar-title>照護人員名單 {{ totalAccounts ? '(' + totalAccounts + ')' : '' }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-text-field
            clearable
            flat
            solo-inverted
            hide-details
            v-model="search"
            append-icon="mdi-magnify"
            label="關鍵字搜尋"
          ></v-text-field>
          <v-data-table
            item-key="iid"
            :headers="headers"
            :items="accounts"
            :loading="loading"
            loading-text="請稍後..."
            :search="search"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn fab class="indigo mr-2" small dark @click="changeToPatient(item)">
                <v-awesome-icon icon="user" size="lg" />
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { paramedicModule } from "@/store/modules/paramedic";

@Component
export default class ParamedicList extends Vue {
  public search = "";
  public headers = [
    {
      text: "名稱",
      left: true,
      sortable: false,
      value: "name"
    },
    { text: "身份證字號", sortable: false, value: "iid" },
    { text: "性別", sortable: false, value: "gender" },
    { text: "年齡", sortable: false, value: "age" },
    { text: "生日", sortable: false, value: "birthday" },
    { text: "電話", sortable: false, value: "phone" },
    { text: "信箱", sortable: false, value: "email" },
    { text: "負責個案", value: "actions", sortable: false }
  ];

  get totalAccounts() {
    return paramedicModule.totalAccounts;
  }

  get loading() {
    return paramedicModule.loading;
  }

  get accounts() {
    return paramedicModule.accounts;
  }

  get account() {
    return paramedicModule.account;
  }

  set account(item) {
    paramedicModule.setAccount(item);
  }

  async created() {
    paramedicModule.accountList();
  }

  changeToPatient(item) {
    this.account = Object.assign({}, item);
    this.$router.push({
      name: `負責個案`,
      params: { name: item.name, id: item.uuid }
    });
  }
}
</script>
