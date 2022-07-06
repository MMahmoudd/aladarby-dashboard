<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('transfers') }}
        <v-spacer />
        <!-- <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('search')"
          single-line
          hide-details
        /> -->
      </v-card-title>
      <v-data-table
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
        <template v-slot:[`item.id`]="{ item }">
          {{ item.id }}
        </template>
        <template v-slot:[`item.driverName`]="{ item }">
          {{ item.account.user.userName }}
        </template>
        <template v-slot:[`item.phoneNumber`]="{ item }">
          {{ item.account.user.mobile }}
        </template>
        <template v-slot:[`item.BankName`]="{ item }">
          {{ item.details.bankName }}
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ item.transactionDescription }}
        </template>
        <template v-slot:[`item.date`]="{ item }">
          {{ item.transactionDate }}
        </template>
        <template v-slot:[`item.transactionRef`]="{ item }">
          {{ item.details.transactionRef }}
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
                @click="unconfirmTrans(item)"
              >
                <v-icon>
                  mdi-cash-remove
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('notTransferred') }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                fab
                outlined
                class="mx-2"
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click="confirmTrans(item)"
              >
                <v-icon>
                  mdi-cash-check
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('confirmTransfers') }}</span>
          </v-tooltip>
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
      v-model="dialog1"
      max-width="500"
    >
      <v-card
        class="text-center"
      >
        <base-material-card
          :title="$t('confirmTransfers')"
          color="success"
        >
          <v-card-text class="mt-8">
            <p>{{ $t('areYouSure') }} {{ transactionData.account.userName }} {{ $t('sentTheAmountsDue') }}</p>
            <v-text-field
              v-model="transactionData.transactionDescription"
              disabled
              type="text"
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
              @click="confirmTransfers(transactionData)"
            >
              {{ $t('confirm') }}
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
      v-model="dialog3"
      max-width="500"
    >
      <v-card
        class="text-center"
      >
        <base-material-card
          :title="$t('unconfirmTransfers')"
          color="error"
        >
          <v-card-text class="mt-8">
            <p>{{ $t('areYouSure') }} {{ transactionData.account.userName }} {{ $t('notSentAmountsDue') }}</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              class="my-1 mx-1"
              :loading="loading"
              :disabled="disabled"
              @click="unConfirmTransfers(transactionData)"
            >
              {{ $t('notTransferred') }}
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="dialog3 = false"
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
      v-if="snackbar2"
      v-model="snackbar2"
      :type="color"
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
      color="green"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('transferHasBeConfirmedSuccessfully') }}
    </base-material-snackbar>
    <base-material-snackbar
      v-if="snackbar4"
      v-model="snackbar4"
      color="green"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('transferHasBeUnConfirmedSuccessfly') }}
    </base-material-snackbar>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const paymentServices = ServiceFactory.get('payment')
  const driversService = ServiceFactory.get('drivers')
  export default {
    name: 'Drivers',
    data: (vm) => ({
      search: '',
      loader: null,
      loading: false,
      disabled: false,
      dataLoading: false,
      drivers: [],
      driverData: {},
      carData: [],
      driverId: '',
      driverName: '',
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      SMS: '',
      transactionData: {
        account: {
          userName: '',
        },
        transaction: 0,
        bankName: '',
        amount: '',
      },
      rules1: [
        value => !!value || 'Required.',
        value => {
          const pattern = /^[0-9]*$/
          return pattern.test(value) || 'Invalid Number.'
        },
      ],
      notification: {
        title: '',
        body: '',
        payload: {
          driverId: '',
          clientId: '',
        },
      },
      rules: [v => v.length <= 25 || 'Max 25 characters'],
      singleSelect: false,
      dialog: false,
      dialog1: false,
      dialog2: false,
      dialog6: false,
      dialog3: false,
      selected: [],
      color: 'info',
      colors: [
        'success',
      ],
      direction: 'top center',
      snackbar: false,
      snackbar2: false,
      snackbar3: false,
      snackbar4: false,
      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: vm.$t('driverName'), sortable: false, value: 'driverName' },
        { text: vm.$t('phone'), sortable: false, value: 'phoneNumber' },
        { text: vm.$t('bankName'), sortable: false, value: 'BankName' },
        { text: vm.$t('deserveAmount'), value: 'amount', sortable: false },
        { text: vm.$t('transactionRef'), value: 'transactionRef', sortable: false },
        { text: vm.$t('date'), value: 'date', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
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
      confirmSMS (item) {
        this.dialog6 = true
        this.driverData = item
        console.log(item)
      },
      sendNotification (driver) {
        this.dialog2 = true
        this.notification = driver
      },
      confirmTrans (transaction) {
        this.dialog1 = true
        this.transactionData = transaction
        this.transactionData.account.userName = transaction.account.userName
        this.transactionData.id = transaction.id
      },
      unconfirmTrans (transaction) {
        this.dialog3 = true
        this.transactionData = transaction
        this.transactionData.account.userName = transaction.account.userName
        this.transactionData.id = transaction.id
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
        const drivers = await paymentServices.getUnConfirmedTransfers(itemsPerPage, page, pageNumber)
        this.drivers = drivers.data.data
        this.total = drivers.data.total
        this.numberOfPages = drivers.data.pageCount
        this.dataLoading = false
      },
      async confirmTransfers (transactionData) {
        this.disabled = true
        this.loading = true
        const transactionId = transactionData.id
        const sendSucess = await paymentServices.confirmTransfers(transactionId)
        if (sendSucess) {
          this.dialog1 = false
          this.snackbar3 = true
          this.disabled = false
          this.loading = false
          this.$router.go('/transfers')
        } else {
          this.snackbar2 = true
          this.disabled = false
          this.loading = false
        }
      },
      async unConfirmTransfers (transactionData) {
        this.disabled = true
        this.loading = true
        const transactionId = transactionData.id
        const sendSucess = await paymentServices.unConfirmTransfers(transactionId)
        if (sendSucess) {
          this.dialog3 = false
          this.snackbar4 = true
          this.disabled = false
          this.loading = false
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
        const userId = notification.account.user.id
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
      async sendSMS (driverData) {
        this.disabled = true
        this.loading = true
        const sendSMS = await driversService.sendSMS(
          this.driverData.account.user.id,
          this.SMS,
        )
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
</style>
