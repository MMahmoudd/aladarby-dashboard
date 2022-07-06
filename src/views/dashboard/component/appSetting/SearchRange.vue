<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-data-table
        :loading="dataLoading"
        :items="Data"
        :headers="headers"
        item-key="id"
        @fetchAllItems="fetchAllItems"
      >
        <template
          v-slot:[`item.driverSearchRange`]="{ item }"
        >
          <p class="text-center">
            Driver Search Range {{ item.driverSearchRange }} KM
          </p>
          <v-text-field
            v-model="item.driverSearchRange"
            label="driver Search Range per KM"
            outlined
            readonly
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
                color="success"
                v-bind="attrs"
                v-on="on"
                @click="confirmEdit(item)"
              >
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('edit') }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <template>
      <v-dialog
        v-model="dialog"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Edit Rnge</span>
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="range.driverSearchRange"
              :rules="rules"
              label="driver Search Range per KM"
              outlined
              type="number"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :loading="loading"
              :disabled="disabled"
              @click="updateSetting(range)"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <base-material-snackbar
      v-model="snackbar"
      color="success"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      The Range has been updated successfly.
    </base-material-snackbar>
    <base-material-snackbar
      v-model="snackbar1"
      color="error"
      v-bind="{
        [parsedDirection[0]]: true,
        [parsedDirection[1]]: true
      }"
    >
      Something Error
    </base-material-snackbar>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../../services/ServiceFactory'
  const appSettingServices = ServiceFactory.get('appSetting')
  export default {
    data: () => ({
      range: {},
      loader: null,
      loading: false,
      disabled: false,
      Data: [],
      driverSearchRange: '',
      dialog: false,
      snackbar: false,
      snackbar1: false,
      direction: 'top center',
      rules: [
        value => {
          const pattern = /^[0-9]*$/
          return pattern.test(value) || 'Invalid Number.'
        },
      ],
      headers: [
        {
          value: 'driverSearchRange', sortable: false,
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
    created () {
      this.fetchAllItems()
    },
    methods: {
      confirmEdit (Item) {
        this.range = Item
        this.dialog = true
      },
      async fetchAllItems () {
        this.dataLoading = true
        const driverRange = await appSettingServices.getAllSetting()
        this.Data = driverRange
        console.log(driverRange)
        this.dataLoading = false
      },
      async updateSetting (data) {
        this.disabled = true
        this.loading = true
        const settingData = data
        const dataId = data.id
        const updateSucess = await appSettingServices.updateSetting(dataId, settingData)
        if (updateSucess) {
          this.dialog = false
          this.snackbar = true
          this.disabled = false
          this.loading = false
          // this.$router.go('/app-setting')
        } else {
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
</style>
