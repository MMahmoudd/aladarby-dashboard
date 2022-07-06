<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t("transactionHistory") }}
        <v-spacer />
        <!-- <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('search')"
          single-line
          hide-details
        /> -->
      </v-card-title>
      <v-data-table
        :loading="dataLoading"
        :headers="headers"
        :items="drivers"
        :items-per-page="20"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50],
        }"
        :options.sync="options"
        :server-items-length="total"
        :page-count="numberOfPages"
        @fetchAllItems="fetchAllItems"
      >
        <template v-slot:[`item.id`]="{ item }">
          {{ item.id }}
        </template>
        <template v-slot:[`item.driverName`]="{ item }">
          {{ item.account.user.userName }}
        </template>
        <template v-slot:[`item.phoneNumber`]="{ item }">
          {{ item.account.user.mobile }}
        </template>
        <template v-slot:[`item.BankName`]="{ item }">
          {{ item.details.bankName }}
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.transactionDescription }}
        </template>
        <template v-slot:[`item.date`]="{ item }">
          {{ item.transactionDate }}
        </template>
        <template v-slot:[`item.transactionRef`]="{ item }">
          {{ item.details.transactionRef }}
        </template>
        <template
          v-slot:no-data
          loading
          loading-text="No Data Available"
        >
          <p>{{ $t("noData") }}</p>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const paymentServices = ServiceFactory.get('payment')
  export default {
    name: 'Drivers',
    data: (vm) => ({
      search: '',
      dataLoading: false,
      drivers: [],
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: vm.$t('driverName'), sortable: false, value: 'driverName' },
        { text: vm.$t('phone'), sortable: false, value: 'phoneNumber' },
        { text: vm.$t('bankName'), sortable: false, value: 'BankName' },
        { text: vm.$t('deserveAmount'), value: 'amount', sortable: false },
        { text: vm.$t('transactionRef'), value: 'transactionRef', sortable: false },
        { text: vm.$t('date'), value: 'date', sortable: false },

      ],
    }),

    computed: {
      parsedDirection () {
        return this.direction.split(' ')
      },
    },

    watch: {
      options: {
        handler () {
          this.fetchAllItems()
        },
      },
      deep: true,
      dialog (val) {
        val || this.close()
      },
      $route (to, from) {
        if (this.$route) {
        // console.log(this.$route)
        } else {
        }
      },
    },

    methods: {
      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const transactions = await paymentServices.getTransformsHistory(
          itemsPerPage,
          page,
          pageNumber,
        )
        this.drivers = transactions.data.data
        this.total = transactions.data.total
        this.numberOfPages = transactions.data.pageCount
        this.dataLoading = false
      },
    },
  }
</script>
