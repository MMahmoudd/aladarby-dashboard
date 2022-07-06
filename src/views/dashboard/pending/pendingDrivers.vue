<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t("pendingDrivers") }}
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
        item-key="id"
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
                <!-- {{ item.user.userName }} -->
              </v-btn>
            </template>
            <span>{{ $t('carInfo') }}</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.status`]="{item}">
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
                @click="checkSataus(item)"
              >
                <v-icon>
                  mdi-list-status
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("checkStatus") }}</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
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
            <span>{{ $t("notify") }}</span>
          </v-tooltip>
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
                outlined
                fab
                class="mx-2"
                color="success"
                v-bind="attrs"
                v-on="on"
                @click="confirmActive(item)"
              >
                <v-icon>
                  mdi-check
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("active") }}</span>
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
          loading-text="No Data Available"
        >
          <p>{{ $t("noData") }}</p>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="1200px"
    >
      <base-material-card
        title="Cars Info"
        color="info"
      >
        <v-data-table
          :headers="carHeaders"
          :items="carData"
          :items-per-page="10"
          class="elevation-1 mt-8"
        >
          <template v-slot:[`item.id`]="{ item }">
            {{ item.id }}
          </template>
          <template v-slot:[`item.name`]="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:[`item.color`]="{ item }">
            {{ item.color }}
          </template>
          <template v-slot:[`item.number`]="{ item }">
            {{ item.plateNumbers }}
          </template>
          <template v-slot:[`item.characters`]="{ item }">
            {{ item.plateCharacters }}
          </template>
          <!-- <template v-slot:item.category="{ item }">
          {{ item.category.name }}
        </template>-->
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
    <v-dialog
      v-model="dialog1"
      max-width="500px"
    >
      <v-card v-model="driverData">
        <base-material-card
          v-model="driverName"
          color="success"
          title="Confirm Active"
        >
          <v-card-text class="mt-8">
            <p>{{ $t("areYOuSureActive") }} {{ driverName }}{{ $t("?") }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              outlined
              @click="dialog1 = false"
            >
              {{ $t("close") }}
            </v-btn>
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click="approveDriver(driverData)"
            >
              {{ $t("active") }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog3"
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
              @click="dialog3 = false"
            >
              {{ $t("close") }}
            </v-btn>
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click="rejectDriver(driverData)"
            >
              {{ $t("reject") }}
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
              {{ $t("send") }}
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="dialog2 = false"
            >
              {{ $t("close") }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog4"
      max-width="500"
    >
      <v-card
        v-model="imageData"
        class="text-center"
      >
        <v-img :src="imageData" />
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
      v-model="snackbar"
      :type="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t("massegeSentSuccss") }}
    </base-material-snackbar>

    <base-material-snackbar
      v-model="snackbar1"
      :type="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t("driverIsActive") }}
    </base-material-snackbar>
    <base-material-snackbar
      v-model="snackbar2"
      :type="error"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t("somethingError") }}
    </base-material-snackbar>
    <base-material-snackbar
      v-model="snackbar3"
      :type="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t("driverIsReject") }}
    </base-material-snackbar>
    <base-material-snackbar
      v-model="snackbar4"
      :type="error"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t("driverNotCompleteData") }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar5"
      v-model="snackbar5"
      :type="error"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ massege }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar6"
      v-model="snackbar6"
      :type="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ massege }}
    </base-material-snackbar>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const driversService = ServiceFactory.get('drivers')
  const usersService = ServiceFactory.get('users')
  const carsServices = ServiceFactory.get('cars')
  export default {
    data: (vm) => ({
      search: {
        name: '',
        mobile: '',
      },
      dataLoading: false,
      singleSelect: false,
      loader: null,
      loading: false,
      disabled: false,
      selected: [],
      ids: [],
      SMS: '',
      driverData: {},
      driverName: '',
      carData: {},
      carId: '',
      imageData: '',
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
      dialog: false,
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      dialog6: false,
      dialog7: false,
      dialog8: false,
      success: 'success',
      error: 'error',
      direction: 'top center',
      snackbar: false,
      snackbar1: false,
      snackbar2: false,
      snackbar3: false,
      snackbar4: false,
      snackbar5: false,
      snackbar6: false,
      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: vm.$t('name'), value: 'name', sortable: false },
        { text: vm.$t('phone'), value: 'phone', sortable: false },
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
        { text: vm.$t('status'), value: 'status', sortable: false },
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
        { text: vm.$t('plateNumber'), value: 'number', sortable: false },
        { text: vm.$t('plateCharacters'), value: 'characters', sortable: false },
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
      // { text: 'Category', value: 'category', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: '',
        name: '',
        address: '',
        phone: '',
        image: '',
        mail: '',
      },
      defaultItem: {
        id: '',
        name: '',
        address: '',
        phone: '',
        image: '',
        mail: '',
      },
      drivers: [],
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
      // loader () {
      //   const l = this.loader
      //   this[l] = !this[l]

      //   setTimeout(() => (this[l] = false), 99000)

      //   this.loader = null
      // },
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
      confirmActive (driver) {
        this.dialog1 = true
        this.driverData = driver
        this.driverName = driver.user.userName
      },
      confirmReject (driver) {
        this.dialog3 = true
        this.driverData = driver
        this.driverName = driver.user.userName
      },
      sendNotification (driver) {
        this.dialog2 = true
        this.notification = driver
      },
      getCarData (cars) {
        this.dialog = true
        this.carData = cars
      },
      openImage (image) {
        this.dialog4 = true
        this.imageData = image
      },
      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const drivers = await driversService.getPendingDrivers(itemsPerPage, page, pageNumber, this.search)
        this.drivers = drivers.data.data
        this.total = drivers.data.total
        this.numberOfPages = drivers.data.pageCount
        this.dataLoading = false
      },

      async getDriverNotifications (driver) {
        const notifications = await usersService.getAllNotifications(
          driver.user.id,
        )
        console.log(notifications)
      },

      async approveDriver (driver) {
        this.disabled = true
        this.loading = true
        const driverId = driver.id
        const carId = driver.cars[0].id
        const driverUpdatesucess = await driversService.approveDriver(driverId)
        const carUpdatesucess = await carsServices.approveCar(carId)
        console.log(carUpdatesucess)
        if (driverUpdatesucess) {
          this.snackbar1 = true
          this.dialog1 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/pending-drivers')
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async rejectDriver (driverId) {
        this.disabled = true
        this.loading = true
        this.carId = driverId.cars[0].id
        const driverUpdatesucess = await driversService.rejectDriver(driverId.id)
        carsServices.rejectCar(this.carId)

        if (driverUpdatesucess) {
          this.dialog3 = false
          this.snackbar3 = true
          this.disabled = false
          this.loading = false
          this.$router.go('/pending-drivers')
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
        const sendNotifiSucess = await driversService.sendNotifi(
          userId,
          notification,
        )
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
        const sendMultiSMS = await driversService.sendMultiSMS(
          this.ids,
          this.SMS,
        )
        if (sendMultiSMS) {
          this.snackbar = true
          this.dialog5 = false
          this.disabled = false
          this.loading = false
          this.SMS = ''
          this.ids = []
          console.log(this.ids)
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendMultiNotifi () {
        this.disabled = true
        this.loading = true
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
          console.log(this.ids)
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendSMS (driverData) {
        this.disabled = true
        this.loading = true
        // console.log(driverData)
        console.log('driverId', this.driverData.user.id)
        const sendSMS = await driversService.sendSMS(
          this.driverData.user.id,
          this.SMS,
        )
        // console.log(sendSMS)
        if (sendSMS) {
          this.snackbar = true
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
      async checkSataus (driver) {
        this.disabled = true
        this.loading = true
        // console.log(driver)
        const driverId = driver.id
        const status = await driversService.checkStatus(driverId)
        console.log(status)
        if (status.done === true) {
          if (status.data.errorCodes[0] === 61) {
            status.data.errorCodes[0] = 'تاريخ الميلاد لا يطابق سجلات NIC'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 2) {
            status.data.errorCodes[0] = 'لم يتم العثور على هذا السائق'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 3) {
            status.data.errorCodes[0] = 'غير مصرح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 5) {
            status.data.errorCodes[0] = 'شهادة اعتماد غير صالحة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 7) {
            status.data.errorCodes[0] = 'نوع الهوية مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 8) {
            status.data.errorCodes[0] = 'رقم الهوية مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 9) {
            status.data.errorCodes[0] = 'تاريخ الميلاد مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 10) {
            status.data.errorCodes[0] = 'تاريخ التسجيل مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 11) {
            status.data.errorCodes[0] = 'رقم الموبايل مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 12) {
            status.data.errorCodes[0] = 'المنطقة مطلوبة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 13) {
            status.data.errorCodes[0] = 'المدينة مطلوبة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 14) {
            status.data.errorCodes[0] = 'نوع السيارة مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 15) {
            status.data.errorCodes[0] = 'رقم السيارة مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 17) {
            status.data.errorCodes[0] = 'نوع الهوية غير صالح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 18) {
            status.data.errorCodes[0] = 'يوجدد خطأ في المنطقة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 19) {
            status.data.errorCodes[0] = 'يوجد خطأ في المدينة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 20) {
            status.data.errorCodes[0] = 'رقم الهوية غير صحيح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 21) {
            status.data.errorCodes[0] = 'رقم السائق غير صالح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 22) {
            status.data.errorCodes[0] = 'المدينة لا تنتمي إلى المنطقة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 23) {
            status.data.errorCodes[0] = 'الرقم المطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 24) {
            status.data.errorCodes[0] = 'السلطة مطلوبة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 25) {
            status.data.errorCodes[0] = 'رقم الفئة مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 26) {
            status.data.errorCodes[0] = 'وقت التسليم مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 27) {
            status.data.errorCodes[0] = 'رقم السلطة غير صالح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 28) {
            status.data.errorCodes[0] = 'رقم الفئة غير صالح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 29) {
            status.data.errorCodes[0] = 'رقم الطلب غير صالح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 36) {
            status.data.errorCodes[0] = 'إدخالات فارغة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 37) {
            status.data.errorCodes[0] = 'رقم سبب الإلغاء غير صالح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 38) {
            status.data.errorCodes[0] = 'الإحداثيات مطلوبة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 39) {
            status.data.errorCodes[0] = 'رقم طریقة الدفع مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 40) {
            status.data.errorCodes[0] = 'السعر مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 42) {
            status.data.errorCodes[0] = 'رقم طريقة الدفع غير صالح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 44) {
            status.data.errorCodes[0] = 'هوية غير صالحة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 45) {
            status.data.errorCodes[0] = 'نوع السيارة غير صالح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 47) {
            status.data.errorCodes[0] = 'سائق موجود بالفعل'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 48) {
            status.data.errorCodes[0] = 'تحقق من خطأ مكرر'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 49) {
            status.data.errorCodes[0] = 'الجنسية ورقم التعريف ورقم الهوية ونوعها لا يمكن تغييرها'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 50) {
            status.data.errorCodes[0] = 'الاسم مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 51) {
            status.data.errorCodes[0] = 'الموقع مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 52) {
            status.data.errorCodes[0] = 'لا يمكن قبول الطلب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 53) {
            status.data.errorCodes[0] = 'لا يمكن إلغاء الطلب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 54) {
            status.data.errorCodes[0] = 'الطلب لم يتم قبوله بعد'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 55) {
            status.data.errorCodes[0] = 'لا يمكن تحديث عنوان التسليم'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 56) {
            status.data.errorCodes[0] = 'كود المرجع مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 57) {
            status.data.errorCodes[0] = 'يجب تعيين السائق أولاً'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 58) {
            status.data.errorCodes[0] = 'رقم الطلب تم إنشاؤه بالفعل اليوم'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 59) {
            status.data.errorCodes[0] = 'رقم الطلب غير صحيح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 60) {
            status.data.errorCodes[0] = 'يتكون رقم الهاتف المحمول من 10 أرقام فقط'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 62) {
            status.data.errorCodes[0] = 'التحقق من صحة مخطط الهوية'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 65) {
            status.data.errorCodes[0] = 'يجب أن يكون تاريخ الميلاد 8 أرقام'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 66) {
            status.data.errorCodes[0] = 'تاريخ الطلب مطلوب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 67) {
            status.data.errorCodes[0] = 'تاريخ القبول خاطئ'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 68) {
            status.data.errorCodes[0] = 'وقت التنفيذ خاطئ'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 69) {
            status.data.errorCodes[0] = 'لا يمكن إنشاء الطلب تجاوز الحدود الزمنية'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 70) {
            status.data.errorCodes[0] = 'لا يمكن تنفيذ الطلب أكثر من مرة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 71) {
            status.data.errorCodes[0] = 'يمكن تنفيذ الأمر المقبول فقط'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 72) {
            status.data.errorCodes[0] = 'السائق المعين يمكن أن يتم فقط للأمر المقبول'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 73) {
            status.data.errorCodes[0] = 'لا يمكن أن يكون وقت التنفيذ قبل تاريخ الطلب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 74) {
            status.data.errorCodes[0] = 'سائق معين بالفعل لهذا الطلب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 75) {
            status.data.errorCodes[0] = 'يجب أن يكون وقت التنفيذ أكبر من وقت التعيين'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 76) {
            status.data.errorCodes[0] = 'السائق معلق فی انتظار موافقة الهیئة'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 77) {
            status.data.errorCodes[0] = 'لا يمكن رفض الطلب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 79) {
            status.data.errorCodes[0] = 'لا يمكن أن يكون وقت تاريخ القبول أقدم من تاريخ الطلب'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 80) {
            status.data.errorCodes[0] = 'انتهاء صلاحية رقم الهوية'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 81) {
            status.data.errorCodes[0] = 'تنسيق تاريخ الميلاد غير صالح'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 82) {
            status.data.errorCodes[0] = 'سائق أقل من 18 عامًا'
            this.massege = status.data.errorCodes[0]
            this.snackbar5 = true
            this.disabled = false
            this.loading = false
          } else if (status.data.errorCodes[0] === 200 || status.data.errorCodes.length === 0) {
            status.data.errorCodes[0] = 'تمت الموافقة عليه من الهيئة'
            this.massege = status.data.errorCodes[0]
            this.snackbar6 = true
            this.disabled = false
            this.loading = false
          }
          this.dialog1 = false
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
