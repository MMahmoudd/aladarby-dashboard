<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card class="d-flex CPCard">
      <v-text-field
        v-model="password"
        label="New Password"
        outlined
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        @click:append="show1 = !show1"
      />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            fab
            outlined
            class="mx-2"
            color="success"
            v-bind="attrs"
            :loading="loading"
            :disabled="disabled"
            v-on="on"
            @click="updatePassword()"
          >
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('edit') }}</span>
      </v-tooltip>
    </v-card>
    <base-material-snackbar
      v-model="snackbar"
      color="success"
      right
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ Messages }}
    </base-material-snackbar>
    <base-material-snackbar
      v-model="snackbar1"
      color="error"
      right
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      {{ Messages }}
    </base-material-snackbar>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../../services/ServiceFactory'
  const appSettingServices = ServiceFactory.get('appSetting')
  export default {
    data: () => ({
      loader: null,
      loading: false,
      disabled: false,
      password: '',
      Messages: '',
      snackbar: false,
      snackbar1: false,
      show1: false,
      direction: 'top center',
      rules: [
        value => {
          const pattern = /^[0-9]*$/
          return pattern.test(value) || 'Invalid Password.'
        },
      ],
      headers: [
        {
          value: 'Password', sortable: false,
        },
        {
          value: 'actions', sortable: false,
        },
      ],
    }),
    computed: {
      parsedDirection () {
        return this.direction.split(' ')
      },
    },
    // watch: {
    //   loader () {
    //     const l = this.loader
    //     this[l] = !this[l]

    //     setTimeout(() => (this[l] = false), 99000)

    //     this.loader = null
    //   },
    // },
    methods: {
      async updatePassword () {
        this.disabled = true
        this.loading = true
        const updateSucess = await appSettingServices.updatePassword(this.password)
        if (updateSucess.done === true) {
          this.Messages = 'The Password Updated Successfully'
          this.snackbar = true
          this.disabled = false
          this.loading = false
          this.$router.push('/')
        } else {
          this.Messages = updateSucess.error[0]
          this.snackbar1 = true
          this.disabled = false
          this.loading = false
        }
      },
    },
  }
</script>
<style lang="scss">
.v-application--is-ltr{
  tr:hover{
    background: #fff !important;
  }
  .v-data-table-header,
  .v-data-footer{
    display: none
  }
}
.CPCard{
    padding: 15px;
}
</style>
