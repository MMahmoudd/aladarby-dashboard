<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('shipmentType') }}
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
        :headers="headers"
        :items="shipmentTypes"
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
        <template v-slot:[`item.name`]="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:[`item.details`]="{ item }">
          {{ item.details }}
        </template>
        <template v-slot:[`item.image`]="{ item }">
          <img
            class="image-responsive"
            :src="item.iconUrl"
            alt="type"
          >
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                outlined
                fab
                class="mx-2"
                color="red"
                v-bind="attrs"
                v-on="on"
                @click="confirmDeleteItem(item)"
              >
                <!-- {{ $t('edit') }} -->
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('delete') }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                outlined
                fab
                class="mx-2"
                color="success"
                v-bind="attrs"
                v-on="on"
                @click="editItem(item)"
              >
                <!-- {{ $t('edit') }} -->
                <v-icon>
                  mdi-pencil-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('edit') }}</span>
          </v-tooltip>
        </template>
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-spacer />
            <v-dialog
              v-model="dialog"
              max-width="1200px"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  color="success"
                  small
                  outlined
                  class="mb-2"
                  v-on="on"
                >
                  {{ $t('newPackage') }}
                </v-btn>
              </template>
              <v-card>
                <base-material-card
                  :title="$t('newPackage')"
                  color="success"
                  class="text-h5"
                >
                  <v-card-text class="mt-8">
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-text-field
                            v-model="addPackage.name"
                            required
                            :label="$t('name')"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-text-field
                            v-model="addPackage.details"
                            required
                            :label="$t('details')"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-file-input
                            show-size
                            chips
                            required
                            prepend-icon="mdi-camera"
                            accept="image/png, image/jpeg, image/bmp"
                            :label="$t('image')"
                            @change="onNewFileSelected"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
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
                    <v-btn
                      color="success"
                      outlined
                      :loading="loading"
                      :disabled="disabled"
                      @click="newPackage()"
                    >
                      {{ $t('save') }}
                    </v-btn>
                  </v-card-actions>
                </base-material-card>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog1"
      max-width="1200px"
    >
      <v-card>
        <base-material-card
          :title="$t('editPackage')"
          color="success"
          class="text-h5"
        >
          <v-card-text class="mt-8">
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="2"
                >
                  <v-text-field
                    v-model="packageData.name"
                    :label="$t('name')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <v-text-field
                    v-model="packageData.details"
                    :label="$t('details')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <img
                    :src="packageData.iconUrl"
                    class="image-responsive"
                    alt="icon"
                  >
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <v-file-input
                    show-size
                    chips
                    prepend-icon="mdi-camera"
                    accept="image/png, image/jpeg, image/bmp"
                    :label="$t('image')"
                    @change="onFileSelected"
                  />
                </v-col>
              </v-row>
            </v-container>
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
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click="updatePackage(packageData)"
            >
              {{ $t('save') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      max-width="500px"
    >
      <v-card v-model="packageData">
        <base-material-card
          :title="$t('confirmDelete')"
          color="red"
        >
          <v-card-text class="mt-8">
            {{ $t('areYOuSureDelete') }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click="deletePackage(packageData)"
            >
              {{ $t("delete") }}
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
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const ShipmentServices = ServiceFactory.get('shipments')
  export default {
    data: (vm) => ({
      shipmentTypes: [],
      loader: null,
      loading: false,
      disabled: false,
      dataLoading: false,
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      packageData: {
        name: '',
        details: '',
        iconUrl: '',
        icon: null,
      },
      search: '',
      singleSelect: false,
      dialog: false,
      dialog1: false,
      dialog2: false,
      selected: [],
      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: vm.$t('name'), sortable: false, value: 'name' },
        { text: vm.$t('details'), value: 'details', sortable: false },
        { text: vm.$t('image'), value: 'image', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      addPackage: {
        name: '',
        details: '',
        icon: null,
      },
      editedPackage: {
        name: '',
        details: '',
        icon: null,
      },
      defaultItem: {
        name: '',
        details: '',
        icon: null,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Package' : 'Edit Package'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      options: {
        handler () {
          this.fetchAllItems()
        },
      },
      deep: true,
    },

    methods: {
      confirmDeleteItem (packageItem) {
        console.log(packageItem)
        this.packageData = packageItem
        this.dialog2 = true
      },
      editItem (packageItem) {
        this.packageData = packageItem
        this.dialog1 = true
      },
      onFileSelected (event) {
        this.packageData.icon = event
      },
      onNewFileSelected (event) {
        this.addPackage.icon = event
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
          Object.assign(this.shipmentTypes[this.editedIndex], this.editedItem)
        } else {
          this.shipmentTypes.push(this.editedItem)
        }
        this.close()
      },

      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const shipmentTypes = await ShipmentServices.getAllShipmentType(itemsPerPage, page, pageNumber)
        this.shipmentTypes = shipmentTypes.data.data
        this.total = shipmentTypes.data.total
        this.numberOfPages = shipmentTypes.data.pageCount
        this.dataLoading = false
      },
      async newPackage () {
        this.disabled = true
        this.loading = true
        const Package = this.addPackage
        const sendSucess = await ShipmentServices.addPackage(Package)
        if (sendSucess) {
          this.close()
          this.disabled = false
          this.loading = false
          this.$router.go('/shipment-type')
        } else {
          this.disabled = false
          this.loading = false
        }
      },
      async updatePackage (packageData) {
        this.disabled = true
        this.loading = true
        const Package = this.packageData
        const packageId = this.packageData.id
        const updateSucess = await ShipmentServices.updatePackage(packageId, Package)
        if (updateSucess.done) {
          this.dialog1 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/shipment-type')
        } else {
          this.disabled = false
          this.loading = false
        }
      },
      async deletePackage (packageData) {
        this.disabled = true
        this.loading = true
        const packageId = this.packageData.id
        const deleteSucess = await ShipmentServices.deletePackage(packageId)
        if (deleteSucess.done) {
          this.dialog2 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/shipment-type')
        } else {
          this.disabled = false
          this.loading = false
        }
      },
    },
  }
</script>
<style lang="scss">
.image-responsive{
    width: 70px;
    height: 70px;
    border-radius:7px ;
    margin-top: 5px;

}
.v-card .v-card--material__heading{
  top: 0px !important;
}
</style>
