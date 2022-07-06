<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('pendingVerification') }}
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
          class="m-1"
          @keyup="fetchAllItems"
        />
      </v-card-title>
      <v-data-table
        :loading="dataLoading"
        :headers="headers"
        :items="drivers"
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
          {{ item.userName }}
        </template>
        <template v-slot:[`item.phone`]="{ item }">
          {{ item.mobile }}
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
                @click="sendNotification(item)"
              >
                <v-icon>
                  mdi-email-send
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('notify') }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                fab
                outlined
                class="mx-2"
                color="success"
                v-bind="attrs"
                v-on="on"
                @click="confirm(item)"
              >
                <v-icon>
                  mdi-check
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('active') }}</span>
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
      v-model="dialog1"
      max-width="500"
    >
      <v-card
        v-model="driverData"
        class="text-center"
      >
        <base-material-card
          :title="$t('confirmActivate')"
          color="success"
        >
          <v-card-text class="mt-8">
            <p>{{ $t('areYouSureConfirm') }} {{ driverName }}{{ $t('?') }}</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              class="my-1 mx-1"
              :loading="loading"
              :disabled="disabled"
              @click="confirmDriver(driverData)"
            >
              {{ $t('confirm') }}
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="dialog1 = false"
            >
              {{ $t('close') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      max-width="500"
    >
      <v-card
        v-model="driverData"
        class="text-center"
      >
        <base-material-card
          title="Notification Details"
          color="orange"
        >
          <v-card-title class="mt-8">
            <v-text-field
              v-model="notification.title"
              counter="25"
              outlined
              label="Notification Title"
              class="notification-title"
            />
            <v-spacer />

            <v-icon
              aria-label="Close"
              @click="dialog2 = false"
            >
              mdi-close
            </v-icon>
          </v-card-title>

          <v-card-text>
            <v-textarea
              v-model="notification.body"
              outlined
              name="input-7-4"
              label="Notification Body"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              class="my-1 mx-1"
              :loading="loading"
              :disabled="disabled"
              @click="sendNotifi(notification)"
            >
              {{ $t('send') }}
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
      :type="color"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('massegeSentSuccss') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar2"
      v-model="snackbar2"
      :type="color"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('somethingError') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar3"
      v-model="snackbar3"
      color="green"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('thisDriverConfirmed') }}
    </base-material-snackbar>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const driversService = ServiceFactory.get('drivers')
  export default {
    name: 'Drivers',
    data: (vm) => ({
      search: {
        name: '',
        mobile: '',
      },
      loader: null,
      loading: false,
      disabled: false,
      dataLoading: false,
      drivers: [],
      driverData: {},
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      notification: {
        title: '',
        body: '',
        payload: {
          driverId: '',
          clientId: '',
        },
      },
      carData: [],
      driverId: '',
      driverName: '',
      // rules: [v => v.length <= 25 || 'Max 25 characters'],
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
      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: vm.$t('name'), sortable: false, value: 'name' },
        { text: vm.$t('phone'), value: 'phone', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
        { text: '', value: 'data-table-expand' },
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
    },

    methods: {
      confirm (driver) {
        this.dialog1 = true
        this.driverData = driver
        this.driverName = driver.userName
      },
      sendNotification (driver) {
        this.dialog2 = true
        this.notification = driver
      },
      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const drivers = await driversService.getPendingVirification(itemsPerPage, page, pageNumber, this.search)
        this.drivers = drivers.data.data
        this.total = drivers.data.total
        this.numberOfPages = drivers.data.pageCount
        this.dataLoading = false
      },
      async confirmDriver (driverId) {
        this.disabled = true
        this.loading = true
        this.drivers = driverId
        this.driverId = driverId.id
        const confirmSucess = await driversService.confirmDriver(this.driverId)
        if (confirmSucess) {
          this.dialog1 = false
          this.snackbar3 = true
          this.disabled = false
          this.loading = false
          this.$router.go('/pending-verification')
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendNotifi (notification) {
        this.disabled = true
        this.loading = true
        this.notification = notification
        const userId = notification.user.id
        const sendNotifiSucess = await driversService.sendNotifi(userId, notification)
        if (sendNotifiSucess) {
          this.snackbar = true
          this.dialog2 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/pending-verification')
        } else {
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
