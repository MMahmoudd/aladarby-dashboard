<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('ticketType') }}
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
        :items="ticketType"
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
        <template v-slot:[`item.title`]="{ item }">
          {{ item.title }}
        </template>
        <template v-slot:[`item.description`]="{ item }">
          {{ item.description }}
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
                  color="success"
                  small
                  outlined
                  class="mb-2"
                  v-on="on"
                >
                  {{ $t('newTicketType') }}
                </v-btn>
              </template>
              <v-card>
                <base-material-card
                  :title="$t('newType')"
                  color="success"
                  class="text-h5"
                >
                  <v-card-text class="mt-8">
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="addType.title"
                            label="Title"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="addType.description"
                            label="Description"
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
                      @click="createTicketType()"
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
          :title="$t('editTicketType')"
          color="success"
          class="text-h5"
        >
          <v-card-text class="mt-8">
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-text-field
                    v-model="ticketTypeData.title"
                    label="Title"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-text-field
                    v-model="ticketTypeData.description"
                    label="Description"
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
              @click="updateType(ticketTypeData)"
            >
              {{ $t('save') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import { ServiceFactory } from '../../../services/ServiceFactory'
  const ticketsServices = ServiceFactory.get('tickets')
  export default {
    data: (vm) => ({
      ticketType: [],
      loader: null,
      loading: false,
      disabled: false,
      dataLoading: false,
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      ticketTypeData: {
        id: '',
        title: '',
        description: '',
      },
      addType: {
        title: '',
        description: '',
      },
      search: '',
      singleSelect: false,
      dialog: false,
      dialog1: false,
      selected: [],
      headers: [
        {
          text: vm.$t('id'),
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: vm.$t('name'), sortable: false, value: 'title' },
        { text: vm.$t('description'), value: 'description', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
      ],
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

      editItem (packageItem) {
        this.ticketTypeData = packageItem
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
        const type = await ticketsServices.getAllTicketsType(itemsPerPage, page, pageNumber)
        this.ticketType = type.data.data
        this.total = type.data.total
        this.numberOfPages = type.data.pageCount
        this.dataLoading = false
      },
      async createTicketType () {
        this.disabled = true
        this.loading = true
        const sendSucess = await ticketsServices.createTicketType(this.addType)
        if (sendSucess) {
          this.close()
          this.disabled = false
          this.loading = false
          this.$router.go('/tickets-type')
        } else {
          this.disabled = false
          this.loading = false
        }
      },
      async updateType (ticketTypeData) {
        this.disabled = true
        this.loading = true
        const ticketType = this.ticketTypeData
        const ticketTypeId = this.ticketTypeData.id
        const updateSucess = await ticketsServices.updateType(ticketTypeId, ticketType)
        if (updateSucess.done) {
          this.dialog1 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/tickets-type')
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
