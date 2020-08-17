import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Customer, Order, Entity } from '@/types';
import { appModule } from './app';
import { getDefaultPagination } from '@/utils/store-util';
import { get } from 'lodash';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getToken } from "@/utils/app-util";
import Vue from 'vue';
import axios from "axios";

export interface CustomerState {
  items: Entity[];
  pagination: Pagination;
  loading: boolean;
  customer: Customer; //= new Customer() ;
  customers: Customer[];
  orders: Order[];
  orderList: Order[];
}

@Module({ store, dynamic: true, name: 'customerModule' })
class CustomerModule extends VuexModule implements CustomerState {
  public items: Entity[] = [];
  public pagination = getDefaultPagination();
  public loading = true;
  public customer = {} as Customer;
  public customers: Customer[] = [];
  public orders: Order[] = [];
  public orderList: Order[] = [];

  get getCustomers() {
    return this.customers;
  }

  @Action getOrders(): void {
    getData('orders/').then(res => {
      if (res.data && res.data.length > 0) {
        const orderList = res.data.map((c: TODO) => {
          c.text = c.firstName + ' ' + c.lastName;
          c.value = c.id;
          return c;
        });
        this.setOrderList(orderList);
      }
    });
  }
  @Action getCustomerById(id: string): void {
    //this.context.commit('setLoading', { loading: true });
    this.setLoading(true);
    if (id) {
      getData('customers/' + id).then(
        res => {
          const customer = Object.assign({}, res.data);
          customer.avatar = `..${customer.avatar}`;
          this.setCustomer(customer);
          this.setLoading(false);
        },
        (err: TODO) => {
          console.log(err);
        }
      );
    } else {
      this.setCustomer({} as Customer);
      this.setLoading(false);
    }
  }

  @Action getAllCustomers(): void {
    // this.context.commit('setLoading', { loading: true });
    // this.setLoading(true);
    // axios({
    //   method: 'get',
    //   baseURL: Vue.prototype.baseURL,
    //   url: '/patient/list/1',
    //    headers: {
    //     'Content-Type' : 'application/json',
    //     'Accept' : 'application/json',
    //     "Access-Control-Allow-Origin" : "*",
    //     'Authorization' : 'Bearer ' + getToken()
    //   }
    // })
    //   .then(result => {
    //     console.log(result);
    //     const userInfo = result.data.data.information;
    //     const customers = [userInfo];

    //     this.setDataTable(customers);
    //     this.setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  }

  @Action searchCustomers(): void {
    this.setLoading(true);
    axios({
      method: 'get',
      baseURL: Vue.prototype.baseURL,
      url: '/user',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': 'Bearer ' + getToken()
      }
    }).then(res => {
      const customers = res.data;
      customers.forEach((p: TODO) => {
        p.orderAmount = p.orders?.length;
      });
      this.setDataTable(customers);
      this.setLoading(false);
      this.context.commit('setLoading', { loading: false });
    });
  }

  @Action quickSearch(headers: TableHeader[], qsFilter: SeachQuery): void {
    this.setLoading(true);
    // TODO: Following solution should be replaced by DB full-text search for production
    getData('customers?_embed=orders').then(res => {
      const customers = res.data.filter((r: TODO) =>
        headers.some((header: TODO) => {
          const val = get(r, [header.value]);
          return (
            (val &&
              val
                .toString()
                .toLowerCase()
                .includes(qsFilter)) ||
            false
          );
        })
      );
      customers.forEach((item: Customer) => {
        item.orderAmount = item.orders.length;
      });
      this.setDataTable(customers);
      this.setLoading(false);
    });
  }

  @Action setDataTable(items: Customer[]) {
    // const pagination = getPagination(items);
    // this.setPagination(pagination);
    this.setItems(items);
  }

  @Mutation setOrderList(orders: Order[]): void {
    this.orders = orders;
  }
  @Mutation setItems(customers: Customer[]): void {
    this.items = customers;
  }
  @Mutation setPagination(pagination: TODO): void {
    this.pagination = pagination;
  }
  @Mutation setLoading(loading: boolean): void {
    this.loading = loading;
  }
  @Mutation setCustomer(customer: Customer): void {
    this.customer = customer;
  }
}

export const customerModule = getModule(CustomerModule); // Customers;
