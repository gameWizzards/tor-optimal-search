<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <div class="d-flex align-center">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            transition="scale-transition"
            width="40"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
          href="https://github.com/vuetifyjs/vuetify/releases/latest"
          target="_blank"
          text
      >
        <span class="mr-2">Information</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-text-field type="number"
                      :rules="rules"
                      label="Nodes"
                      v-model="nodes">
        </v-text-field>
        <v-text-field type="number"
                      label="Order"
                      v-model="order">
        </v-text-field>
        <v-select
            v-model="searchType"
            placeholder="Select search type"
            style="width: 50%"
            :items="configTypes"
            item-text="text"
            item-value="value"
            return-object>
        </v-select>
        <v-btn
            style="overflow: hidden"
            v-on:click="config"
            type="submit" :disabled="!(order && nodes)">
          Configure
        </v-btn>
      </v-container>
      <v-container>
        <v-data-table
            :headers="headers"
            :items="configs"
            item-key="name"
            class="elevation-1"
            hide-default-footer
        >
          <template v-slot:top>
            <v-alert
                border="top"
                colored-border
                type="error"
                elevation="2"
                v-if="errors"
            >
              {{ errorMessage }}
            </v-alert>
          </template>
        </v-data-table>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {AXIOS} from "../http-commons";

export default {
  name: 'App',

  components: {},
  methods: {
    config() {
      this.errors = false
      AXIOS.get('config/' + this.searchType.value, {params: {order: this.order, nodes: this.nodes}})
          .then((result) => {
            this.configs = [{
              nodes: this.nodes,
              order: this.order,
              diameter: result.data.maxDiametr,
              edges: result.data.edgesQuantity,
              bisection: result.data.bisectionWidth,
              cost: result.data.hardwareCost,
              hOrder: result.data.hypercubeOrder,
              numbers: result.data.numbers.join('*')
            }]
          })
          .catch((reason) => {
            this.errorMessage = reason
            this.configs = []
            this.errors = true
          })
    }
  },
  computed: {
    headers() {
      return [
        {text: 'Nodes', value: 'nodes'},
        {text: 'Order', value: 'order'},
        {text: 'Hypercube Order', value: 'hOrder'},
        {text: 'Edges Count', value: 'edges'},
        {text: 'Max Diameter', value: 'diameter'},
        {text: 'Bisection Width', value: 'bisection'},
        {text: 'Hardware Cost', value: 'cost'},
        {text: 'Dimensions', value: 'numbers'},
      ]
    },
    configTypes() {
      return [
        {value: "SINGLE", text : 'Only Selected'},
        {value: "UPPER", text : 'Upper Optimal'},
        {value: "LOWER", text : 'Lower Optimal'},
        {value: "ALL", text : 'All Possible'},
      ]
    }
  },
  data: () => ({
    nodes: null,
    order: null,
    configs: [],
    rules: [
      value => value !== 0
    ],
    errors: false,
    errorMessage: null,
    searchType: {value: null, text: null},
  }),
};
</script>
