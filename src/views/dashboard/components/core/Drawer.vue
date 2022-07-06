<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom`"
        v-bind="props"
      />
    </template>

    <v-divider class="mb-1" />

    <v-list
      dense
      nav
    >
      <v-list-item>
        <v-list-item-avatar
          class="align-self-center"
          color="white"
          size="60"
        >
          <v-avatar
            size="50px"
            tile
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="181.32"
              height="118.05"
              viewBox="0 0 181.32 118.05"
            >
              <g
                id="Layer_1"
                data-name="Layer 1"
                transform="translate(-7.264 0.045)"
              ><path
                id="Path_1"
                data-name="Path 1"
                d="M273.722,55.775V93.112a1.285,1.285,0,0,1-1.285,1.285H252.161a13.011,13.011,0,0,1-9.116-4.222,13.363,13.363,0,0,1-3.93-9.852,13.782,13.782,0,0,1,4.11-10.266,13.159,13.159,0,0,1,19.08.112,13.559,13.559,0,0,1,3.962,9.225,1.285,1.285,0,0,0,1.285,1.221h3.277a1.285,1.285,0,0,0,1.285-1.231,20.868,20.868,0,0,0-4.6-14.781q-5.334-6.426-14.748-6.449A21.917,21.917,0,0,0,230.6,79.877a20.218,20.218,0,0,0,3.878,12.49,1.285,1.285,0,0,1-1.038,2.037h-2.6a1.285,1.285,0,0,1-1.285-1.285V55.775a1.285,1.285,0,0,1,1.285-1.285h41.591A1.285,1.285,0,0,1,273.722,55.775Z"
                transform="translate(-155.799 -37.012)"
                fill="#f26522"
              /> <path
                id="Path_3"
                data-name="Path 3"
                d="M135.966,286.055a7.831,7.831,0,0,0,1.7-.151,1.889,1.889,0,0,0,1.025-.575,2.249,2.249,0,0,0,.5-1.128,10.282,10.282,0,0,0,.125-1.751V270.783a.871.871,0,0,1,.964-1h1.9a.886.886,0,0,1,1,1v13.569a5.566,5.566,0,0,1-1.578,4.306q-1.578,1.452-5.032,1.452h-4.02a1.7,1.7,0,0,1-1.025-.35q-.476-.35-.476-1.652,0-1.353.476-1.7a1.7,1.7,0,0,1,1.025-.35Zm-.251,14.671a2.57,2.57,0,0,1-1.729-.627,2.272,2.272,0,0,1,0-3.329,2.619,2.619,0,0,1,3.454,0,2.272,2.272,0,0,1,0,3.329A2.57,2.57,0,0,1,135.716,300.726Z"
                transform="translate(-88.948 -183.126)"
                fill="#f26522"
              /> <path
                id="Path_4"
                data-name="Path 4"
                d="M184.766,270.783a.871.871,0,0,1,.964-1h1.9a.886.886,0,0,1,1,1v13.971a29.5,29.5,0,0,1-.488,5.662,13.727,13.727,0,0,1-1.562,4.251,12.134,12.134,0,0,1-2.892,3.329,31.947,31.947,0,0,1-4.531,2.979.76.76,0,0,1-1.2-.4l-.9-1.7a.569.569,0,0,1-.051-.675,1.972,1.972,0,0,1,.643-.527,26.768,26.768,0,0,0,3.329-2.278,8.846,8.846,0,0,0,2.2-2.654,12.053,12.053,0,0,0,1.208-3.605,29.164,29.164,0,0,0,.376-5.083Z"
                transform="translate(-120.072 -183.126)"
                fill="#f26522"
              /> <path
                id="Path_5"
                data-name="Path 5"
                d="M255.655,239.924q0,.643-.7.7l-8.814,1.051a.7.7,0,0,1-.5-.074c-.132-.084-.2-.292-.2-.627v-.8q0-.643.7-.7l8.8-1.051a.707.707,0,0,1,.5.074c.132.084.2.292.2.627Z"
                transform="translate(-166.576 -161.834)"
                fill="#fba919"
              /> <path
                id="Path_6"
                data-name="Path 6"
                d="M232.1,288.227a.886.886,0,0,1-1-1v-2.1q0-.964,1-.964h13.174a8.876,8.876,0,0,0,1.8-.151,1.928,1.928,0,0,0,1.076-.575,2.432,2.432,0,0,0,.527-1.128,8.532,8.532,0,0,0,.151-1.751v-2.3a12.059,12.059,0,0,0-.415-3.316,4.82,4.82,0,0,0-1.353-2.249,5.546,5.546,0,0,0-2.5-1.253,16.455,16.455,0,0,0-3.8-.376,43.317,43.317,0,0,0-4.707.3,2.975,2.975,0,0,1-.45.051h-.251q-1,0-1-.851V268.7a.964.964,0,0,1,.177-.643,1.109,1.109,0,0,1,.575-.3,15.792,15.792,0,0,1,2.805-.575,26.345,26.345,0,0,1,3.056-.177,21.088,21.088,0,0,1,4.932.527,8.926,8.926,0,0,1,3.679,1.777,7.965,7.965,0,0,1,2.3,3.329,14.535,14.535,0,0,1,.8,5.183v4.656a5.566,5.566,0,0,1-1.578,4.306q-1.578,1.452-5.032,1.452Z"
                transform="translate(-156.844 -181.243)"
                fill="#f26522"
              /> <path
                id="Path_7"
                data-name="Path 7"
                d="M372.627,305.41a.8.8,0,0,1-.5-1.15l.6-1.854a.887.887,0,0,1,1.3-.6l3.657,1.34q1.851.7,3.213,1.1t2.4.6q1.051.2,1.828.276t1.478.074h1.3v4.055h-1.96a3.856,3.856,0,0,1,.964,2.5,5.054,5.054,0,0,1-1.517,3.6,12.452,12.452,0,0,1-3.93,2.68,23.963,23.963,0,0,1-5.559,1.677,35.245,35.245,0,0,1-6.385.575,33.26,33.26,0,0,1-6.385-.6,15.815,15.815,0,0,1-5.43-2.082,11.294,11.294,0,0,1-3.782-3.907,11.747,11.747,0,0,1-1.427-6.034,18.422,18.422,0,0,1,.549-4.331,20.564,20.564,0,0,1,1.7-4.531,1.558,1.558,0,0,1,.549-.726.938.938,0,0,1,.852.074l1.607.752a1.359,1.359,0,0,1,.575.5,1.012,1.012,0,0,1-.125.8,17.763,17.763,0,0,0-1.3,3.631,14.974,14.974,0,0,0-.45,3.48,8.473,8.473,0,0,0,.925,4.106,7.551,7.551,0,0,0,2.6,2.779,11.711,11.711,0,0,0,4.081,1.552,28.024,28.024,0,0,0,5.408.476,30.525,30.525,0,0,0,5.658-.476,21.379,21.379,0,0,0,4.232-1.2,8.541,8.541,0,0,0,2.654-1.629,2.54,2.54,0,0,0,.925-1.751q0-1.353-1.777-2.3a36.726,36.726,0,0,0-4.482-1.954Z"
                transform="translate(-239.236 -202.282)"
                fill="#f26522"
              /> <path
                id="Path_8"
                data-name="Path 8"
                d="M461.868,253.755a7.831,7.831,0,0,0,1.7-.151,1.892,1.892,0,0,0,1.025-.575,2.265,2.265,0,0,0,.5-1.128,10.282,10.282,0,0,0,.125-1.751V223.609q0-.9.7-1.051l2.2-.35q.964-.151.964.851V251.8a5.6,5.6,0,0,0,2.053,1.452,7.541,7.541,0,0,0,2.892.5h.5v4.055h-.5a7.14,7.14,0,0,1-3.281-.7,6.506,6.506,0,0,1-2.33-2,4.473,4.473,0,0,1-2.153,2.027,9.1,9.1,0,0,1-3.8.675h-4.5a1.7,1.7,0,0,1-1.025-.35q-.476-.35-.476-1.652,0-1.353.476-1.7a1.7,1.7,0,0,1,1.025-.35Z"
                transform="translate(-309.799 -150.827)"
                fill="#f26522"
              /> <path
                id="Path_9"
                data-name="Path 9"
                d="M515.881,284.167a13.527,13.527,0,0,1-2.555-4.132,11.443,11.443,0,0,1-.8-4.039,9.4,9.4,0,0,1,.778-3.981,8.2,8.2,0,0,1,2.079-2.805,8.57,8.57,0,0,1,3-1.677,11.477,11.477,0,0,1,3.554-.533,14.013,14.013,0,0,1,3.631.476,11.712,11.712,0,0,1,3.329,1.478q.643.45.4,1l-.9,1.954q-.2.45-.45.527a.964.964,0,0,1-.7-.177,15.706,15.706,0,0,0-2.555-.9,10.282,10.282,0,0,0-2.5-.3,7.22,7.22,0,0,0-2.6.427,4.7,4.7,0,0,0-1.777,1.15,4.633,4.633,0,0,0-1,1.677,6.283,6.283,0,0,0-.321,2.053,9.384,9.384,0,0,0,.877,3.679,13.669,13.669,0,0,0,2.979,4.132h10.967q1,0,1,.964v2.1a.886.886,0,0,1-1,1H507.971a1.7,1.7,0,0,1-1.025-.35q-.476-.35-.476-1.652,0-1.353.476-1.7a1.7,1.7,0,0,1,1.025-.35Z"
                transform="translate(-343.733 -181.239)"
                fill="#f26522"
              /> <path
                id="Path_10"
                data-name="Path 10"
                d="M273.323,6.636q0,2.863-3.081,3.081l-38.751,4.624a3.072,3.072,0,0,1-2.2-.321c-.585-.363-.88-1.285-.88-2.75V7.735q0-2.856,3.081-3.081L270.242.03a3.107,3.107,0,0,1,2.2.321c.585.366.88,1.285.88,2.75Z"
                transform="translate(-155.018 0)"
                fill="#fba919"
              /> <path
                id="Path_13"
                data-name="Path 13"
                d="M372.627,305.41a.8.8,0,0,1-.5-1.15l.6-1.854a.887.887,0,0,1,1.3-.6l3.657,1.34q1.851.7,3.213,1.1t2.4.6q1.051.2,1.828.276t1.478.074h1.3v4.055h-1.96a3.856,3.856,0,0,1,.964,2.5,5.054,5.054,0,0,1-1.517,3.6,12.452,12.452,0,0,1-3.93,2.68,23.963,23.963,0,0,1-5.559,1.677,35.245,35.245,0,0,1-6.385.575,33.26,33.26,0,0,1-6.385-.6,15.815,15.815,0,0,1-5.43-2.082,11.294,11.294,0,0,1-3.782-3.907,11.747,11.747,0,0,1-1.427-6.034,18.422,18.422,0,0,1,.549-4.331,20.564,20.564,0,0,1,1.7-4.531,1.558,1.558,0,0,1,.549-.726.938.938,0,0,1,.852.074l1.607.752a1.359,1.359,0,0,1,.575.5,1.012,1.012,0,0,1-.125.8,17.763,17.763,0,0,0-1.3,3.631,14.974,14.974,0,0,0-.45,3.48,8.473,8.473,0,0,0,.925,4.106,7.551,7.551,0,0,0,2.6,2.779,11.711,11.711,0,0,0,4.081,1.552,28.024,28.024,0,0,0,5.408.476,30.525,30.525,0,0,0,5.658-.476,21.379,21.379,0,0,0,4.232-1.2,8.541,8.541,0,0,0,2.654-1.629,2.54,2.54,0,0,0,.925-1.751q0-1.353-1.777-2.3a36.726,36.726,0,0,0-4.482-1.954Z"
                transform="translate(-345.236 -202.282)"
                fill="#f26522"
              /></g></svg>
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <!-- <v-list-item-title
            class="text-h4"
            v-text="profile.title"
          /> -->
          <v-list-item-title>
            {{ $t('avatar') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list>
      <!--Home page-->
      <template
        v-for="(item, i) in statictics"
      >
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        />

        <base-item
          v-else
          :key="`item-${i}`"
          :item="item"
        />
      </template>
      <!-- drivers -->
      <v-list-group
        no-action
        sub-group
        color="#ff9800"
        :expand="expand"
      >
        <template
          v-slot:activator
        >
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('allDrivers') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in drivers"
          :key="i"
          link
        >
          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          />
          <base-item
            v-else
            :key="`item-${i}`"
            :item="item"
            color="#ff9800"
          />
        </v-list-item>
      </v-list-group>
      <!-- Users -->
      <v-list-group
        no-action
        sub-group
        color="#ff9800"
        :expand="expand"
      >
        <template
          v-slot:activator
        >
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('allClint') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in users"
          :key="i"
          link
        >
          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          />
          <base-item
            v-else
            :key="`item-${i}`"
            :item="item"
            color="#ff9800"
          />
        </v-list-item>
      </v-list-group>
      <!-- Pending -->
      <v-list-group
        no-action
        sub-group
        color="#ff9800"
        :expand="expand"
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-account-clock</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('pending') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in pending"
          :key="i"
          link
        >
          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          />
          <base-item
            v-else
            :key="`item-${i}`"
            :item="item"
          />
        </v-list-item>
      </v-list-group>
      <!-- Cars  -->
      <v-list-group
        no-action
        sub-group
        :expand="expand"
        color="#ff9800"
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-car-sports</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('cars') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in cars"
          :key="i"
          link
        >
          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          />
          <base-item
            v-else
            :key="`item-${i}`"
            :item="item"
          />
        </v-list-item>
      </v-list-group>
      <!-- Pricing -->
      <v-list-group
        no-action
        sub-group
        :expand="expand"
        color="#ff9800"
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-cash-usd-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('pricing') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in setting"
          :key="i"
          link
        >
          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          />
          <base-item
            v-else
            :key="`item-${i}`"
            :item="item"
          />
        </v-list-item>
      </v-list-group>
      <!-- Payments -->
      <v-list-group
        no-action
        sub-group
        :expand="expand"
        color="#ff9800"
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-credit-card-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('payments') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in payments"
          :key="i"
          link
        >
          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          />
          <base-item
            v-else
            :key="`item-${i}`"
            :item="item"
          />
        </v-list-item>
      </v-list-group>
      <!-- Tickets -->
      <v-list-group
        no-action
        sub-group
        :expand="expand"
        color="#ff9800"
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-ticket</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('tickets') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in tickets"
          :key="i"
          link
        >
          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          />
          <base-item
            v-else
            :key="`item-${i}`"
            :item="item"
          />
        </v-list-item>
      </v-list-group>
      <!-- Tracking Shipment -->
      <v-list-group
        no-action
        sub-group
        :expand="expand"
        color="#ff9800"
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-map-marker-path</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('trckingShipment') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in shipment"
          :key="i"
          link
        >
          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          />
          <base-item
            v-else
            :key="`item-${i}`"
            :item="item"
          />
        </v-list-item>
      </v-list-group>
      <!-- About-App -->
      <v-list-group
        no-action
        sub-group
        :expand="expand"
        color="#ff9800"
      >
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-application-settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('aboutApp') }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in about"
          :key="i"
          link
        >
          <base-item-group
            v-if="item.children"
            :key="`group-${i}`"
            :item="item"
          />
          <base-item
            v-else
            :key="`item-${i}`"
            :item="item"
          />
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import {
    mapState,
  } from 'vuex'

  export default {
    name: 'DashboardCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: (vm) => ({
      expand: false,
      statictics: [
        {
          icon: 'mdi-view-dashboard',
          title: vm.$t('statistics'),
          to: '/',
        },
      ],
      payments: [
        {
          title: vm.$t('ammountForDriver'),
          icon: 'mdi-bank-transfer-out',
          to: '/debts',
        },
        {
          title: vm.$t('ammountForApp'),
          icon: 'mdi-bank-transfer-in',
          to: '/for-app',
        },
        {
          title: vm.$t('confirmTransfers'),
          icon: 'mdi-bank',
          to: '/transfers',
        },
        {
          title: vm.$t('transactionHistory'),
          icon: 'mdi-bookshelf',
          to: '/transaction-history',
        },
      ],
      drivers: [
        {
          title: vm.$t('activatedDrivers'),
          icon: 'mdi-account-supervisor-circle',
          to: '/all-drivers',
        },
        {
          title: vm.$t('blockedDrivers'),
          icon: 'mdi-account-remove',
          to: '/blocked-drivers',
        },
        {
          title: vm.$t('pendingDriverOnCIT'),
          icon: 'mdi-account-alert',
          to: '/rejected-on-CIT',
        },
        {
          icon: 'mdi-account-alert',
          title: vm.$t('pendingDrivers'),
          to: '/pending-drivers',
        },
        {
          title: vm.$t('rejectedDrivers'),
          icon: 'mdi-account-remove-outline',
          to: '/rejected-drivers',
        },
      ],
      users: [
        {
          title: vm.$t('activatedClients'),
          icon: 'mdi-account-multiple',
          to: '/all-users',
        },
        {
          title: vm.$t('blockedClints'),
          icon: 'mdi-account-remove',
          to: '/blocked-users',
        },
      ],
      pending: [
        {
          title: vm.$t('pendingVerification'),
          icon: 'mdi-account-question',
          to: '/pending-verification',
        },
      ],
      setting: [
        {
          title: vm.$t('pricing'),
          icon: 'mdi-currency-usd',
          to: '/Pricing',
        },
      ],
      shipment: [
        {
          title: vm.$t('trckingShipment'),
          icon: 'mdi-truck',
          to: '/shipment',
        },
        {
          title: vm.$t('shipmentType'),
          icon: 'mdi-truck-trailer',
          to: '/shipment-type',
        },
        {
          title: vm.$t('pendingShipment'),
          icon: 'mdi-bus-clock',
          to: '/pending-shipment',
        },
        {
          title: vm.$t('rejectedShipment'),
          icon: 'mdi-car-off',
          to: '/rejected-shipment',
        },
      ],
      cars: [
        {
          title: vm.$t('allCars'),
          icon: 'mdi-car-side',
          to: '/all-cars',
        },
        {
          title: vm.$t('blockedCars'),
          icon: 'mdi-car-settings',
          to: '/blocked-cars',
        },
        {
          title: vm.$t('pendingCars'),
          icon: 'mdi-car-cog',
          to: '/pending-cars',
        },
      ],
      tickets: [
        {
          title: vm.$t('tickets'),
          icon: 'mdi-ticket-account',
          to: '/tickets',
        },
        {
          title: vm.$t('ticketType'),
          icon: 'mdi-ticket-confirmation',
          to: '/tickets-type',
        },
      ],
      about: [
        {
          title: vm.$t('aboutApp'),
          icon: 'mdi-application-settings',
          to: '/about-app',
        },
      ],
    }),

    computed: {
      ...mapState(['barColor', 'barImage']),
      drawer: {
        get () {
          return this.$store.state.drawer
        },
        set (val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems () {
        return this.items.map(this.mapItem)
      },
      profile () {
        return {
          avatar: true,
          title: this.$t('avatar'),
        }
      },
    },

    methods: {
      mapItem (item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },
    },
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  .v-navigation-drawer .v-icon.v-icon
      margin: 0 8px !important

  #core-navigation-drawer

    .v-list-group__header.v-list-item--active:before
      opacity: .24
    .v-list-group__items
          .v-list-item
            margin-bottom: 0 !important
    .v-list-group--sub-group
      .v-list-item
        padding: 0
        padding-left: 0 !important
    .v-list-item--active
      background-color: #c57500 !important
      border-color: #c57500 !important
      color: #fff !important
    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
</style>
