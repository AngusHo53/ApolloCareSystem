<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card>
        <v-container fluid>
          <v-data-iterator
            :items="items"
            :page="page"
            :items-per-page.sync="itemsPerPage"
            :search="search"
            hide-default-footer
          >
            <template v-slot:header>
              <v-card-title>
                <span class="title">社區名單</span>
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
                <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
                  <v-card>
                    <v-card-title
                      class="subheading font-weight-bold"
                    >{{ item.area }}{{ item.community }}</v-card-title>
                    <v-card-title class="subheading font-weight-bold">異常個案數</v-card-title>
                    <v-divider></v-divider>

                    <v-list dense>
                      <v-list-item>
                        <v-list-item-content>血壓(社區)平均值:</v-list-item-content>
                        <v-list-item-content
                          class="align-end"
                        >{{ item.thisMonthTest[0].bloodPressure }}人</v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>五次坐站(秒)平均值:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.thisMonthTest[0].seat }}人</v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>走路速度平均值:</v-list-item-content>
                        <v-list-item-content
                          class="align-end"
                        >{{ item.thisMonthTest[0].walkspeed }}人</v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>握力平均值:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.thisMonthTest[0].grip }}人</v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>本月測量人數:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.thisMonthTest[0].total }}人</v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>上月測量人數:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.lastMonthTest[0].total }}人</v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <template v-slot:footer>
              <div class="text-xs-center pt-2" style="margin-top: 50px;">
                <v-pagination v-model="page" :length="numberOfPages" circle></v-pagination>
              </div>
            </template>
          </v-data-iterator>
        </v-container>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script lang="ts">
import Table from "@/components/Table.vue";
import TableHeaderButtons from "@/components/TableHeaderButtons.vue";
import SearchPanel from "@/components/SearchPanel.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { debounce } from "lodash";
import {
  buildSearchFilters,
  buildJsonServerQuery,
  clearSearchFilters
} from "@/utils/app-util";
import { Component } from "vue-property-decorator";
import Vue from "vue";
import { Entity } from "../types";
import { customerModule } from "@/store/modules/customers";
import { appModule } from "@/store/modules/app";

@Component({
  components: {
    Table,
    TableHeaderButtons,
    SearchPanel,
    ConfirmDialog
  }
})
export default class CustomerList extends Vue {
  public dialog = false;
  private showSearchPanel = false;
  public right = true;
  public errorMsg = "";
  public search = "";
  public page = 1;
  public itemsPerPage = 6;
  public items = [
    {
      area: "大埤鄉",
      community: "舊社社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 2,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 3,
          seat: 1,
          walkspeed: 4,
          grip: 2,
          total: 10
        }
      ]
    },
    {
      area: "大埤鄉",
      community: "舊社社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 1,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 1,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ]
    },
    {
      area: "大埤鄉",
      community: "舊社社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ]
    },
    {
      area: "斗南鎮",
      community: "北和社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ]
    },
    {
      area: "虎尾鎮",
      community: "興中社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ]
    },
    {
      area: "虎尾鎮",
      community: "舊社社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ]
    },
    {
      area: "虎尾鎮",
      community: "舊社社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ]
    },
    {
      area: "大埤鄉",
      community: "舊社社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ]
    },
    {
      area: "大埤鄉",
      community: "舊社社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ]
    },
    {
      area: "大埤鄉",
      community: "舊社社區發展協會",
      lastMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ],
      thisMonthTest: [
        {
          bloodPressure: 0,
          seat: 0,
          walkspeed: 0,
          grip: 0,
          total: 0
        }
      ]
    }
  ];
  private customerId = "";
  private query = "";
  private color = "";
  private quickSearchFilter = "";
  private itemId = -1;

  onCancel() {
    this.customerId = "";
    this.dialog = false;
  }

  nextPage() {
    if (this.page + 1 <= this.numberOfPages) this.page += 1;
  }
  formerPage() {
    if (this.page - 1 >= 1) this.page -= 1;
  }

  updateSearchPanel() {
    this.rightDrawer = !this.rightDrawer;
  }

  cancelSearch() {
    this.showSearchPanel = false;
  }

  closeSnackbar() {
    appModule.closeNotice();
  }

  quickSearchCustomers = debounce(function() {
    customerModule.quickSearch(this.headers, this.quickSearchFilter);
  }, 500);

  get numberOfPages() {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }

  get loading() {
    return appModule.loading;
  }
  get mode() {
    return appModule.mode;
  }

  get snackbar() {
    return appModule.snackbar;
  }

  get notice() {
    return appModule.notice;
  }

  get rightDrawer() {
    return this.showSearchPanel;
  }

  set rightDrawer(_showSearchPanel: boolean) {
    this.showSearchPanel = _showSearchPanel;
  }

  get quickSearch() {
    return this.quickSearchFilter;
  }
  set quickSearch(val) {
    this.quickSearchFilter = val;
    this.quickSearchFilter && this.quickSearchCustomers();
  }

  created() {
    customerModule.getAllCustomers();
  }

  mounted() {}
}
</script>
