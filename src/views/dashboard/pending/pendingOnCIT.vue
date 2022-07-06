<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t("pendingDriverOnCIT") }}
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
        <template
          v-slot:[`item.name`]="{ item }"
        >
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
                outlined
                fab
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
                fab
                outlined
                class="mx-2"
                color="success"
                v-bind="attrs"
                v-on="on"
                @click="confirmActive(item)"
              >
                <v-icon>
                  mdi-check-network
                </v-icon>
              </v-btn>
            </template>
            <span><span>{{ $t("sendToCIT") }}</span></span>
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
        title="Cars Data"
        :type="info"
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
          :type="success"
          title="Confirm Send To CIT"
        >
          <v-card-text class="mt-8">
            <p>{{ $t("areYOuSureSend") }} {{ driverName }}{{ $t("toCIT?") }}</p>
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
              {{ $t("send") }}
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
          :type="orange"
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
      v-model="dialog7"
      max-width="500"
    >
      <v-card
        class="text-center"
      >
        <base-material-card
          title="Notification Details"
          :type="orange"
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
              :disabled="disabled"
              :loading="loading"
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
      v-model="dialog3"
      max-width="500px"
    >
      <v-card v-model="driverData">
        <base-material-card
          v-model="driverName"
          :type="error"
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
          :type="teal"
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
              :disabled="disabled"
              :loading="loading"
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
          :type="teal"
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
              :disabled="disabled"
              :loading="loading"
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
      v-if="snackbar1"
      v-model="snackbar1"
      :type="primary"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ massege }}
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
      {{ massege }}
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
      Notification Sent Successuffly
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar4"
      v-model="snackbar4"
      :type="error"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t("somethingError") }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar5"
      v-model="snackbar5"
      :type="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      THis Driver Rejected Successuffly
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
      SMS Sent Successuffly
    </base-material-snackbar>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const driversService = ServiceFactory.get('drivers')
  const carsServices = ServiceFactory.get('cars')
  export default {
    data: (vm) => ({
      search: {
        name: '',
        mobile: '',
      },
      dataLoading: false,
      driverData: {},
      driverName: '',
      carData: {},
      imageData: '',
      singleSelect: false,
      loader: null,
      loading: false,
      disabled: false,
      selected: [],
      ids: [],
      SMS: '',
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
      teal: 'teal',
      orange: 'orange',
      info: 'info',
      success: 'success',
      primary: 'primary',
      error: 'error',
      dialog: false,
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      dialog6: false,
      dialog7: false,
      dialog8: false,
      massege: '',
      color: 'info',
      colors: ['success'],
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
        // { text: vm.$t('status'), value: 'status', sortable: false },
        { text: vm.$t('carInfo'), value: 'info', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
      ],
      carHeaders: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: vm.$t('name'), value: 'name', sortable: false },
        { text: vm.$t('plateNumber'), value: 'number', sortable: false },
        { text: vm.$t('plateCharacters'), value: 'characters', sortable: false },
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
      ],
      driverHeader: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: vm.$t('name'), value: 'name', sortable: false },
        { text: vm.$t('plateNumber'), value: 'number', sortable: false },
        { text: vm.$t('plateCharacters'), value: 'characters', sortable: false },
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
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
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },

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
      userStatus () {
        if (this.userStatus === 'Active') {
          this.status = 1
        } else {
          this.status = 0
        }
      },
      status () {
        if (this.status === 1) {
          this.userStatus = 'Active'
        } else {
          this.userStatus = 'Not Active'
        }
      },
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
      sendNotification (driver) {
        this.dialog2 = true
        this.notification = driver
        console.log(this.notification)
      },
      sendMultiNotification (item) {
        console.log(this.selected)
        this.dialog7 = true
        this.selected.map(item => {
          this.ids.push(item.user.id)
        })
      },
      confirmReject (driver) {
        this.dialog3 = true
        this.driverData = driver
        this.driverName = driver.user.userName
      },
      confirmActive (driver) {
        this.dialog1 = true
        this.driverData = driver
        this.driverName = driver.user.userName
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
        const drivers = await driversService.getPendingSentDriversOnCIT(itemsPerPage, page, pageNumber, this.search)
        this.drivers = drivers.data.data
        this.total = drivers.data.total
        this.numberOfPages = drivers.data.pageCount
        this.dataLoading = false
      },
      async rejectDriver (driverId) {
        this.disabled = true
        this.loading = true
        this.carId = driverId.cars[0].id
        const driverUpdatesucess = await driversService.rejectDriver(driverId.id)
        carsServices.rejectCar(this.carId)

        if (driverUpdatesucess) {
          this.dialog3 = false
          this.snackbar5 = true
          this.disabled = false
          this.loading = false
          this.$router.go('/rejected-on-CIT')
        } else {
          this.snackbar4 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendNotifi (notification) {
        this.disabled = true
        this.loading = true
        this.notification = notification
        console.log('notification', notification)
        const userId = notification.user.id
        const sendNotifiSucess = await driversService.sendNotifi(
          userId,
          notification,
        )
        if (sendNotifiSucess) {
          this.snackbar3 = true
          this.dialog2 = false
          this.disabled = false
          this.loading = false
          this.notification.title = ''
          this.notification.body = ''
        } else {
          this.snackbar4 = true
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
          this.snackbar6 = true
          this.dialog5 = false
          this.disabled = false
          this.loading = false
          this.SMS = ''
          this.ids = []
        } else {
          this.snackbar4 = true
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
          this.snackbar3 = true
          this.dialog7 = false
          this.disabled = false
          this.loading = false
          this.notification.title = ''
          this.notification.body = ''
          this.ids = []
        } else {
          this.snackbar4 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendSMS (driverData) {
        this.disabled = true
        this.loading = true
        const sendSMS = await driversService.sendSMS(
          this.driverData.user.id,
          this.SMS,
        )
        console.log(sendSMS)
        if (sendSMS) {
          this.snackbar6 = true
          this.dialog6 = false
          this.disabled = false
          this.loading = false
          this.SMS = ''
        } else {
          this.snackbar4 = true
          this.disabled = false
          this.loading = false
        }
      },
      async approveDriver (driver) {
        this.disabled = true
        this.loading = true
        const driverId = driver.id
        const integretion = await driversService.integration(driverId)
        if (integretion.done === true) {
          if (integretion.data.errorCodes[0] === 61) {
            integretion.data.errorCodes[0] = 'تاريخ الميلاد لا يطابق سجلات NIC'
          } else if (integretion.data.errorCodes[0] === 2) {
            integretion.data.errorCodes[0] = 'لم يتم العثور على هذا السائق'
          } else if (integretion.data.errorCodes[0] === 3) {
            integretion.data.errorCodes[0] = 'غير مصرح'
          } else if (integretion.data.errorCodes[0] === 5) {
            integretion.data.errorCodes[0] = 'شهادة اعتماد غير صالحة'
          } else if (integretion.data.errorCodes[0] === 7) {
            integretion.data.errorCodes[0] = 'نوع الهوية مطلوب'
          } else if (integretion.data.errorCodes[0] === 8) {
            integretion.data.errorCodes[0] = 'رقم الهوية مطلوب'
          } else if (integretion.data.errorCodes[0] === 9) {
            integretion.data.errorCodes[0] = 'تاريخ الميلاد مطلوب'
          } else if (integretion.data.errorCodes[0] === 10) {
            integretion.data.errorCodes[0] = 'تاريخ التسجيل مطلوب'
          } else if (integretion.data.errorCodes[0] === 11) {
            integretion.data.errorCodes[0] = 'رقم الموبايل مطلوب'
          } else if (integretion.data.errorCodes[0] === 12) {
            integretion.data.errorCodes[0] = 'المنطقة مطلوبة'
          } else if (integretion.data.errorCodes[0] === 13) {
            integretion.data.errorCodes[0] = 'المدينة مطلوبة'
          } else if (integretion.data.errorCodes[0] === 14) {
            integretion.data.errorCodes[0] = 'نوع السيارة مطلوب'
          } else if (integretion.data.errorCodes[0] === 15) {
            integretion.data.errorCodes[0] = 'رقم السيارة مطلوب'
          } else if (integretion.data.errorCodes[0] === 17) {
            integretion.data.errorCodes[0] = 'نوع الهوية غير صالح'
          } else if (integretion.data.errorCodes[0] === 18) {
            integretion.data.errorCodes[0] = 'يوجدد خطأ في المنطقة'
          } else if (integretion.data.errorCodes[0] === 19) {
            integretion.data.errorCodes[0] = 'يوجد خطأ في المدينة'
          } else if (integretion.data.errorCodes[0] === 20) {
            integretion.data.errorCodes[0] = 'رقم الهوية غير صحيح'
          } else if (integretion.data.errorCodes[0] === 21) {
            integretion.data.errorCodes[0] = 'رقم السائق غير صالح'
          } else if (integretion.data.errorCodes[0] === 22) {
            integretion.data.errorCodes[0] = 'المدينة لا تنتمي إلى المنطقة'
          } else if (integretion.data.errorCodes[0] === 23) {
            integretion.data.errorCodes[0] = 'الرقم المطلوب'
          } else if (integretion.data.errorCodes[0] === 24) {
            integretion.data.errorCodes[0] = 'السلطة مطلوبة'
          } else if (integretion.data.errorCodes[0] === 25) {
            integretion.data.errorCodes[0] = 'رقم الفئة مطلوب'
          } else if (integretion.data.errorCodes[0] === 26) {
            integretion.data.errorCodes[0] = 'وقت التسليم مطلوب'
          } else if (integretion.data.errorCodes[0] === 27) {
            integretion.data.errorCodes[0] = 'رقم السلطة غير صالح'
          } else if (integretion.data.errorCodes[0] === 28) {
            integretion.data.errorCodes[0] = 'رقم الفئة غير صالح'
          } else if (integretion.data.errorCodes[0] === 29) {
            integretion.data.errorCodes[0] = 'رقم الطلب غير صالح'
          } else if (integretion.data.errorCodes[0] === 36) {
            integretion.data.errorCodes[0] = 'إدخالات فارغة'
          } else if (integretion.data.errorCodes[0] === 37) {
            integretion.data.errorCodes[0] = 'رقم سبب الإلغاء غير صالح'
          } else if (integretion.data.errorCodes[0] === 38) {
            integretion.data.errorCodes[0] = 'الإحداثيات مطلوبة'
          } else if (integretion.data.errorCodes[0] === 39) {
            integretion.data.errorCodes[0] = 'رقم طریقة الدفع مطلوب'
          } else if (integretion.data.errorCodes[0] === 40) {
            integretion.data.errorCodes[0] = 'السعر مطلوب'
          } else if (integretion.data.errorCodes[0] === 42) {
            integretion.data.errorCodes[0] = 'رقم طريقة الدفع غير صالح'
          } else if (integretion.data.errorCodes[0] === 44) {
            integretion.data.errorCodes[0] = 'هوية غير صالحة'
          } else if (integretion.data.errorCodes[0] === 45) {
            integretion.data.errorCodes[0] = 'نوع السيارة غير صالح'
          } else if (integretion.data.errorCodes[0] === 47) {
            integretion.data.errorCodes[0] = 'سائق موجود بالفعل'
          } else if (integretion.data.errorCodes[0] === 48) {
            integretion.data.errorCodes[0] = 'تحقق من خطأ مكرر'
          } else if (integretion.data.errorCodes[0] === 49) {
            integretion.data.errorCodes[0] = 'الجنسية ورقم التعريف ورقم الهوية ونوعها لا يمكن تغييرها'
          } else if (integretion.data.errorCodes[0] === 50) {
            integretion.data.errorCodes[0] = 'الاسم مطلوب'
          } else if (integretion.data.errorCodes[0] === 51) {
            integretion.data.errorCodes[0] = 'الموقع مطلوب'
          } else if (integretion.data.errorCodes[0] === 52) {
            integretion.data.errorCodes[0] = 'لا يمكن قبول الطلب'
          } else if (integretion.data.errorCodes[0] === 53) {
            integretion.data.errorCodes[0] = 'لا يمكن إلغاء الطلب'
          } else if (integretion.data.errorCodes[0] === 54) {
            integretion.data.errorCodes[0] = 'الطلب لم يتم قبوله بعد'
          } else if (integretion.data.errorCodes[0] === 55) {
            integretion.data.errorCodes[0] = 'لا يمكن تحديث عنوان التسليم'
          } else if (integretion.data.errorCodes[0] === 56) {
            integretion.data.errorCodes[0] = 'كود المرجع مطلوب'
          } else if (integretion.data.errorCodes[0] === 57) {
            integretion.data.errorCodes[0] = 'يجب تعيين السائق أولاً'
          } else if (integretion.data.errorCodes[0] === 58) {
            integretion.data.errorCodes[0] = 'رقم الطلب تم إنشاؤه بالفعل اليوم'
          } else if (integretion.data.errorCodes[0] === 59) {
            integretion.data.errorCodes[0] = 'رقم الطلب غير صحيح'
          } else if (integretion.data.errorCodes[0] === 60) {
            integretion.data.errorCodes[0] = 'يتكون رقم الهاتف المحمول من 10 أرقام فقط'
          } else if (integretion.data.errorCodes[0] === 62) {
            integretion.data.errorCodes[0] = 'التحقق من صحة مخطط الهوية'
          } else if (integretion.data.errorCodes[0] === 65) {
            integretion.data.errorCodes[0] = 'يجب أن يكون تاريخ الميلاد 8 أرقام'
          } else if (integretion.data.errorCodes[0] === 66) {
            integretion.data.errorCodes[0] = 'تاريخ الطلب مطلوب'
          } else if (integretion.data.errorCodes[0] === 67) {
            integretion.data.errorCodes[0] = 'تاريخ القبول خاطئ'
          } else if (integretion.data.errorCodes[0] === 68) {
            integretion.data.errorCodes[0] = 'وقت التنفيذ خاطئ'
          } else if (integretion.data.errorCodes[0] === 69) {
            integretion.data.errorCodes[0] = 'لا يمكن إنشاء الطلب تجاوز الحدود الزمنية'
          } else if (integretion.data.errorCodes[0] === 70) {
            integretion.data.errorCodes[0] = 'لا يمكن تنفيذ الطلب أكثر من مرة'
          } else if (integretion.data.errorCodes[0] === 71) {
            integretion.data.errorCodes[0] = 'يمكن تنفيذ الأمر المقبول فقط'
          } else if (integretion.data.errorCodes[0] === 72) {
            integretion.data.errorCodes[0] = 'السائق المعين يمكن أن يتم فقط للأمر المقبول'
          } else if (integretion.data.errorCodes[0] === 73) {
            integretion.data.errorCodes[0] = 'لا يمكن أن يكون وقت التنفيذ قبل تاريخ الطلب'
          } else if (integretion.data.errorCodes[0] === 74) {
            integretion.data.errorCodes[0] = 'سائق معين بالفعل لهذا الطلب'
          } else if (integretion.data.errorCodes[0] === 75) {
            integretion.data.errorCodes[0] = 'يجب أن يكون وقت التنفيذ أكبر من وقت التعيين'
          } else if (integretion.data.errorCodes[0] === 76) {
            integretion.data.errorCodes[0] = 'السائق معلق فی انتظار موافقة الهیئة'
          } else if (integretion.data.errorCodes[0] === 77) {
            integretion.data.errorCodes[0] = 'لا يمكن رفض الطلب'
          } else if (integretion.data.errorCodes[0] === 79) {
            integretion.data.errorCodes[0] = 'لا يمكن أن يكون وقت تاريخ القبول أقدم من تاريخ الطلب'
          } else if (integretion.data.errorCodes[0] === 80) {
            integretion.data.errorCodes[0] = 'انتهاء صلاحية رقم الهوية'
          } else if (integretion.data.errorCodes[0] === 81) {
            integretion.data.errorCodes[0] = 'تنسيق تاريخ الميلاد غير صالح'
          } else if (integretion.data.errorCodes[0] === 82) {
            integretion.data.errorCodes[0] = 'سائق أقل من 18 عامًا'
          } else if (integretion.data.errorCodes[0] === 200) {
            integretion.data.errorCodes[0] = 'صفقة ناجحة'
            this.$router.go('/rejected-on-CIT')
            this.snackbar2 = false
            this.snackbar1 = true
            this.disabled = false
            this.loading = false
          }
          this.massege = integretion.data.errorCodes[0]
          this.dialog1 = false
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
          if (integretion.data.status === true) {
            this.$router.go('/rejected-on-CIT')
            this.disabled = false
            this.loading = false
          }
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
