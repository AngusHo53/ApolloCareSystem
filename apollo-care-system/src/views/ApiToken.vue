<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-container fluid>
          <v-data-table
            :headers="headers"
            :items="api_list"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            :loading="loading"
            loading-text="請稍後..."
            show-expand
            item-key="name"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>API token列表</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn dark class="mb-2" v-bind="attrs" v-on="on">新增API token</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.name" label="API token name"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              v-model="editedItem.api_type"
                              :items="[0,1]"
                              label="Type"
                              required
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
              <v-icon class="mr-2" @click="resetItem(item)">mdi-cached</v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td>
                <v-icon class="mr-2" @click="copyApi(item.api_key)">mdi-content-copy</v-icon>
              </td>
              <td :colspan="headers.length">
                <p id="api-key">API Key: {{ item.api_key }}</p>
              </td>
            </template>
          </v-data-table>
        </v-container>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import http from "../http/axios";

@Component
export default class ApiToken extends Vue {
  public dialog = false;
  public loading = true;
  public headers = [
    {
      text: "API name",
      align: "start",
      value: "name"
    },
    { text: "API type", value: "api_type" },
    { text: "uuid", value: "uuid" },
    { text: "Actions", value: "actions", sortable: false }
  ];
  public expanded = [];
  public singleExpand = true;
  public copyBtn = null;
  public api_list = [];
  public editedIndex = -1;
  public editedItem = {
    name: "",
    api_type: 0,
    uuid: ""
  };

  public defaultItem = {
    name: "",
    api_type: 0,
    uuid: ""
  };

  get formTitle() {
    return this.editedIndex === -1 ? "Create API token" : "Edit API token";
  }

  editItem(item) {
    this.editedIndex = this.api_list.indexOf(item);
    this.editedItem = Object.assign({}, item);
    console.log(this.editedItem);
    console.log(this.editedIndex);

    this.dialog = true;
  }

  public copyApi(api_key) {
    this.$copyText(api_key).then(
      function(e) {
        alert("複製成功");
        console.log(e);
      },
      function(e) {
        alert("複製失敗");
        console.log(e);
      }
    );
  }
  public async deleteItem(item) {
    const index = this.api_list.indexOf(item);
    console.log(this.api_list[index].uuid);
    if (confirm("確定要刪除嗎?") == true) {
      const result = await http.delete("/apikey/" + this.api_list[index].uuid);
      if (result) {
        if (result.data.status === "Success") {
          confirm("刪除成功");
        } else {
          confirm("刪除失敗");
        }
      }
    } else {
      confirm("刪除失敗");
    }
    this.apiList();
  }

  public async resetItem(item) {
    const index = this.api_list.indexOf(item);
    console.log(this.api_list[index].uuid);
    if (confirm("確定要重置API key嗎?") == true) {
      const result = await http.post("/apikey/" + this.api_list[index].uuid);
      if (result) {
        if (result.data.status === "Success") {
          confirm("重置成功");
        } else {
          confirm("重置失敗");
        }
      }
    } else {
      confirm("重置失敗");
    }
    this.apiList();
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  public async save() {
    if (this.editedIndex == -1) {
      const params = {
        name: this.editedItem.name,
        type: this.editedItem.api_type
      };
      const result = await http.post("/apikey", params);
      console.log(result);
      if (result) {
        if (result.data.status === "Success") {
          console.log("註冊成功");
        } else {
          console.log("註冊失敗");
        }
      }
    } else {
      const params = {
        name: this.editedItem.name,
        type: this.editedItem.api_type
      };
      const result = await http.put("/apikey/" + this.editedItem.uuid, params);
      console.log(result);
      if (result) {
        if (result.data.status === "Success") {
          console.log("修改成功");
        } else {
          console.log("修改失敗");
        }
      }
    }
    this.close();
    this.apiList();
  }

  public async apiList() {
    const result = await http.get("/apikey");
    if (result) {
      if (result.data.status === "Success") {
        this.api_list = result.data.data.clients;
        console.log(result);
        this.loading = false;
      } else {
        console.log("error");
      }
    } else {
      console.log("error");
    }
  }

  created() {
    this.apiList();
  }

  mounted() {}
}
</script>
