<template>
  <v-card if="value" class="mx-auto" max-width="600">
    <v-toolbar flat dense>
      <v-toolbar-title>
        <v-icon large>mdi-pause</v-icon>
        <span class="subheading">{{header}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="measure_at">{{new Date(measure_at * 1000).toLocaleString()}}</span>
    </v-toolbar>

    <v-card-text>
      <v-row class="mb-4" justify="space-between">
        <v-col class="text-right">
          <span class="text-h4 font-weight-light" v-bind:style="{color:color()}" v-text="value"></span>
          <span class="subheading font-weight-light mr-1">{{unit}}</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from "vue";
import { PatientOptions } from "@/types";
import { Component, Prop } from "vue-property-decorator";
import { Mutation } from "vuex-module-decorators";
import { MEASUREMENT_STATUS, MEASUREMENT_COLORS } from "@/utils/store-util";
@Component
export default class MeasureCard extends Vue {
  @Prop() header;
  @Prop() value;
  @Prop() state;
  @Prop() unit;
  @Prop() measure_at;

  create() {}

  color() {
    if (this.state) {
      return MEASUREMENT_COLORS[this.state];
    }

    return MEASUREMENT_COLORS[3];
  }
  animationDuration() {
    return `${60 / this.value}s`;
  }
}
</script>

<style>
@keyframes metronome-example {
  from {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
}

.v-avatar--metronome {
  animation-name: metronome-example;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
</style>
