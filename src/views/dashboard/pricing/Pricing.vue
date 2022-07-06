<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('pricing') }}
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
      </v-card-title>
      <v-data-table
        :loading="dataLoading"
        :headers="headers"
        :items="price"
        item-key="id"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50]
        }"
        :options.sync="options"
        :server-items-length="total"
        :page-count="numberOfPages"
        @fetchAllItems="fetchAllItems"
      >
        <template v-slot:[`item.details`]="{ item }">
          {{ item.details }}
        </template>
        <template v-slot:[`item.weightfrom`]="{ item }">
          {{ item.weightfrom }}
        </template>
        <template v-slot:[`item.weightto`]="{ item }">
          {{ item.weightto }}
        </template>
        <template v-slot:[`item.pricePerKm`]="{ item }">
          {{ item.crossBorderPrice }}
        </template>
        <template v-slot:[`item.slices`]="{ item }">
          {{ item.slices.length }}
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                outlined
                fab
                class="mx-2"
                color="purple"
                v-bind="attrs"
                v-on="on"
                @click="viewSlices(item)"
              >
                <v-icon>
                  mdi-eye
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('viewSlices') }}</span>
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
                color="success"
                v-bind="attrs"
                v-on="on"
                @click="editItem(item)"
              >
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
                  color="primary"
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
                            :label="$t('description')"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-text-field
                            v-model="addPackage.weightfrom"
                            :label="$t('weightFrom')"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-text-field
                            v-model="addPackage.weightto"
                            :label="$t('weightTo')"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-text-field
                            v-model="addPackage.crossBorderPrice"
                            :label="$t('internationalShipmentFees')"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-btn
                            color="success"
                            outlined
                            @click="addNewSlices"
                          >
                            {{ $t('addSlice') }}
                          </v-btn>
                        </v-col>
                      </v-row>

                      <!-- Start slices  -->
                      <v-col
                        class="d-flex"
                        cols="12"
                      >
                        <v-card
                          v-for="(formCard, index) in formCards"
                          :key="index"
                          class="pa-2 ma-2"
                        >
                          <v-card-title>
                            <span class="text-h5">{{ $t('newSlice') }}</span>
                            <v-spacer />

                            <v-icon
                              aria-label="Close"
                              @click="deleteSlices()"
                            >
                              mdi-close
                            </v-icon>
                          </v-card-title>
                          <v-text-field
                            v-model="formCard.fromKm"
                            :label="$t('fromKm')"
                          />
                          <v-text-field
                            v-model="formCard.toKm"
                            :label="$t('toKm')"
                          />
                          <v-text-field
                            v-model="formCard.price"
                            :label="$t('price')"
                          />
                        </v-card>
                      </v-col>

                    <!-- End slices  -->
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
          color="success"
          :title="$t('editPackage')"
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
                    :label="$t('description')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="2"
                >
                  <v-text-field
                    v-model="packageData.weightfrom"
                    :label="$t('weightFrom')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="2"
                >
                  <v-text-field
                    v-model="packageData.weightto"
                    :label="$t('weightTo')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="2"
                >
                  <v-text-field
                    v-model="packageData.crossBorderPrice"
                    :label="$t('internationalShipmentFees')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="2"
                >
                  <v-btn
                    color="primary"
                    outlined
                    @click="addNewSlicesInEdit"
                  >
                    {{ $t('addSlice') }}
                  </v-btn>
                </v-col>
              </v-row>
              <!-- Start slices  -->
              <v-col
                class="d-flex"
                cols="12"
              >
                <v-card
                  v-for="(slice, index) in packageData.slices"
                  :key="index"
                  class="pa-2 ma-2"
                >
                  <v-card-title>
                    <span class="text-h5">{{ $t('newSlice') }}</span>
                    <v-spacer />

                    <v-icon
                      aria-label="Close"
                      @click="deleteSlices()"
                    >
                      mdi-close
                    </v-icon>
                  </v-card-title>
                  <v-text-field
                    v-model="slice.fromKm"
                    :label="$t('fromKm')"
                  />
                  <v-text-field
                    v-model="slice.toKm"
                    :label="$t('toKm')"
                  />
                  <v-text-field
                    v-model="slice.price"
                    :label="$t('price')"
                  />
                </v-card>
              </v-col>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              outlined
              @click="dialog1= false"
            >
              {{ $t('close') }}
            </v-btn>
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="loading"
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
      max-width="1200px"
    >
      <v-card>
        <base-material-card
          :title="$t('viewSlices')"
          color="purple"
          class="text-h5"
        >
          <v-card-text class="mt-8">
            <v-container>
              <!-- Start slices  -->
              <v-col
                class="d-flex"
                cols="12"
              >
                <v-card
                  v-for="(slice, index) in packageData.slices"
                  :key="index"
                  class="pa-2 ma-2"
                >
                  <v-card-title>
                    <span class="text-h5">{{ $t('newSlice') }}</span>
                    <v-spacer />
                  </v-card-title>
                  <v-text-field
                    v-model="slice.fromKm"
                    :label="$t('fromKm')"
                    readonly
                  />
                  <v-text-field
                    v-model="slice.toKm"
                    :label="$t('toKm')"
                    readonly
                  />
                  <v-text-field
                    v-model="slice.price"
                    :label="$t('price')"
                    readonly
                  />
                </v-card>
              </v-col>

            <!-- End slices  -->
            </v-container>
          </v-card-text>
        </base-material-card>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const pricingServices = ServiceFactory.get('price')
  export default {
    data: (vm) => ({
      search: {
        name: '',
      },
      price: [],
      slices: [],
      loader: null,
      loading: false,
      disabled: false,
      dataLoading: false,
      input: null,
      nonce: 0,
      formCards: [],
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      packageData: {
        name: '',
        details: '',
        weightfrom: '',
        weightto: '',
        crossBorderPrice: '',
        slices: [],
      },
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
        { text: vm.$t('description'), value: 'details', sortable: false },
        { text: vm.$t('weightFrom'), value: 'weightfrom', sortable: false },
        { text: vm.$t('weightTo'), value: 'weightto', sortable: false },
        { text: vm.$t('internationalShipment'), value: 'pricePerKm', sortable: false },
        { text: vm.$t('slices'), value: 'slices', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      addPackage: {
        name: '',
        details: '',
        weightfrom: '',
        weightto: '',
        crossBorderPrice: '',
        slices: [],
      },
      editedPackage: {
        name: '',
        details: '',
        weightfrom: '',
        weightto: '',
        crossBorderPrice: '',
        slices: [],
      },
      defaultItem: {
        name: '',
        details: '',
        weightfrom: '',
        weightto: '',
        crossBorderPrice: '',
        slices: [],
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Package' : 'Edit Package'
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
      viewSlices (packageItem) {
        this.formCards = this.packageData.slices
        this.packageData = packageItem
        this.dialog2 = true
        if (packageItem.slices.length === 0) {
          // this.s
        }
      },

      addNewSlices () {
        this.addPackage.slices = this.formCards
        this.addPackage.slices.push({
          fromKm: null,
          toKm: null,
          price: null,
        })
      },
      addNewSlicesInEdit () {
        // this.formCards = this.packageData.slices
        this.packageData.slices.push({
          fromKm: null,
          toKm: null,
          price: null,
        })
      },
      deleteSlices (id) {
        const index = this.formCards.indexOf(id)
        this.formCards.splice(index, 1)
      },
      editItem (packageItem) {
        this.formCards = this.packageData.slices
        this.packageData = packageItem
        this.dialog1 = true
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
          Object.assign(this.price[this.editedIndex], this.editedItem)
        } else {
          this.price.push(this.editedItem)
        }
        this.close()
      },

      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const price = await pricingServices.getAllPackages(itemsPerPage, page, pageNumber, this.search)
        this.price = price.data.data
        this.total = price.data.total
        this.numberOfPages = price.data.pageCount
        console.log(this.price)
        this.dataLoading = false
      },
      async newPackage () {
        this.disabled = true
        this.loading = true
        this.addPackage.slices = this.formCards
        this.addPackage.slices.map(item => {
          item.fromKm = parseInt(item.fromKm)
          item.price = parseInt(item.price)
          item.toKm = parseInt(item.toKm)
        })
        const sendSucess = await pricingServices.addPackage(this.addPackage)
        if (sendSucess) {
          this.close()
          this.disabled = false
          this.loading = false
          this.$router.go('/pricing')
        } else {
          this.disabled = false
          this.loading = false
        }
      },
      async updatePackage (packageData) {
        this.disabled = true
        this.loading = true
        packageData.slices.map(item => {
          item.fromKm = parseInt(item.fromKm)
          item.price = parseInt(item.price)
          item.toKm = parseInt(item.toKm)
        })
        const Package = packageData
        const packageId = packageData.id
        console.log('packageData', packageData)
        const updateSucess = await pricingServices.updatePackage(packageId, Package)
        console.log('updateSucess', updateSucess)
        if (updateSucess.done) {
          this.dialog1 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/pricing')
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
