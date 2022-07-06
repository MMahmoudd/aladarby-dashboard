<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('rejectedShipment') }}
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('search')"
          single-line
          hide-details
        />
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
        <template
          v-slot:[`item.senderName`]="{ item }"
        >
          <v-card-text
            class="coulmn"
            @click="getSenderData(item)"
          >
            {{ item.senderName }}
          </v-card-text>
        </template>
        <template v-slot:[`item.details`]="{ item }">
          <v-card-text
            class="coulmn"
            @click="getShipmentData(item)"
          >
            {{ item.category }}
          </v-card-text>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <v-card-text
            class="coulmn"
            @click="getDateData(item)"
          >
            {{ item.deliveryAtDate }}
          </v-card-text>
        </template>
        <template v-slot:[`item.image`]="{ item }">
          <span
            class="coulmn"
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
          <v-card-text
            class="coulmn"
            @click="getPaymentData(item)"
          >
            {{ item.cost }}
          </v-card-text>
        </template>
        <template
          v-slot:no-data
          loading
          loading-text="No Data Available"
        >
          {{ $t('noData') }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                fab
                outlined
                class="mx-2"
                color="info"
                v-bind="attrs"
                v-on="on"
                @click="getResonRejectedShipments(item)"
              >
                <v-icon>
                  mdi-eye
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("reasonReject") }}</span>
          </v-tooltip>
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
          {{ $t('shippmentData') }}
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
                  lt="media"
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
    <v-dialog
      v-model="dialog6"
      max-width="500px"
    >
      <v-card>
        <v-card-title
          class="text-h5"
          primary-title
        >
          {{ $t('reasonReject') }}
        </v-card-title>
        <base-material-card
          :title="$t('reasonReject')"
          color="success"
          class="text-h5"
        >
          <v-card-text class="mt-8">
            <v-textarea
              v-model="rejectionResson"
              outlined
              readonly
              name="input-7-4"
              :label="$t('reasonReject')"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              outlined
              @click="dialog6 = false"
            >
              {{ $t("close") }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const shipmentService = ServiceFactory.get('shipments')
  export default {
    name: 'Shipments',
    data: (vm) => ({
      search: '',
      valid: false,
      senderName: '',
      shipmentInf: {},
      shipment: {},
      rejectionResson: '',
      textRules: [
        v => !!v || vm.$t('ThisFieldIsRequired'),
      ],
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
      dialog6: false,
      dialog7: false,
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
        // { text: 'Driver Name', value: 'driverName', sortable: false },
        { text: vm.$t('shippmentData'), value: 'details', sortable: false },
        { text: vm.$t('dateData'), value: 'date', sortable: false },
        { text: vm.$t('images'), value: 'image', sortable: false },
        { text: vm.$t('paymentData'), value: 'payment', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
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
        const shipments = await shipmentService.getRejectedShipments(itemsPerPage, page, pageNumber)
        this.shipments = shipments.data.data
        this.total = shipments.data.total
        this.numberOfPages = shipments.data.pageCount
        this.dataLoading = false
      },
      async getResonRejectedShipments (shipment) {
        this.isloading = true
        const shipmentId = shipment.id
        const getResonSucess = await shipmentService.getResonRejectedShipments(shipmentId)
        if (getResonSucess) {
          this.dialog6 = true
          this.rejectionResson = getResonSucess[0].audit
        } else {
          console.log(getResonSucess)
        }
      },
    },
  }
</script>
<style lang="scss">
.coulmn{
  cursor: pointer;
  text-align: center !important;
  transition: all .4s ease-in-out;
  border-radius: 8px !important;
  &:hover{
      background-color: #333 !important;
      color: #fff !important;
  }
}
.text-start{
  text-align: center !important;
}
.h3-style{
  font-weight: 300;
  padding: 18px 0;
}
.cls-img{
  max-height: 600px !important;
  max-width: 800px !important;
}
.v-card .v-card--material__heading{
  top: 0px !important;
}
</style>
