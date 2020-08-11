<template>
  <div>
    <v-btn class="teal darken-2  mr-2" fab small dark @click.native="print()">
      <v-icon>mdi-printer</v-icon>
    </v-btn>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';

@Component
export default class TableHeaderButtons extends Vue {
  @Prop() updateSearchPanel: () => void;

  print() {
    window.print();
  }
}
</script>
