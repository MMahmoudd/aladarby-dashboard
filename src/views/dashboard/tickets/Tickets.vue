<template>
  <v-card color="basil">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold text-h2 basil--text">
        {{ $t('tickets') }}
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
        <new-tickets />
      </v-tab-item>

      <v-tab>
        {{ $t('pending') }}
      </v-tab>
      <v-tab-item>
        <pending-tickets />
      </v-tab-item>

      <v-tab>
        {{ $t('solved') }}
      </v-tab>
      <v-tab-item>
        <solved-tickets />
      </v-tab-item>

      <v-tab>
        {{ $t('closed') }}
      </v-tab>
      <v-tab-item>
        <closed-tickets />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
  import NewTickets from '../component/tickets/NewTickets'
  import PendingTickets from '../component/tickets/PendingTickets'
  import SolvedTickets from '../component/tickets/SolvedTickets'
  import ClosedTickets from '../component/tickets/ClosedTickets'
  export default {
    components: {
      NewTickets,
      PendingTickets,
      SolvedTickets,
      ClosedTickets,
    },
    data () {
      return {
        tab: null,
      }
    },
  }
</script>
