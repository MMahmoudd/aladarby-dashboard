<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('shipped') }}
        <v-spacer />
        <div class="search row">
          <v-text-field
            v-model="search.senderName"
            type="search"
            append-icon="mdi-magnify"
            :label="$t('searchBySenderName')"
            single-line
            hide-details
            class="mr-2"
            @keyup="fetchAllItems"
          />
          <v-text-field
            v-model="search.senderMobile"
            type="search"
            append-icon="mdi-magnify"
            :label="$t('searchBySenderMobile')"
            single-line
            hide-details
            class="mr-2"
            @keyup="fetchAllItems"
          />
          <v-text-field
            v-model="search.driverName"
            type="search"
            append-icon="mdi-magnify"
            :label="$t('searchByDriverName')"
            single-line
            hide-details
            class="mr-2"
            @keyup="fetchAllItems"
          />
          <v-text-field
            v-model="search.driverMobile"
            type="search"
            append-icon="mdi-magnify"
            :label="$t('searchByDriverMobile')"
            single-line
            hide-details
            class="mr-2"
            @keyup="fetchAllItems"
          />
        </div>
      </v-card-title>
      <v-data-table
        :loading="dataLoading"
        :headers="headers"
        :items="shipments"
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
        <template v-slot:[`item.senderName`]="{ item }">
          <p
            class="cursor"
            @click="getSenderData(item)"
          >
            {{ item.senderName }}
          </p>
        </template>
        <template v-slot:[`item.driverName`]="{ item }">
          <p
            class="cursor"
            @click="getDriverData(item.driver)"
          >
            {{ item.driver.name }}
          </p>
        </template>
        <template v-slot:[`item.details`]="{ item }">
          <p
            class="cursor"
            @click="getShipmentData(item)"
          >
            {{ item.category }}
          </p>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <p
            class="cursor"
            @click="getDateData(item)"
          >
            {{ item.deliveryAtDate }}
          </p>
        </template>
        <template v-slot:[`item.image`]="{ item }">
          <span
            class="cursor"
            @click="getMedia(item.media)"
          >
            <v-img
              :height="50"
              :width="50"
              :src="item.media[0]"
            />
          </span>
        </template>
        <template v-slot:[`item.payment`]="{ item }">
          <p
            class="cursor"
            @click="getPaymentData(item)"
          >
            {{ item.cost }}
          </p>
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
      max-width="1200px"
    >
      <v-card v-if="senderData.length">
        <v-card-title
          class="text-h5 grey"
          primary-title
        >
          {{ $t('senderData') }}
        </v-card-title>
        <v-data-table
          :headers="senderHeaders"
          :items="senderData"
          class="elevation-1"
        >
          <template v-slot:[`item.id`]="{ item }">
            {{ item.senderId }}
          </template>
          <template v-slot:[`item.name`]="{ item }">
            {{ item.senderName }}
          </template>
          <template v-slot:[`item.phone`]="{ item }">
            {{ item.senderMobile }}
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog1"
      max-width="1200px"
    >
      <v-card v-if="driverData.length">
        <v-card-title
          class="text-h5 grey"
          primary-title
        >
          {{ $t('driverData') }}
        </v-card-title>
        <v-data-table
          :headers="driverHeaders"
          :items="driverData"
          class="elevation-1"
        >
          <template v-slot:[`item.id`]="{ item }">
            {{ item.id }}
          </template>
          <template v-slot:[`item.name`]="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:[`item.phone`]="{ item }">
            {{ item.mobile }}
          </template>
          <template v-slot:[`item.carModel`]="{ item }">
            {{ item.carModel }}
          </template>
          <template v-slot:[`item.carNumber`]="{ item }">
            {{ item.carNumber }}
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      max-width="1200px"
    >
      <v-card v-if="dateData.length">
        <v-card-title
          class="text-h5 grey"
          primary-title
        >
          {{ $t('dateData') }}
        </v-card-title>
        <v-data-table
          :headers="dateHeaders"
          :items="dateData"
          class="elevation-1"
        >
          <template v-slot:[`item.date`]="{ item }">
            {{ item.deliveryAtDate }}
          </template>
          <template v-slot:[`item.time`]="{ item }">
            {{ item.deliveryAtTime }}
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog3"
      max-width="1200px"
    >
      <v-card v-if="shipmentData.length">
        <v-card-title
          class="text-h5 grey"
          primary-title
        >
          {{ $t('shipmentData') }}
        </v-card-title>
        <v-data-table
          :headers="shipmentHeaders"
          :items="shipmentData"
          class="elevation-1"
        >
          <template v-slot:[`item.category`]="{ item }">
            {{ item.category }}
          </template>
          <template v-slot:[`item.from`]="{ item }">
            {{ item.fromAddress }}
          </template>
          <template v-slot:[`item.to`]="{ item }">
            {{ item.toAddress }}
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog4"
      width="800px"
      height="700px"
    >
      <v-card
        v-if="mediaData.length"
        class="mx-auto"
        max-height="700px"
      >
        <v-carousel
          cycle
          height="600px"
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item
            v-for="(media, i) in mediaData"
            :key="i"
          >
            <v-sheet
              height="100%"
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
                <img
                  :src="media"
                  alt="media"
                  class="cls-img"
                >
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog5"
      max-width="1200px"
    >
      <v-card v-if="paymentData.length">
        <v-card-title
          class="text-h5 grey"
          primary-title
        >
          {{ $t('paymentData') }}
        </v-card-title>
        <v-data-table
          :headers="paymentHeaders"
          :items="paymentData"
          class="elevation-1"
        >
          <template v-slot:[`item.cost`]="{ item }">
            {{ item.cost }}
          </template>
          <template
            v-if="paymentMethod.length"
            v-slot:[`item.method`]="{ }"
          >
            <span v-if="paymentMethod === 0">
              {{ paymentMethod }}
            </span>
            <span v-else>
              {{ paymentMethod }}
            </span>
          </template>
          <template v-slot:[`item.recived`]="{ }">
            <span v-if="paymentRecived === true">
              {{ paymentRecived }}
            </span>
            <span v-else>
              {{ paymentRecived }}
            </span>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../../../services/ServiceFactory'
  const driversService = ServiceFactory.get('shipments')
  export default {
    name: 'Shipments',
    data: (vm) => ({
      search: {
        senderName: '',
        senderMobile: '',
        driverName: '',
        driverMobile: '',
      },
      shipments: [],
      //   Sender Data
      senderData: [],
      //   driver Data
      driverData: [],
      // Date Data
      dateData: [],
      // shipment Data
      shipmentData: [],
      // Media Data
      mediaData: [],
      // Payment Data
      paymentData: [],

      dataLoading: false,
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      paymentMethod: '',
      paymentRecived: '',
      dialog: false,
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      color: 'info',
      colors: [
        'success',
      ],
      direction: 'top center',
      snackbar: false,
      snackbar2: false,
      snackbar3: false,
      headers: [
        { text: vm.$t('id'), align: 'start', sortable: true, value: 'id' },
        { text: vm.$t('senderData'), sortable: false, value: 'senderName' },
        { text: vm.$t('driverName'), value: 'driverName', sortable: false },
        { text: vm.$t('shippmentData'), value: 'details', sortable: false },
        { text: vm.$t('dateData'), value: 'date', sortable: false },
        { text: vm.$t('images'), value: 'image', sortable: false },
        { text: vm.$t('paymentData'), value: 'payment', sortable: false },
      ],
      senderHeaders: [
        { text: vm.$t('id'), align: 'start', sortable: true, value: 'id' },
        { text: vm.$t('senderName'), value: 'name', sortable: false },
        { text: vm.$t('phone'), value: 'phone', sortable: false },
      ],
      driverHeaders: [
        { text: vm.$t('id'), align: 'start', sortable: true, value: 'id' },
        { text: vm.$t('driverName'), value: 'name', sortable: false },
        { text: vm.$t('phone'), value: 'phone', sortable: false },
        { text: vm.$t('carModel'), value: 'carModel', sortable: false },
        { text: vm.$t('carNumber'), value: 'carNumber', sortable: false },
        { text: vm.$t('images'), value: 'image', sortable: false },
      ],
      dateHeaders: [
        { text: vm.$t('date'), align: 'start', sortable: true, value: 'date' },
        { text: vm.$t('time'), value: 'time', sortable: false },
      ],
      shipmentHeaders: [
        { text: vm.$t('category'), align: 'start', sortable: true, value: 'category' },
        { text: vm.$t('fromAddress'), value: 'from', sortable: false },
        { text: vm.$t('toAddress'), value: 'to', sortable: false },
      ],
      paymentHeaders: [
        { text: vm.$t('cost'), align: 'start', sortable: true, value: 'cost' },
        { text: vm.$t('paymentMethod'), value: 'method', sortable: false },
        { text: vm.$t('paymentRecived'), value: 'recived', sortable: false },
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
      '$route' (to, from) {
        if (this.$route) {
          // console.log(this.$route)
        } else {

        }
      },
    },

    methods: {
      getSenderData (sender) {
        this.senderData = []
        this.senderData.push(sender)
        this.dialog = true
      },
      getDriverData (driver) {
        this.driverData = []
        this.driverData.push(driver)
        this.dialog1 = true
      },
      getDateData (date) {
        this.dateData = []
        this.dateData.push(date)
        this.dialog2 = true
      },
      getShipmentData (shipment) {
        this.shipmentData = []
        this.shipmentData.push(shipment)
        this.dialog3 = true
      },
      getMedia (media) {
        this.mediaData = media
        this.dialog4 = true
      },
      getPaymentData (payment) {
        this.paymentData = []
        this.paymentData.push(payment)
        // payment Methods
        this.paymentMethod = payment.paymentMethod
        if (this.paymentMethod === 0) {
          this.paymentMethod = 'Cash'
        } else {
          this.paymentMethod = 'Credit'
        }
        // payment recived
        this.paymentRecived = payment.paymentRecieved
        if (this.paymentRecived === true) {
          this.paymentRecived = 'paid'
        } else {
          this.paymentRecived = 'not paid'
        }
        this.dialog5 = true
      },

      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const shipments = await driversService.getShippedShipments(itemsPerPage, page, pageNumber, this.search)
        this.shipments = shipments.data.data
        this.total = shipments.data.total
        this.numberOfPages = shipments.data.pageCount
        this.dataLoading = false
      },
      async sendNotifi (notification) {
        this.isloading = true
        this.notification = notification
        const userId = notification.user.id
        const sendNotifiSucess = await driversService.sendNotifi(userId, notification)
        if (sendNotifiSucess) {
          this.snackbar = true
          this.dialog2 = false
          this.$router.go('/all-drivers')
        } else {
          console.log(sendNotifiSucess)
        }
      },
    },
  }
</script>
<style lang="scss">
.cursor{
  cursor: pointer;
  text-align: center !important;
  margin-bottom: 0 !important;
}
.text-start{
  text-align: center !important;
}
.cls-img{
  max-height: 600px !important;
  max-width: 800px !important;
}
</style>
