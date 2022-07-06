<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('closedTickets') }}
        <v-spacer />
        <v-text-field
          v-model="search.name"
          type="search"
          append-icon="mdi-magnify"
          label="Search By Name"
          single-line
          hide-details
          class="mr-2"
          @keyup="fetchAllItems"
        />
        <v-text-field
          v-model="search.mobile"
          type="search"
          append-icon="mdi-magnify"
          label="Search By Mobile"
          single-line
          hide-details
          class="mr-2"
          @keyup="fetchAllItems"
        />
      </v-card-title>
      <v-data-table
        :loading="dataLoading"
        :headers="headers"
        :items="tickets"
        :items-per-page="20"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50]
        }"
        :options.sync="options"
        :server-items-length="total"
        :page-count="numberOfPages"
        @fetchAllItems="fetchAllItems"
      >
        <template v-slot:[`item.id`]="{ item }">
          {{ item.id }}
        </template>
        <template v-slot:[`item.name`]="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:[`item.phone`]="{ item }">
          {{ item.phone }}
        </template>
        <template v-slot:[`item.details`]="{ item }">
          {{ item.details }}
        </template>
        <template
          v-slot:no-data
        >
          <p>{{ $t('noData') }}</p>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../../services/ServiceFactory'
  const ticketsServices = ServiceFactory.get('tickets')
  export default {
    name: 'Users',
    data: (vm) => ({
      search: {
        name: '',
        mobile: '',
      },
      ticketData: {},
      dataLoading: false,
      ticketName: '',
      singleSelect: false,
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      selected: [],
      color: 'info',
      colors: [
        'success',
      ],
      direction: 'top center',
      vertical: true,

      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: vm.$t('name'), sortable: false, value: 'name' },
        { text: vm.$t('phone'), value: 'phone', sortable: false },
        { text: vm.$t('details'), value: 'details', sortable: false },
      ],
      tickets: [],
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
      '$route' (to, from) {
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
        const tickets = await ticketsServices.getClosedTickets(itemsPerPage, page, pageNumber, this.search)
        this.tickets = tickets.data.data
        this.total = tickets.data.total
        this.numberOfPages = tickets.data.pageCount
        this.dataLoading = false
      },
    },
  }
</script>
