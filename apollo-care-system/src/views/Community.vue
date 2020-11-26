<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-container fluid>
          <v-data-iterator
            :items="place"
            :page="page"
            :items-per-page.sync="itemsPerPage"
            :search="search"
            hide-default-footer
            :loading="loading"
            loading-text="請稍候..."
          >
            <template v-slot:header>
              <v-card-title>
                <v-toolbar-title>社區名單</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-text-field
                v-model="search"
                clearable
                flat
                solo-inverted
                hide-details
                label="Search"
              ></v-text-field>
            </template>

            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.name"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="2"
                >
                  <v-card>
                    <v-card-title class="text-h6 font-weight-bold">{{
                      item.branch_name
                    }}</v-card-title>
                    <v-card-subtitle class="text-subtitle-1 font-weight-bold"
                      >異常個案數</v-card-subtitle
                    >
                    <div align="right">
                      <v-btn
                        class="ma-2 white--text"
                        dark
                        small
                        @click.native="
                          changeToCommunityRecordPage(item.branch_name)
                        "
                      >
                        詳細資料
                        <v-icon right dark
                          >mdi-format-list-bulleted-square</v-icon
                        >
                      </v-btn>
                    </div>
                    <v-divider></v-divider>

                    <v-list :subheader="true">
                      <v-list-item>
                        <v-list-item-content class="align-center"
                          >收縮壓:12人</v-list-item-content
                        >
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content class="align-end"
                          >舒張壓:12人</v-list-item-content
                        >
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content class="align-end"
                          >脈搏:</v-list-item-content
                        >
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content class="align-end"
                          >五次坐站:</v-list-item-content
                        >
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content class="align-end"
                          >走路速度:</v-list-item-content
                        >
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content class="align-end"
                          >握力:</v-list-item-content
                        >
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content class="align-end"
                          >上月測量人數:</v-list-item-content
                        >
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content class="align-end"
                          >本月測量人數:</v-list-item-content
                        >
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <template v-slot:footer>
              <div class="text-xs-center pt-2" style="margin-top: 50px">
                <v-pagination
                  v-model="page"
                  :length="numberOfPages"
                  circle
                ></v-pagination>
              </div>
            </template>
          </v-data-iterator>
        </v-container>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { placeModule } from "@/store/modules/place";

@Component
export default class Community extends Vue {
  public search = "";
  public page = 1;
  public itemsPerPage = 6;

  get place() {
    return placeModule.place;
  }

  get loading() {
    return placeModule.loading;
  }

  nextPage() {
    if (this.page + 1 <= this.numberOfPages) this.page += 1;
  }
  formerPage() {
    if (this.page - 1 >= 1) this.page -= 1;
  }

  changeToCommunityRecordPage($event) {
    this.$router.push({
      name: `社區紀錄`,
      params: {
        name: $event,
      },
    });
  }

  get numberOfPages() {
    return Math.ceil(this.place.length / this.itemsPerPage);
  }

  created() {
    placeModule.placeList();
  }
}
</script>
