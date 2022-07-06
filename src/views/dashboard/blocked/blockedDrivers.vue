<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('blockedDrivers') }}
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
        :loading="dataLoading"
        :single-select="singleSelect"
        show-select
        :headers="headers"
        :items="drivers"
        :items-per-page="20"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50]
        }"
        :options.sync="options"
        :server-items-length="total"
        :page-count="numberOfPages"
        item-key="id"
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
        <template v-slot:[`item.image`]="{ item }">
          <v-img
            :height="50"
            :width="50"
            :src="item.licenseUrl"
            @click="openImage(item.licenseUrl)"
          />
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
                @click="unBlockConfirm(item)"
              >
                <v-icon>
                  mdi-account-key
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('unBlock') }}</span>
          </v-tooltip>
        </template>
        <template
          v-slot:no-data
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
            <!-- <template v-slot:item.category="{ item }">
            {{ item.category.name }}
          </template> -->
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
          :title="$t('unblockConfirm')"
          color="success"
        >
          <v-card-text class="mt-8">
            {{ $t('areYouSureToUnblock') }} {{ driverName }}{{ $t('?') }}
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              class="my-1 mx-1"
              :loading="loading"
              :disabled="disabled"
              @click="unBlockDriver(driverData.user.id)"
            >
              {{ $t('unBlock') }}
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
      {{ $t('driverIsUnBlocked') }}
    </base-material-snackbar>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const driversService = ServiceFactory.get('drivers')
  export default {
    name: 'BlockedDrivers',
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
      drivers: [],
      driverData: {},
      driverName: '',
      carData: [],
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
      dialog5: false,
      dialog6: false,
      dialog7: false,
      dialog8: false,
      color: 'info',
      success: 'success',
      error: 'error',
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
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
        { text: vm.$t('carInfo'), value: 'info', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
        { text: '', value: 'data-table-expand' },
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
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
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
      openImage (image) {
        this.dialog3 = true
        this.imageData = image
      },
      getCarData (cars) {
        this.dialog = true
        this.carData = cars
      },
      unBlockConfirm (driver) {
        this.dialog1 = true
        this.driverData = driver
        this.driverName = driver.user.userName
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
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.drivers[this.editedIndex], this.editedItem)
        } else {
          this.drivers.push(this.editedItem)
        }
        this.close()
      },
      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const drivers = await driversService.getAllBlockedDrivers(itemsPerPage, page, pageNumber, this.search)
        this.drivers = drivers.data.data
        this.total = drivers.data.total
        this.numberOfPages = drivers.data.pageCount
        this.dataLoading = false
      },
      async unBlockDriver (driverId) {
        this.disabled = true
        this.loading = true
        this.drivers = driverId
        const unBlockSucess = await driversService.unBlockDriver(driverId)
        if (unBlockSucess) {
          this.snackbar3 = true
          this.disabled = false
          this.loading = false
          this.$router.go('/BlockedDrivers')
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
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async sendSMS (driverData) {
        this.disabled = true
        this.loading = true
        console.log(driverData)
        console.log('driverId', this.driverData.user.id)
        const sendSMS = await driversService.sendSMS(
          this.driverData.user.id,
          this.SMS,
        )
        console.log(sendSMS)
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
    },
  }
</script>
<style lang="scss">

.v-card .v-card--material__heading{
  top: 0px !important;
}
.cls-img{
  max-height: 600px !important;
}
</style>
