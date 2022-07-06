<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <h1>{{ $t('driversStatistics') }}</h1>
    <v-spacer />
    <div class="datePicker">
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            :return-value.sync="fromDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fromDate"
                label="From Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="fromDate"
              no-title
              scrollable
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="menu1 = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu1.save(fromDate),
                        activeDrivers(fromDate, toDate),
                        rejectedDrivers(fromDate, toDate),
                        pendingDrivers(fromDate, toDate),
                        pendingShipments(fromDate, toDate),
                        rejectedShipments(fromDate, toDate),
                        allStateShipments(fromDate, toDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :return-value.sync="toDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="toDate"
                label="To Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="toDate"
              no-title
              scrollable
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="menu2 = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu2.save(toDate),
                        activeDrivers(fromDate, toDate),
                        rejectedDrivers(fromDate, toDate),
                        pendingDrivers(fromDate, toDate),
                        pendingShipments(fromDate, toDate),
                        rejectedShipments(fromDate, toDate),
                        allStateShipments(fromDate, toDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="activatedDrivers"
          color="success"
          icon="mdi-account-supervisor-circle"
          :title="$t('activatedDrivers')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="pendingDriver"
          color="orange"
          icon="mdi-account-alert"
          :title="$t('pendingDrivers')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="rejectedDriver"
          color="red"
          icon="mdi-account-remove-outline"
          :title="$t('rejectedDrivers')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>
    </v-row>
    <h1>{{ $t('shipmentsStatistics') }}</h1>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="pendingShipment"
          color="orange"
          icon="mdi-bus-clock"
          :title="$t('pendingShipment')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="rejectedShipment"
          color="red"
          icon="mdi-car-off"
          :title="$t('rejectedShipment')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="newShipment"
          color="info"
          icon="mdi-new-box"
          :title="$t('newShipments')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="withDriver"
          color="info"
          icon="mdi-steering"
          :title="$t('withDriver')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="shipped"
          color="info"
          icon="mdi-truck"
          :title="$t('shipped')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="inWay"
          color="info"
          icon="mdi-gauge"
          :title="$t('inWay')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="delivered"
          color="info"
          icon="mdi-handshake-outline"
          :title="$t('delivered')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="driverSnipping"
          color="orange"
          icon="mdi-reload"
          :title="$t('driverSnipping')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
        class="home"
      >
        <base-material-stats-card
          v-model="snipped"
          color="green"
          icon="mdi-handshake"
          :title="$t('snipped')"
          sub-icon="mdi-calendar"
          :sub-text="$t('lastMonth')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ServiceFactory } from '../../services/ServiceFactory'
  import moment from 'moment'
  const statesServices = ServiceFactory.get('states')
  export default {
    name: 'Dashboard',

    data: vm => ({
      activatedDrivers: '',
      rejectedDriver: '',
      pendingDriver: '',
      // shipments
      pendingShipment: '',
      rejectedShipment: '',
      newShipment: '',
      withDriver: '',
      shipped: '',
      inWay: '',
      delivered: '',
      driverSnipping: '',
      snipped: '',
      options: {},
      DaysAgo: null,
      today: null,

      fromDate: null,
      toDate: null,

      menu1: false,
      menu2: false,

    }),
    watch: {
      options: {
        handler () {
          this.activeDrivers()
          this.rejectedDrivers()
          this.pendingDrivers()
          // shipments
          this.pendingShipments()
          this.rejectedShipments()
          this.allStateShipments()
        },
      },
    },
    created () {
      this.activeDrivers()
      this.rejectedDrivers()
      this.pendingDrivers()
      // shipments
      this.pendingShipments()
      this.rejectedShipments()
      this.allStateShipments()
    },

    methods: {
      saveDate (date) {
        console.log('date', date)
      },
      complete (index) {
        this.list[index] = !this.list[index]
      },
      async activeDrivers (fromDate, toDate) {
        this.dataLoading = true
        if (fromDate) {
          this.DaysAgo = fromDate
        } else {
          this.DaysAgo = moment().add(-30, 'days')._d
          this.fromDate = this.DaysAgo.toISOString().substr(0, 10)
        }
        const DaysAgoFormat = moment(this.DaysAgo).format('DD/MM/YYYY')

        if (toDate) {
          this.today = toDate
        } else {
          this.today = moment().add(-0, 'days')._d
          this.toDate = this.today.toISOString().substr(0, 10)
        }
        const todayFormat = moment(this.today).format('DD/MM/YYYY')
        const activatedDrivers = await statesServices.getAllActivateDrivers(DaysAgoFormat, todayFormat)
        this.activatedDrivers = activatedDrivers.total
        this.dataLoading = false
      },
      async rejectedDrivers (fromDate, toDate) {
        this.dataLoading = true
        if (fromDate) {
          this.DaysAgo = fromDate
        } else {
          this.DaysAgo = moment().add(-30, 'days')._d
        }
        const DaysAgoFormat = moment(this.DaysAgo).format('DD/MM/YYYY')

        if (toDate) {
          this.today = toDate
        } else {
          this.today = moment().add(-0, 'days')._d
        }
        const todayFormat = moment(this.today).format('DD/MM/YYYY')
        const rejectedDrivers = await statesServices.getAllRejectiedDrivers(DaysAgoFormat, todayFormat)
        this.rejectedDriver = rejectedDrivers.total
        this.dataLoading = false
      },
      async pendingDrivers (fromDate, toDate) {
        this.dataLoading = true
        if (fromDate) {
          this.DaysAgo = fromDate
        } else {
          this.DaysAgo = moment().add(-30, 'days')._d
        }
        const DaysAgoFormat = moment(this.DaysAgo).format('DD/MM/YYYY')

        if (toDate) {
          this.today = toDate
        } else {
          this.today = moment().add(-0, 'days')._d
        }
        const todayFormat = moment(this.today).format('DD/MM/YYYY')
        const pendingDrivers = await statesServices.getAllPendingDrivers(DaysAgoFormat, todayFormat)
        this.pendingDriver = pendingDrivers.total
        this.dataLoading = false
      },

      // Shipments
      async pendingShipments (fromDate, toDate) {
        this.dataLoading = true
        if (fromDate) {
          this.DaysAgo = fromDate
        } else {
          this.DaysAgo = moment().add(-30, 'days')._d
        }
        const DaysAgoFormat = moment(this.DaysAgo).format('DD/MM/YYYY')

        if (toDate) {
          this.today = toDate
        } else {
          this.today = moment().add(-0, 'days')._d
        }
        const todayFormat = moment(this.today).format('DD/MM/YYYY')
        const pendingShipments = await statesServices.getAllPendingShipments(DaysAgoFormat, todayFormat)
        this.pendingShipment = pendingShipments.total
        this.dataLoading = false
      },
      async rejectedShipments (fromDate, toDate) {
        this.dataLoading = true
        if (fromDate) {
          this.DaysAgo = fromDate
        } else {
          this.DaysAgo = moment().add(-30, 'days')._d
        }
        const DaysAgoFormat = moment(this.DaysAgo).format('DD/MM/YYYY')

        if (toDate) {
          this.today = toDate
        } else {
          this.today = moment().add(-0, 'days')._d
        }
        const todayFormat = moment(this.today).format('DD/MM/YYYY')
        const rejectedShipments = await statesServices.getAllRejectedShipments(DaysAgoFormat, todayFormat)
        this.rejectedShipment = rejectedShipments.total
        this.dataLoading = false
      },
      async allStateShipments (fromDate, toDate) {
        this.dataLoading = true
        if (fromDate) {
          this.DaysAgo = fromDate
        } else {
          this.DaysAgo = moment().add(-30, 'days')._d
        }
        const DaysAgoFormat = moment(this.DaysAgo).format('DD/MM/YYYY')

        if (toDate) {
          this.today = toDate
        } else {
          this.today = moment().add(-0, 'days')._d
        }
        const todayFormat = moment(this.today).format('DD/MM/YYYY')
        // New Shipments
        const newShipments = await statesServices.getAllstateShipments(0, DaysAgoFormat, todayFormat, 1)
        this.newShipment = newShipments.total
        this.dataLoading = false

        // with Driver
        const withDriverShipments = await statesServices.getAllstateShipments(1, DaysAgoFormat, todayFormat)
        this.withDriver = withDriverShipments.total
        this.dataLoading = false

        // shipped
        const shippedShipments = await statesServices.getAllstateShipments(2, DaysAgoFormat, todayFormat)
        this.shipped = shippedShipments.total
        this.dataLoading = false

        // inWay
        const inWayShipments = await statesServices.getAllstateShipments(3, DaysAgoFormat, todayFormat)
        this.inWay = inWayShipments.total
        this.dataLoading = false

        // delivered
        const deliveredShipments = await statesServices.getAllstateShipments(4, DaysAgoFormat, todayFormat)
        this.delivered = deliveredShipments.total
        this.dataLoading = false

        // driver snipping
        const driverSnippingShipments = await statesServices.getAllstateShipments(5, DaysAgoFormat, todayFormat)
        this.driverSnipping = driverSnippingShipments.total
        this.dataLoading = false

        // snipped
        const snippedShipments = await statesServices.getAllstateShipments(6, DaysAgoFormat, todayFormat)
        this.snipped = snippedShipments.total
        this.dataLoading = false
      },
    },
  }
</script>
<style lang="scss">
  h1{
    font-weight: 300;
  }
  .v-picker--date{
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .home{
    .v-card{
      .v-card--material__heading{
        top: -30px !important;
      }
    }
  }
</style>
