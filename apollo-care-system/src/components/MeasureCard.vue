<template>
  <v-card
    if="value"
    class="mx-auto rounded-card"
    max-width="600"
    outlined
    style="border-radius:30px;"
  >
    <v-toolbar flat>
      <v-toolbar-title>
        <span class="measure-title font-weight-bold">{{header}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="measure_at">{{ measure_at}}</span>
    </v-toolbar>

    <v-card-text>
      <v-row class="mb-4" justify="space-between">
        <v-col class="text-right">
          <span
            class="text-h4 font-weight-light"
            v-bind:style="{color:color()}"
            v-text="value + ' '"
          ></span>
          <span class="subheading font-weight-light mr-1">{{unit}}</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { MEASUREMENT_COLORS } from "@/utils/store-util";

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

.measure-title{
  font-size: 1.8rem;
}

.v-avatar--metronome {
  animation-name: metronome-example;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
</style>
