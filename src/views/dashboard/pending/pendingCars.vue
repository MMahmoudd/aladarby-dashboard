<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('pendingCars') }}
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
        :headers="carHeaders"
        :items="cars"
        :items-per-page="20"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50]
        }"
        :options.sync="options"
        :server-items-length="totalCars"
        :page-count="numberOfPages"
        item-key="id"
        @fetchAllItems="fetchAllItems"
      >
        <template v-slot:[`item.id`]="{ item }">
          {{ item.id }}
        </template>
        <template v-slot:[`item.name`]="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:[`item.characters`]="{ item }">
          {{ item.plateCharacters }}
        </template>
        <template v-slot:[`item.number`]="{ item }">
          {{ item.plateNumbers }}
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
                @click="driverInfo(item.driver)"
              >
                <v-icon>
                  mdi-account-details
                </v-icon>
              </v-btn>
            </template>
            {{ $t('driverInfo') }}
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
            {{ $t('reject') }}
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                outlined
                fab
                color="success"
                class="mx-2"
                v-bind="attrs"
                v-on="on"
                @click="confirmActive(item)"
              >
                <v-icon>
                  mdi-check
                </v-icon>
              </v-btn>
            </template>
            {{ $t('active') }}
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
          <p>{{ $t('noData') }}</p>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="1200px"
    >
      <v-card
        v-model="driverInf"
      >
        <base-material-card
          title="Driver Details"
          color="info"
        >
          <v-card-text class="mt-8">
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-center">
                    {{ $t('id') }}
                  </th>
                  <th class="text-center">
                    {{ $t('name') }}
                  </th>
                  <th class="text-center">
                    {{ $t('phone') }}
                  </th>
                  <th class="text-center">
                    {{ $t('lis-image') }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  class="text-center"
                >
                  <td>
                    {{ driverInf.id }}
                  </td>
                  <td>
                    {{ driverName }}
                  </td>
                  <td>{{ driverPhone }}</td>
                  <td>
                    <v-img
                      :height="50"
                      :width="50"
                      :src="driverImage"
                      @click="openImage(item)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              outlined
              @click="close"
            >
              {{ $t('close') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog1"
      max-width="500px"
    >
      <v-card v-model="carData">
        <base-material-card
          v-model="carName"
          title="Confirm Active"
          color="success"
        >
          <v-card-text class="mt-8">
            <p>
              {{ $t('areYOuSureActive') }} {{ carData.name }}{{ $t('?') }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              outlined
              @click="dialog1 = false"
            >
              {{ $t('close') }}
            </v-btn>
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click="approveCar(carData.id)"
            >
              {{ $t('active') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog3"
      max-width="500px"
    >
      <v-card v-model="carData">
        <base-material-card
          v-model="carName"
          color="error"
          title="Confirm Reject"
        >
          <v-card-text class="mt-8">
            <p>
              {{ $t('areYouSureReject') }} {{ carData.name }}{{ $t('?') }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              outlined
              @click="dialog3 = false"
            >
              {{ $t('close') }}
            </v-btn>
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click="rejectCar(carData.id)"
            >
              {{ $t('reject') }}
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
        v-model="driverInf"
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
      v-model="dialog4"
      max-width="500"
    >
      <v-card
        v-model="driverImage"
        class="text-center"
      >
        <v-img :src="driverImage" />
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
      v-if="snackbar1"
      v-model="snackbar1"
      :type="color"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('carIsActivate') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar3"
      v-model="snackbar3"
      :type="color"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('carIsRejected') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar2"
      v-model="snackbar2"
      color="error"
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
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const carsServices = ServiceFactory.get('cars')
  const driversService = ServiceFactory.get('drivers')
  export default {
    data: (vm) => ({
      search: '',
      loader: null,
      loading: false,
      disabled: false,
      dataLoading: false,
      carData: {},
      carName: '',
      driverName: '',
      driverPhone: '',
      driverImage: '',
      driverInf: {},
      page: 0,
      totalCars: 0,
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
      singleSelect: false,
      dialog: false,
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      selected: [],
      color: 'info',
      colors: [
        'success',
      ],
      direction: 'top center',
      snackbar: false,
      snackbar1: false,
      snackbar2: false,
      snackbar3: false,
      driverHeaders: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: vm.$t('name'), value: 'name', sortable: false },
        { text: vm.$t('phone'), value: 'Phone', sortable: false },
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
      ],
      carHeaders: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: vm.$t('name'), value: 'name', sortable: false },
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
        { text: vm.$t('plateNumber'), value: 'number', sortable: false },
        { text: vm.$t('plateCharacters'), value: 'characters', sortable: false },
        { text: vm.$t('driverInfo'), value: 'info', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
      ],
      cars: [],
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
      driverInfo (driver) {
        this.dialog = true
        this.driverInf = driver
        this.driverName = driver.user.userName
        this.driverPhone = driver.user.mobile
        this.driverImage = driver.user.licenseUrl
      },
      openImage (image) {
        this.dialog4 = true
        this.driverImage = image
      },
      confirmActive (car) {
        this.dialog1 = true
        this.carData = car
        this.carName = car.name
      },
      confirmReject (car) {
        this.dialog3 = true
        this.carData = car
        this.carName = car.name
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
          Object.assign(this.cars[this.editedIndex], this.editedItem)
        } else {
          this.cars.push(this.editedItem)
        }
        this.close()
      },
      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const cars = await carsServices.getPendingCars(itemsPerPage, page, pageNumber)
        this.cars = cars.data.data
        this.totalCars = cars.data.total
        this.numberOfPages = cars.data.pageCount
        this.dataLoading = false
      },
      async approveCar (carId) {
        this.disabled = true
        this.loading = true
        this.cars = carId
        const carsUpdatesucess = await carsServices.approveCar(carId)
        if (carsUpdatesucess) {
          this.snackbar1 = true
          this.dialog1 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/pending-cars')
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async rejectCar (carId) {
        this.disabled = true
        this.loading = true
        this.cars = carId
        const carsUpdatesucess = await carsServices.rejectCar(carId)
        if (carsUpdatesucess) {
          this.dialog3 = false
          this.snackbar3 = true
          this.disabled = false
          this.loading = false
          this.$router.go('/pending-cars')
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
        const userId = notification.driver.user.id
        const sendNotifiSucess = await driversService.sendNotifi(userId, notification)
        if (sendNotifiSucess) {
          this.snackbar = true
          this.dialog2 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/pending-cars')
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
