<template>
  <v-card if='value'
    class="mx-auto"
    max-width="600"
  >
    <v-toolbar
      flat
      dense
    >
      <v-toolbar-title>
        <v-icon large>
          mdi-pause
        </v-icon>
        <span class="subheading">{{header}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span>{{new Date(measure_at).toLocaleString()}}</span>
    </v-toolbar>

    <v-card-text>
      <v-row
        class="mb-4"
        justify="space-between"
      >
        <v-col class="text-right">
          <span
            class="display-3 font-weight-light red--text"
            v-text="value"
          ></span>
          <span class="subheading font-weight-light mr-1">{{unit}}</span>
          <v-fade-transition>
            <v-avatar
              v-if="isPlaying"
              :color="color"
              :style="{
                animationDuration: animationDuration
              }"
              class="mb-1 v-avatar--metronome"
              size="12"
            ></v-avatar>
          </v-fade-transition>
        </v-col>
        <!-- <v-col class="text-right">
          <v-btn
            dark
            depressed
            fab
            @click="false"
          >
            <v-icon large>
              mdi-more
            </v-icon>
          </v-btn>
        </v-col> -->
      </v-row>
      <!-- <v-range-slider
          :tick-labels="normalRange"
          :value="[0, 1]"
          :color="color()"
          min="0"
          max="1"
          ticks="always"
          tick-size="2"
          readonly
          >
      </v-range-slider> -->
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue';
import { PatientOptions } from '@/types';
import { Component, Prop } from 'vue-property-decorator';
import { Mutation } from 'vuex-module-decorators';
@Component
export default class MeasureCard extends Vue {
    @Prop() header;
    @Prop() normalRange;
    @Prop() value;
    @Prop() unit;
    @Prop() measure_at;

    interval= null;
    isPlaying= false;

    color () {
        // if (this.value < this.normalRange[0]) return '#F0C419'
        // if (this.value > this.normalRange[1]) return '#F0C419'
        return '#4FB99F'
    }
    animationDuration () {
        return `${60 / this.value}s`
    }
}
</script>

<style>
  @keyframes metronome-example {
    from {
      transform: scale(.5);
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
