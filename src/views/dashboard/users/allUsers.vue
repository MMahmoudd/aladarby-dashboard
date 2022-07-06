
<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('allClint') }}
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
        :items="users"
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
          {{ item.user.userName }}
        </template>
        <template v-slot:[`item.phone`]="{ item }">
          {{ item.user.mobile }}
        </template>
        <template v-slot:[`item.image`]="{ item }">
          <div v-if="item.avatar">
            <v-img
              :height="50"
              :width="50"
              :src="item.avatar"
              @click="openImage(item.avatar)"
            />
          </div>
          <div v-else>
            No Image Available
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
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
                @click="blockConfirm(item)"
              >
                <v-icon>
                  mdi-account-lock
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('block') }}</span>
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
                @click="openSendNotifi(item)"
              >
                <v-icon>
                  mdi-email-send
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('notify') }}</span>
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
      v-model="dialog"
      max-width="500"
    >
      <v-card
        v-if="userData"
        class="text-center"
      >
        <base-material-card
          :title="$t('confirmBlock')"
          color="error"
        >
          <v-card-text class="mt-8">
            {{ $t('confirmBlock') }} {{ userName }} {{ $t('?') }}
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click="blockUser(userData.user.id)"
            >
              {{ $t('block') }}
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="dialog = false"
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
    <base-material-snackbar
      v-if="snackbar"
      v-model="snackbar"
      :type="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ $t('clintIsBlocked') }}
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
      {{ $t('massegeSentSuccss') }}
    </base-material-snackbar>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const usersService = ServiceFactory.get('users')
  const driversService = ServiceFactory.get('drivers')
  export default {
    name: 'Users',
    data: (vm) => ({
      search: {
        name: '',
        mobile: '',
      },
      selectedUser: {},
      dataLoading: false,
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
      imageData: '',
      userData: {},
      userName: '',
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog5: false,
      dialog6: false,
      dialog7: false,
      success: 'success',
      error: 'error',
      direction: 'top center',
      snackbar: false,
      snackbar2: false,
      snackbar3: false,
      vertical: true,

      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: vm.$t('name'), sortable: false, value: 'name' },
        { text: vm.$t('phone'), value: 'phone', sortable: false },
        { text: vm.$t('image'), value: 'image', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
      ],
      users: [],
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
      openSendNotifi (user) {
        this.dialog2 = true
        this.notification = user
      },
      blockConfirm (user) {
        this.dialog = true
        this.userData = user
        this.userName = user.user.userName
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const users = await usersService.getAllUsers(itemsPerPage, page, pageNumber, this.search)
        this.users = users.data.data
        this.total = users.data.total
        this.numberOfPages = users.data.pageCount
        this.dataLoading = false
      },
      async blockUser (userId) {
        this.disabled = true
        this.loading = true
        this.drivers = userId
        const blockSucess = await usersService.blockUser(userId)
        if (blockSucess) {
          this.dialog = false
          this.snackbar = true
          this.disabled = false
          this.loading = false
          this.$router.go('/allUser')
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
        const sendNotifiSucess = await usersService.sendNotifi(userId, notification)
        if (sendNotifiSucess) {
          this.snackbar3 = true
          this.dialog2 = false
          this.disabled = false
          this.loading = false
          this.notification.title = ''
          this.notification.body = ''
        } else {
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
          this.snackbar3 = true
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
          this.snackbar3 = true
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
        const sendSMS = await driversService.sendSMS(
          this.driverData.user.id,
          this.SMS,
        )
        console.log(sendSMS)
        if (sendSMS) {
          this.snackbar3 = true
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
