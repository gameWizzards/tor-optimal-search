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

        <v-btn
            v-on:click="config"
            type="submit" :disabled="!(order && nodes)">
          Configure
        </v-btn>

<!--        <v-alert-->
<!--            border="top"-->
<!--            colored-border-->
<!--            type="info"-->
<!--            elevation="1"-->
<!--        >-->
<!--          Order - positive natural number, number - pow(order)-->
<!--        </v-alert>-->
      </v-container>

      <v-container>
        <v-data-table
            :headers="headers"
            :items="configs"
            item-key="name"
            class="elevation-1"
            hide-default-footer
        >
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
      AXIOS.get('', {params: {order: this.order, nodes: this.nodes}})
          .then((result) => {
            this.configs = [{
              nodes: this.nodes,
              order: this.order,
              diameter: result.data.maxDiametr,
              edges: result.data.edgesQuantity,
              bisection: result.data.bisectionWidth,
              cost: result.data.hardwareCost,
              hOrder: result.data.hypercubeOrder
            }]
          })
      .catch(reason => {
        console.log(reason)
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
      ]
    }
  },
  data: () => ({
    nodes: null,
    order: null,
    configs: [],
    rules: [
      value => value !== 0
    ]
  }),
};
</script>
