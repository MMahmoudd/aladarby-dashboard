<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <div class="mx-3" />
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-2"
          min-width="0"
          v-bind="attrs"
          text
          to="/app-setting"
          v-on="on"
        >
          <v-icon>mdi-cog-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('setting') }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-2"
          min-width="0"
          v-bind="attrs"
          text
          to="/change-password"
          v-on="on"
        >
          <v-icon>mdi-account-key</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('accountSetting') }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
          @click="logout()"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('logout') }}</span>
    </v-tooltip>
    <v-btn
      class="ml-2"
      min-width="0"
      text
      @click="changeLang('en')"
    >
      en
    </v-btn>
    <v-btn
      v-model="$vuetify.rtl"
      class="ml-2"
      min-width="0"
      text
      @click="changeLang('ar')"
    >
      ar
    </v-btn>
    <!-- <v-col
      sm="3"
      cols="6"
    >
      <v-overflow-btn
        id="language"
        class="ma-2 pa-2"
        :items="Language"
        label="Language"
        segmented
        target="#Language"
      />
    </v-col> -->
  </v-app-bar>
</template>

<script>

  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      // Language: [
      //   { text: 'AR', callback: () => vm.changeLang('ar') },
      //   { text: 'EN', callback: () => vm.changeLang('en') },
      // ],
    }),

    computed: {
      ...mapState(['drawer']),
    },
    created () {
      if (localStorage.getItem('userLang')) {
        const userLang = localStorage.getItem('userLang')
        userLang === 'ar' ? (this.$vuetify.rtl = true) : (this.$vuetify.rtl = false)
      }
    },

    methods: {
      changeLang (value) {
        localStorage.setItem('userLang', value)
        window.location.reload()
      },
      changeLTR () {
        this.$vuetify.rtl = false
      },
      changeRTL () {
        this.$vuetify.rtl = true
      },
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      logout () {
        this.$store.commit('logout')
      },
    },
  }
</script>
