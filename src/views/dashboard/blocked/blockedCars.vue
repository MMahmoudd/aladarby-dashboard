<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('blockedCars') }}
        <v-spacer />
        <!-- <v-text-field
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
          v-model="search.carNumber"
          type="search"
          append-icon="mdi-magnify"
          label="Search By Car Number"
          single-line
          hide-details
          class="mr-2"
          @keyup="fetchAllItems"
        /><v-text-field
          v-model="search.carCharacters"
          type="search"
          append-icon="mdi-magnify"
          label="Search By Car Characters"
          single-line
          hide-details
          class="mr-2"
          @keyup="fetchAllItems"
        /> -->
      </v-card-title>
      <v-data-table
        :loading="dataLoading"
        :headers="headers"
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
                @click="confirmUnBlock(item)"
              >
                <v-icon>
                  mdi-car-key
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('unBlock') }}</span>
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
          color="info"
          title="Driver Details"
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
                      :src="driverInf.licenseUrl"
                      @click="openImage(driverInf.licenseUrl)"
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
      v-model="dialog3"
      max-width="500"
    >
      <v-card
        v-model="carsData"
        class="text-center"
      >
        <base-material-card
          :title="$t('unblockConfirm')"
          color="success"
        >
          <v-card-text class="mt-8">
            {{ $t('areYouSureToUnblock') }} {{ carName }}{{ $t('?') }}
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              class="my-1 mx-1"
              :loading="loading"
              :disabled="disabled"
              @click="unBlockCar(carsData)"
            >
              {{ $t('unBlock') }}
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
        v-model="imageData"
        class="text-center"
      >
        <v-img
          :src="imageData"
          class="cls-img"
        />
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
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const carsServices = ServiceFactory.get('cars')
  const driversService = ServiceFactory.get('drivers')
  export default {
    name: 'Cars',
    data: (vm) => ({
      search: {
        name: '',
        carCharacters: '',
        carNumber: '',
      },
      loader: null,
      loading: false,
      disabled: false,
      dataLoading: false,
      driverInf: {},
      carsData: {},
      carName: '',
      driverName: '',
      driverPhone: '',
      imageData: '',
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
      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: vm.$t('name'), sortable: false, value: 'name' },
        { text: vm.$t('lis-image'), value: 'image', sortable: false },
        { text: vm.$t('driverInfo'), value: 'info', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
        { text: '', value: 'data-table-expand' },
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
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 99000)

        this.loader = null
      },
    },
    methods: {
      driverInfo (driver) {
        this.dialog = true
        console.log(driver)
        this.driverInf = driver
        this.driverName = driver.user.userName
        this.driverPhone = driver.user.mobile
      },
      confirmUnBlock (carData) {
        this.dialog3 = true
        this.carsData = carData
        this.carName = carData.name
      },
      openImage (image) {
        this.dialog4 = true
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
        const cars = await carsServices.getBlockedCars(itemsPerPage, page, pageNumber, this.search)
        this.cars = cars.data.data
        this.totalCars = cars.data.total
        this.numberOfPages = cars.data.pageCount
        this.dataLoading = false
      },
      async unBlockCar (carsData) {
        this.disabled = true
        this.loading = true
        this.carsData = carsData
        const carId = carsData.id
        const carsUpdatesucess = await carsServices.unBlockCar(carId)
        if (carsUpdatesucess) {
          this.snackbar1 = true
          this.dialog3 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/blocked-cars')
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
          this.$router.go('/blocked-cars')
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
.cls-img{
  max-height: 600px !important;
}
</style>
