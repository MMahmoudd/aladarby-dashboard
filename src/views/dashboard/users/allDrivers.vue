<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('allDrivers') }}
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
        v-model="selected"
        :single-select="singleSelect"
        show-select
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
        <template
          v-if="selected.length >= 2"
          v-slot:top
        >
          <v-toolbar
            flat
          >
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  fab
                  outlined
                  class="mx-2"
                  color="teal"
                  v-bind="attrs"
                  v-on="on"
                  @click="confirmMultiSMS(item)"
                >
                  <v-icon>
                    mdi-message-processing
                  </v-icon>
                </v-btn>
              </template>
              <span>Send SMS</span>
            </v-tooltip>
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
                  @click="sendMultiNotification(item)"
                >
                  <v-icon>
                    mdi-email-send
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t("notify") }}</span>
            </v-tooltip>
          </v-toolbar>
        </template>
        <template v-slot:[`item.id`]="{ item }">
          {{ item.id }}
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <p
            style="cursor: pointer"
            class="mb-0"
            @click="viewData(item)"
          >
            {{ item.user.userName }}
          </p>
        </template>
        <template v-slot:[`item.phone`]="{ item }">
          {{ item.user.mobile }}
        </template>
        <template v-slot:[`item.info`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                fab
                outlined
                color="info"
                v-bind="attrs"
                v-on="on"
                @click="getCarData(item.cars)"
              >
                <v-icon>
                  mdi-car-info
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('carInfo') }}</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                outlined
                fab
                class="mx-2"
                color="error"
                v-bind="attrs"
                v-on="on"
                @click="confirmReject(item)"
              >
                <v-icon>
                  mdi-close-octagon
                </v-icon>
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
                class="mx-2"
                color="error"
                v-bind="attrs"
                v-on="on"
                @click="confirmBlock(item)"
              >
                <v-icon>
                  mdi-account-lock
                </v-icon>
              </v-btn>
            </template>
            {{ $t('block') }}
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                fab
                outlined
                class="mx-2"
                color="teal"
                v-bind="attrs"
                v-on="on"
                @click="confirmSMS(item)"
              >
                <v-icon>
                  mdi-message-processing
                </v-icon>
              </v-btn>
            </template>
            <span>Send SMS</span>
          </v-tooltip>
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
            {{ $t('notify') }}
          </v-tooltip>
        </template>
        <template v-slot:[`item.image`]="{ item }">
          <v-img
            :height="50"
            :width="50"
            :src="item.licenseUrl"
            @click="openImage(item.licenseUrl)"
          />
        </template>
        <template
          v-slot:no-data
          loading
          loading-text="Loading... Please wait"
        >
          <p>{{ $t('noData') }}</p>
        </template>
      </v-data-table>
    </v-card>
    <template>
      <v-dialog
        v-model="dialog"
        max-width="1200px"
      >
        <base-material-card
          title="Cars Data"
          color="info"
        >
          <v-data-table
            :headers="carHeaders"
            :items="carData"
            class="elevation-1 mt-8"
          >
            <template v-slot:[`item.id`]="{ item }">
              {{ item.id }}
            </template>
            <template v-slot:[`item.name`]="{ item }">
              {{ item.brand.name }}
            </template>
            <template v-slot:[`item.characters`]="{ item }">
              {{ item.plateCharacters }}
            </template>
            <template v-slot:[`item.numbers`]="{ item }">
              {{ item.plateNumbers }}
            </template>
            <template v-slot:[`item.image`]="{ item }">
              <v-img
                :height="50"
                :width="50"
                :src="item.licenseUrl"
                @click="openImage(item.licenseUrl)"
              />
            </template>
          </v-data-table>
        </base-material-card>
      </v-dialog>
    </template>
    <v-dialog
      v-model="dialog1"
      max-width="500"
    >
      <v-card
        v-model="driverData"
        class="text-center"
      >
        <base-material-card
          :title="$t('confirmBlock')"
          color="error"
        >
          <v-card-text class="mt-7">
            <p>{{ $t('confirmBlock') }} {{ driverName }} {{ $t('?') }}</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              class="my-1 mx-1"
              :loading="loading"
              :disabled="disabled"
              @click="blockDriver(driverData.user.id)"
            >
              {{ $t('block') }}
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
    <v-dialog
      v-model="dialog3"
      width="500"
    >
      <v-card
        v-model="imageData"
        class="text-center"
      >
        <v-img
          :src="imageData"
          class="cls-img"
        />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog4"
      max-width="500px"
    >
      <v-card v-model="driverData">
        <base-material-card
          v-model="driverName"
          color="error"
          title="Confirm Reject"
        >
          <v-card-text class="mt-8">
            <p>{{ $t("areYouSureReject") }} {{ driverName }}{{ $t("?") }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              outlined
              @click="dialog4 = false"
            >
              {{ $t("close") }}
            </v-btn>
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click=" rejectDriver(driverData)"
            >
              {{ $t("reject") }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog5"
      max-width="500"
    >
      <v-card
        class="text-center"
      >
        <base-material-card
          title="SMS Details"
          color="teal"
        >
          <v-card-title class="mt-8">
            <v-icon
              aria-label="Close"
              @click="dialog5 = false"
            >
              mdi-close
            </v-icon>
          </v-card-title>

          <v-card-text>
            <v-textarea
              v-model="SMS"
              outlined
              name="input-7-4"
              label="SMS Details"
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
              @click="sendMultiSMS()"
            >
              {{ $t("send") }}
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="dialog5 = false"
            >
              {{ $t("close") }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog6"
      max-width="500"
    >
      <v-card
        class="text-center"
      >
        <base-material-card
          title="SMS Details"
          color="teal"
        >
          <v-card-title class="mt-8">
            <v-icon
              aria-label="Close"
              @click="dialog6 = false"
            >
              mdi-close
            </v-icon>
          </v-card-title>

          <v-card-text>
            <v-textarea
              v-model="SMS"
              outlined
              type="text"
              name="input-7-4"
              label="SMS Details"
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
              @click="sendSMS(driverData)"
            >
              {{ $t("send") }}
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
      max-width="500"
    >
      <v-card
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
              @click="dialog7 = false"
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
              @click="sendMultiNotifi()"
            >
              {{ $t("send") }}
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="dialog7 = false"
            >
              {{ $t("close") }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="dialog8"
      v-model="dialog8"
      max-width="1200px"
    >
      <base-material-card
        :title="driverData.user.userName + ` Data`"
      >
        <v-simple-table class="mt-8">
          <thead>
            <tr>
              <th class="text-center">
                {{ $t('dateOfBirth') }}
              </th>
              <th class="text-center">
                {{ $t('licenseExpDate') }}
              </th>
              <th class="text-center">
                {{ $t('totalAvgRate') }}
              </th>
              <th class="text-center">
                {{ $t('bankName') }}
              </th>
              <th class="text-center">
                {{ $t('bankAccountNumber') }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              class="text-center"
            >
              <td>
                {{ driverData.dateOfBirth }}
              </td>
              <td>{{ driverData.licenseExpDate }}</td>
              <td>{{ driverData.totalAvgRate }}</td>
              <td>{{ driverData.bankName }}</td>
              <td>{{ driverData.bankAccountNumber }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </base-material-card>
    </v-dialog>
    <base-material-snackbar
      v-if="snackbar"
      v-model="snackbar"
      :type="success"
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
      :type="error"
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
      :type="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('driverIsBlocked') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar6"
      v-model="snackbar6"
      color="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      SMS Sent Successuffly
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar7"
      v-model="snackbar7"
      color="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t("driverIsReject") }}
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
      singleSelect: false,
      dataLoading: false,
      loader: null,
      loading: false,
      disabled: false,
      selected: [],
      ids: [],
      SMS: '',
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
      imageData: '',
      carStatus: '',
      driverId: '',
      driverName: '',
      // rules: [v => v.length <= 25 || 'Max 25 characters'],
      dialog: false,
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      dialog6: false,
      dialog7: false,
      dialog8: false,
      direction: 'top center',
      snackbar: false,
      snackbar2: false,
      snackbar3: false,
      snackbar6: false,
      snackbar7: false,
      success: 'success',
      error: 'error',
      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: vm.$t('name'), sortable: false, value: 'name' },
        { text: vm.$t('phone'), value: 'phone', sortable: false },
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
        { text: vm.$t('carInfo'), value: 'info', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
      ],
      carHeaders: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: vm.$t('name'), value: 'name', sortable: false },
        { text: vm.$t('plateCharacters'), value: 'characters', sortable: false },
        { text: vm.$t('plateNumber'), value: 'numbers', sortable: false },
        { text: vm.$t('image'), value: 'image', sortable: false },
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
      viewData (item) {
        console.log(item)
        this.dialog8 = true
        this.driverData = item
      },
      confirmMultiSMS () {
        console.log(this.selected)
        this.dialog5 = true
        this.selected.map(item => {
          this.ids.push(item.user.id)
        })
      },
      confirmSMS (item) {
        this.dialog6 = true
        this.driverData = item
        console.log(item)
      },
      sendMultiNotification (item) {
        console.log(this.selected)
        this.dialog7 = true
        this.selected.map(item => {
          this.ids.push(item.user.id)
        })
      },
      confirmReject (driver) {
        this.dialog4 = true
        this.driverData = driver
        this.driverName = driver.user.userName
      },
      confirmBlock (driver) {
        this.dialog1 = true
        this.driverData = driver
        this.driverName = driver.user.userName
      },
      getCarData (cars) {
        this.dialog = true
        this.carData = cars
      },
      openImage (image) {
        this.dialog3 = true
        this.imageData = image
      },
      sendNotification (driver) {
        this.dialog2 = true
        this.notification = driver
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 100)
      },

      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const drivers = await driversService.getAllDrivers(itemsPerPage, page, pageNumber, this.search)
        this.drivers = drivers.data.data
        this.total = drivers.data.total
        this.numberOfPages = drivers.data.pageCount
        this.dataLoading = false
      },
      async blockDriver (driverId) {
        this.disabled = true
        this.loading = true
        this.drivers = driverId
        const blockSucess = await driversService.blockDriver(driverId)
        if (blockSucess) {
          this.dialog1 = false
          this.snackbar3 = true
          this.disabled = false
          this.loading = false
          this.$router.go('/all-drivers')
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async rejectDriver (driverId) {
        this.disabled = true
        this.loading = true
        this.isLoading = true
        const driverUpdatesucess = await driversService.rejectDriver(driverId.id)
        if (driverUpdatesucess) {
          this.dialog4 = false
          this.snackbar7 = true
          this.disabled = false
          this.loading = false
          this.$router.go('/all-drivers')
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendNotifi (notification) {
        this.disabled = true
        this.loading = true
        this.isloading = true
        this.notification = notification
        const userId = notification.user.id
        const sendNotifiSucess = await driversService.sendNotifi(userId, notification)
        if (sendNotifiSucess) {
          this.snackbar = true
          this.dialog2 = false
          this.disabled = false
          this.loading = false
          this.notification.title = ''
          this.notification.body = ''
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendMultiSMS () {
        this.disabled = true
        this.loading = true
        this.isloading = true
        const sendMultiSMS = await driversService.sendMultiSMS(
          this.ids,
          this.SMS,
        )
        if (sendMultiSMS) {
          this.snackbar6 = true
          this.dialog5 = false
          this.disabled = false
          this.loading = false
          this.SMS = ''
          this.ids = []
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendMultiNotifi () {
        this.disabled = true
        this.loading = true
        this.isloading = true
        const sendMultiNotifi = await driversService.sendMultiNotifi(
          this.ids,
          this.notification,
        )
        if (sendMultiNotifi) {
          this.snackbar = true
          this.dialog7 = false
          this.disabled = false
          this.loading = false
          this.notification.title = ''
          this.notification.body = ''
          this.ids = []
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendSMS (driverData) {
        this.disabled = true
        this.loading = true
        this.isloading = true
        const sendSMS = await driversService.sendSMS(
          this.driverData.user.id,
          this.SMS,
        )
        if (sendSMS) {
          this.snackbar6 = true
          this.dialog6 = false
          this.disabled = false
          this.loading = false
          this.SMS = ''
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
    },
  }
</script>
<style lang="scss">
.cls-img{
  max-height: 600px !important;
}
.v-card .v-card--material__heading{
  top: 0px !important;
}
</style>
