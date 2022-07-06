<template>
  <v-card>
    <v-toolbar
      flat
      color="#363636"
      dark
    >
      <v-toolbar-title>App Setting</v-toolbar-title>
    </v-toolbar>
    <v-tabs vertical>
      <v-tab left>
        <v-icon left>
          mdi-map-search-outline
        </v-icon>
        Driver Search Range
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <search-range />
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab left>
        <v-icon left>
          mdi-cash-100
        </v-icon>
        App Debit Limit
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <app-debit-limit />
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab left>
        <v-icon left>
          mdi-cash
        </v-icon>
        App Fees
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <app-fees />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
  import SearchRange from '../component/appSetting/SearchRange'
  import AppDebitLimit from '../component/appSetting/AppDebitLimit'
  import AppFees from '../component/appSetting/AppFees'
  export default {
    components: {
      SearchRange,
      AppDebitLimit,
      AppFees,
    },
  }
</script>
<style lang="scss">
  .v-tab{
    justify-content: left !important;
  }
</style>
