<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('solvedTickets') }}
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
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                fab
                outlined
                class="mx-2"
                color="orange"
                v-bind="attrs"
                v-on="on"
                @click="confirmPending(item)"
              >
                <v-icon>
                  mdi-comment-alert
                </v-icon>
              </v-btn>
            </template>
            <span>move to pending list</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                fab
                outlined
                class="mx-2"
                color="purple"
                v-bind="attrs"
                v-on="on"
                @click="confirmclosed(item)"
              >
                <v-icon>
                  mdi-comment-off
                </v-icon>
              </v-btn>
            </template>
            <span>move to closed list</span>
          </v-tooltip>
        </template>
        <template
          v-slot:no-data
          loading
          loading-text="No Data Available"
        >
          <p>{{ $t('noData') }}</p>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card
        v-model="ticketData"
        class="text-center"
      >
        <base-material-card
          :title="$t('confirmPending')"
          color="orange"
        >
          <v-card-text class="mt-8">
            <p>{{ $t('areYouSureToMove') }} {{ ticketName }} {{ $t('toPendingList') }}</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              class="my-1 mx-1"
              :loading="loading"
              :disabled="disabled"
              @click="pendTicket(ticketData)"
            >
              {{ $t('pend') }}
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="dialog = false"
            >
              {{ $t('close') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      max-width="500px"
    >
      <v-card
        v-model="ticketData"
        class="text-center"
      >
        <base-material-card
          :title="$t('confirmCloseTicket')"
          color="purple"
        >
          <v-card-text class="mt-8">
            <p>{{ $t('areYouSureToMove') }} {{ ticketName }} {{ $t('toClosedList') }}</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              class="my-1 mx-1"
              :loading="loading"
              :disabled="disabled"
              @click="closeTicket(ticketData)"
            >
              {{ $t('pend') }}
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="dialog2 = false"
            >
              {{ $t('close') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <base-material-snackbar
      v-if="snackbar"
      v-model="snackbar"
      color="success"
      :vertical="vertical"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('thisTicketIsMovedToPindingListSuccssfly') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar3"
      v-model="snackbar3"
      color="success"
      :vertical="vertical"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('thisTicketIsMovedToClosedListSuccssfly') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar4"
      v-model="snackbar4"
      color="error"
      :vertical="vertical"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('somethingError') }}
    </base-material-snackbar>
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
      loader: null,
      loading: false,
      disabled: false,
      ticketData: {},
      dataLoading: false,
      ticketName: '',
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      singleSelect: false,
      dialog: false,
      dialog1: false,
      dialog2: false,
      selected: [],
      color: 'info',
      colors: [
        'success',
      ],
      direction: 'top center',
      snackbar: false,
      snackbar2: false,
      snackbar3: false,
      snackbar4: false,
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
        { text: vm.$t('actions'), value: 'actions', sortable: false },
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
    },

    methods: {
      confirmPending (tickets) {
        this.dialog = true
        this.ticketName = tickets.name
        this.ticketData = tickets
      },
      confirmclosed (tickets) {
        this.dialog2 = true
        this.ticketName = tickets.name
        this.ticketData = tickets
      },
      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const tickets = await ticketsServices.getSolvedTickets(itemsPerPage, page, pageNumber, this.search)
        this.tickets = tickets.data.data
        this.total = tickets.data.total
        this.numberOfPages = tickets.data.pageCount
        this.dataLoading = false
      },
      async pendTicket (tickets) {
        this.disabled = true
        this.loading = true
        const ticketId = tickets.id
        const pendSucess = await ticketsServices.pendTickets(ticketId)
        if (pendSucess) {
          this.dialog = false
          this.snackbar = true
          this.disabled = false
          this.loading = false
          this.$router.go('/tickets')
        } else {
          this.snackbar4 = true
          this.disabled = false
          this.loading = false
        }
      },
      async closeTicket (tickets) {
        this.disabled = true
        this.loading = true
        const ticketId = tickets.id
        const closeSucess = await ticketsServices.closeTickets(ticketId)
        if (closeSucess) {
          this.dialog2 = false
          this.snackbar3 = true
          this.disabled = false
          this.loading = false
          this.$router.go('/tickets')
        } else {
          this.snackbar4 = true
          this.disabled = false
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss">
.v-card .v-card--material__heading{
  top: 0px !important;
}
</style>
