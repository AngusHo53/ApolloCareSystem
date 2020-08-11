import { getData, putData, postData, deleteData } from "@/utils/demo-api";
import { Customer, Order, Entity, Product, Category, Address } from "@/types";
import { getDefaultPagination, getPagination } from "@/utils/store-util";
import { appModule } from "./app";
import { get } from "lodash";
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";

export interface OrderState {
  items: Entity[];
  pagination: Pagination;
  loading: boolean;
  order: Order;
  customer: string;
  products: Product[];
  customers: Customer[];
  categories: Category[];
}

@Module({ store, dynamic: true, name: "orders" })
class OrderModule extends VuexModule implements OrderState {
  public items: Entity[] = [];
  public pagination = getDefaultPagination();
  public loading = false;
  public order = {} as Order;
  public customer = "";
  public products: Product[] = [];
  public customers: Customer[] = [];
  public categories: Category[] = [];

  @Action setDataTable(items: Order[]) {
    // const pagination = getPagination(items);
    // this.setPagination(pagination);
    this.setItems(items);
  }

  @Mutation
  setItems(orders: Order[]) {
    this.items = orders;
  }
  @Mutation
  setPagination(pagination: Pagination) {
    this.pagination = pagination;
  }
  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  @Mutation
  setOrder(order: Order) {
    this.order = order;
  }
}

export const orderModule = getModule(OrderModule); // Orders;
