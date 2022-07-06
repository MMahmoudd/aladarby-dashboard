<template>
  <v-card
    class="shipments-class"
    color="basil"
  >
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold text-h2 basil--text">
        {{ $t('trckingShipment') }}
      </h1>
    </v-card-title>

    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="basil"
      grow
    >
      <v-tab>
        {{ $t('new') }}
      </v-tab>
      <v-tab-item>
        <new-shipment />
      </v-tab-item>

      <v-tab>
        {{ $t('withDriver') }}
      </v-tab>
      <v-tab-item>
        <with-driver />
      </v-tab-item>

      <v-tab>
        {{ $t('shipped') }}
      </v-tab>
      <v-tab-item>
        <shipped />
      </v-tab-item>

      <v-tab>
        {{ $t('inWay') }}
      </v-tab>
      <v-tab-item>
        <in-way />
      </v-tab-item>

      <v-tab>
        {{ $t('delivered') }}
      </v-tab>
      <v-tab-item>
        <delivered />
      </v-tab-item>

      <v-tab>
        {{ $t('canceled') }}
      </v-tab>
      <v-tab-item>
        <canceled />
      </v-tab-item>

      <v-tab>
        {{ $t('driverSnipping') }}
      </v-tab>
      <v-tab-item>
        <driver-snipping />
      </v-tab-item>

      <v-tab>
        {{ $t('snipped') }}
      </v-tab>
      <v-tab-item>
        <snipped />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
  import NewShipment from '../component/shipment/progress/new-shipment'
  import WithDriver from '../component/shipment/progress/with-driver'
  import Shipped from '../component/shipment/progress/shipped'
  import InWay from '../component/shipment/progress/InWay'
  import Delivered from '../component/shipment/progress/Delivered'
  import Canceled from '../component/shipment/progress/Canceled'
  import DriverSnipping from '../component/shipment/progress/Driver-Snipping'
  import Snipped from '../component/shipment/progress/Snipped'
  export default {
    components: {
      NewShipment,
      WithDriver,
      Shipped,
      InWay,
      Delivered,
      Canceled,
      DriverSnipping,
      Snipped,
    },
    data () {
      return {
        tab: null,
      }
    },
  }
</script>
<style lang="scss">
  .shipments-class{
    width: 98%;
    margin: auto;
    overflow-y: auto;
  }
</style>
