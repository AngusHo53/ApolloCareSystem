<template>
  <v-container fluid>
    <v-flex xs12>
      <v-card v-if='patient'>
        <v-card-title>
          <span class="title">
            {{patient.name}}, {{ patient.id_card}}
          </span>
          <v-spacer></v-spacer>
            <div>
              <v-btn class="teal darken-2  mr-2" fab small dark @click.native="test()">
              <v-icon>mdi-printer</v-icon>
              </v-btn>
            </div>
        </v-card-title>
        <!--<Table v-if="loading === false" :headers="headers" :items="patients" :pagination="pagination" @updateTableData="updateTableData"
        @search="searchPatients" @dataTableClickHandler="changeToPatientRecordPage"></Table> -->
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
import Table from '@/components/Table.vue';
import TableHeaderButtons from '@/components/TableHeaderButtons.vue'
import SearchPanel from '@/components/SearchPanel.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { debounce } from 'lodash';
import { buildSearchFilters, buildJsonServerQuery, clearSearchFilters } from '@/utils/app-util';
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import {  Entity } from '../types';
import { patientModule } from '@/store/modules/patients';
import { appModule } from '@/store/modules/app';
import axios from "axios";
import { getToken } from "../utils/app-util";

@Component({
  components: {
    Table,
    TableHeaderButtons,
    SearchPanel,
    ConfirmDialog
  }
})
export default class PatientRecords extends Vue {
  created() {
    console.log('create');
    if(this.$router.currentRoute.params.patient){
      patientModule.setPatient(this.$router.currentRoute.params.patient);
    }else {
      patientModule.getPatientById(this.$router.currentRoute.params.id);
      
    }
    console.log(patientModule.patient);
  }
  test() {

  }
  get patient() {
    return patientModule.patient;
  }
}
</script>