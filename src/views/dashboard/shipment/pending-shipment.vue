<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('pendingShipment') }}
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
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                fab
                outlined
                color="error"
                class="mx-2"
                v-bind="attrs"
                v-on="on"
                @click="confirmReject(item)"
              >
                <v-icon>
                  mdi-close-octagon
                </v-icon>
                <!-- {{ $t("reject") }} -->
              </v-btn>
            </template>
            <span>{{ $t("reject") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                fab
                outlined
                color="success"
                class="mx-2"
                v-bind="attrs"
                v-on="on"
                @click="confirmApprove(item)"
              >
                <v-icon>
                  mdi-check
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("accept") }}</span>
          </v-tooltip>
        </template>
        <template
          v-slot:no-data
          loading
          loading-text="No Data Available"
        >
          {{ $t('noData') }}
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
    <v-dialog
      v-model="dialog6"
      max-width="500px"
    >
      <v-card v-model="shipmentInf">
        <base-material-card
          :title="$t('confirmApprove')"
          color="success"
        >
          <v-card-text class="mt-8">
            {{ $t('areYOuSureActive') }} {{ senderName }} {{ $t('?') }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click="approveShipment(shipmentInf)"
            >
              {{ $t("active") }}
            </v-btn>
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
    <v-dialog
      v-model="dialog7"
      max-width="500px"
    >
      <v-card>
        <base-material-card
          :title="$t('confirmReject')"
          color="error"
          class="text-h5"
        >
          <v-form
            ref="form"
            v-model="valid"
            class="mt-8"
          >
            <v-container>
              <h3 class="h3-style">
                {{ $t('areYouSureReject') }} {{ senderName }} {{ $t('?') }}
              </h3>
              <v-textarea
                v-model="rejectionResson"
                outlined
                :rules="textRules"
                required
                name="input-7-4"
                :label="$t('TypeTheReasonForRejection')"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="success"
                  outlined
                  :loading="loading"
                  :disabled="disabled"
                  @click="rejectShipment(shipment, rejectionResson)"
                >
                  {{ $t("reject") }}
                </v-btn>
                <v-btn
                  color="error"
                  outlined
                  @click="dialog7 = false"
                >
                  {{ $t("close") }}
                </v-btn>
              </v-card-actions>
            </v-container>
          </v-form>
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
      {{ $t('sipmentActivated') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar1"
      v-model="snackbar1"
      color="success"
      :vertical="vertical"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('sipmentRejeceted') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar2"
      v-model="snackbar2"
      color="red"
      :vertical="vertical"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('somthingWrong') }}
    </base-material-snackbar>
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
      loader: null,
      loading: false,
      disabled: false,
      loaderTime: null,
      direction: 'top center',
      snackbar: false,
      snackbar1: false,
      snackbar2: false,
      headers: [
        { text: vm.$t('id'), align: 'start', sortable: true, value: 'id' },
        { text: vm.$t('senderData'), sortable: false, value: 'senderName' },
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
    },

    methods: {
      confirmApprove (shipment) {
        this.shipmentInf = shipment
        this.senderName = shipment.senderName
        this.dialog6 = true
      },
      confirmReject (shipment) {
        this.shipment = shipment
        this.senderName = shipment.senderName
        this.dialog7 = true
      },
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
        const shipments = await shipmentService.getPendingShipments(itemsPerPage, page, pageNumber)
        this.shipments = shipments.data.data
        this.total = shipments.data.total
        this.numberOfPages = shipments.data.pageCount
        this.dataLoading = false
      },
      async approveShipment (shipment) {
        this.disabled = true
        this.loading = true
        const shipmentId = shipment.id
        const approveSucess = await shipmentService.approveShipment(shipmentId)
        this.dialog6 = false
        if (approveSucess) {
          this.snackbar = true
          this.$router.go('/pending-shipment')
        } else {
          console.log(approveSucess)
          this.snackbar2 = true
        }
      },
      async rejectShipment (shipment, rejectionResson) {
        this.disabled = true
        this.loading = true
        this.$refs.form.validate()
        if (this.$refs.form.validate() === false) {
          this.disabled = false
          this.loading = false
          return false
        } else {
          const shipmentId = shipment.id
          const rejecetSucess = await shipmentService.rejectShipment(shipmentId, rejectionResson)
          this.dialog7 = false
          if (rejecetSucess) {
            this.snackbar1 = true
            this.disabled = false
            this.loading = false
            this.$router.go('/pending-shipment')
          } else {
            this.disabled = false
            this.loading = false
            this.snackbar2 = true
          }
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
  font-size: 22px;
}
.cls-img{
  max-height: 600px !important;
  max-width: 800px !important;
}
.v-card .v-card--material__heading{
  top: 0px !important;
}
</style>
