<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-container fluid>
          <v-data-table :headers="headers" :items="api_list" class="elevation-1">
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
                            <v-text-field v-model="new_api_name" label="API token name"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select v-model="new_api_type" :items="[0,1]" label="Type" required></v-select>
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
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-container>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import http from "@/http/axios";

@Component
export default class CustomerList extends Vue {
  public dialog = false;
  public headers = [
    {
      text: "API name",
      align: "start",
      sortable: false,
      value: "name"
    },
    { text: "API type", value: "api_type" },
    { text: "API key", value: "api_key" },
    { text: "uuid", value: "uuid" },
    { text: "Actions", value: "actions", sortable: false }
  ];

  public api_list = [];
  public new_api_name = "";
  public new_api_type = 0;
  public desserts = [];
  public editedIndex = -1;
  public editedItem = {
    name: "",
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0
  };

  public defaultItem = {
    name: "",
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0
  };

  get formTitle() {
    return this.editedIndex === -1 ? "Create API token" : "Edit API token";
  }

  editItem(item) {
    this.editedIndex = this.desserts.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  deleteItem(item) {
    const index = this.desserts.indexOf(item);
    confirm("確定要刪除嗎?") && this.desserts.splice(index, 1);
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  public async save() {
    if (this.new_api_name != "") {
      const params = {
        name: this.new_api_name,
        type: this.new_api_type
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
    }
    this.close();
  }

  public async apiList() {
    const result = await http.get("/apikey");
    if (result) {
      if (result.data.status === "Success") {
        this.api_list = result.data.data.clients;
        console.log(result);
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
