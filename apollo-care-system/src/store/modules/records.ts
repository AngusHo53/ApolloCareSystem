import { getData, putData, postData, deleteData } from '@/utils/demo-api';
import { Entity, MeasureData, RecordOptions } from '@/types';
import { getDefaultPagination, getPagination } from '@/utils/store-util';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import Vue from 'vue';
import http from "@/http/axios";

export interface RecordState {
    pagination: Pagination;
    loading: boolean;
    items;
}

@Module({ store, dynamic: true, name: 'recordModule' })
class RecordModule extends VuexModule implements RecordState {
    public records: MeasureData[] = []
    public totalRecords = 0;
    public loading = false;
    public pagination = getDefaultPagination();
    public items = [];

    public currentPage = 1;
    public totalPages = 0;
    public measurementTypes = {};

    @Action async getPatientRecordByUuid(options: RecordOptions): Promise<TODO> {
        this.setLoading(true);
        const result = await http.get(`/user/${options.uuid}/record?limit=${options.limit}&page=${options.page}`);

        if (result.data.data) {
            console.log(result);
            const data = result.data.data;
            // this.setPatient(result.data.data);
            this.setTotalPages(data.total_page);
            this.setCurrentPage(data.current_page);
            this.setRecords(data.records);
            await this.getMeasurementTypes();
            await this.formateData(data.records);
            this.setRecordDataTable(data.records);
            this.setLoading(false);
        } else {
            console.error(result);
        }
    }
    @Action async formateData(data: any) {
        const total = new Set();
        data.forEach(element => {
            if (element) {
                element.measure_at = new Date(element.measure_at * 1000).toLocaleString();
                // Calculate the total records
                total.add(element.measure_at);
                element.zh = this.measurementTypes[element.key].i18n.zh;
                if (this.measurementTypes[element.category]) {
                    element.category = this.measurementTypes[element.category].i18n.zh;
                }
            }
            this.items.push(element);
        })

        this.setTotalRecords(total.size);
    }

    @Action async setRecordDataTable(data: Entity[]) {
        const pagination = getPagination(data, this.totalPages, this.currentPage, data.length);
        this.setPagination(pagination);
    }

    @Action clearRecords() {
        this.setTotalPages(0);
        this.setTotalRecords(0);
        this.setRecords([]);
        this.setItems([]);
    }

    @Action async getMeasurementTypes(): Promise<TODO> {
        const result = await http.get(`/measurements/types`);
        if (result) {
            console.log(result.data.data.measurement_type)
            this.setMeasurementTypes(result.data.data.measurement_type);
        } else {
            console.error(result);
        }
    }


    @Mutation setMeasurementTypes(measurementTypes: any) {
        this.measurementTypes = measurementTypes;
    }

    @Mutation setTotalPages(totalPages: number): void {
        this.totalPages = totalPages;
    }

    @Mutation setRecords(records: MeasureData[]): void {
        this.records = records;
    }


    @Mutation setItems(items: []): void {
        this.items = items;
    }

    @Mutation setCurrentPage(page: number): void {
        this.currentPage = page;
    }

    @Mutation setTotalRecords(totalRecords: number): void {
        this.totalRecords = totalRecords;
    }

    @Mutation setPagination(pagination: TODO): void {
        this.pagination = pagination;
    }
    @Mutation setLoading(loading: boolean): void {
        this.loading = loading;
    }
}
export const recordModule = getModule(RecordModule); // patients;
