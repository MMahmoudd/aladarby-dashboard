<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card>
      <v-card-title>
        {{ $t('aboutApp') }}
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
        :items="aboutApp"
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
        <template v-slot:[`item.details`]="{ item }">
          {{ item.text }}
        </template>
        <template v-slot:[`item.image`]="{ item }">
          <img
            class="image-responsive"
            :src="item.image"
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
                @click="confirmDelete(item)"
              >
                <v-icon>
                  mdi-trash-can-outline
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
                  {{ $t('newAboutApp') }}
                </v-btn>
              </template>
              <v-card>
                <base-material-card
                  :title="$t('newAboutApp')"
                  color="success"
                  class="text-h5"
                >
                  <v-card-text class="mt-8">
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-textarea
                            v-model="addData.text"
                            outlined
                            required
                            rows="10"
                            :label="$t('text')"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="3"
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
                      @click="dialog = false"
                    >
                      {{ $t('close') }}
                    </v-btn>
                    <v-btn
                      color="success"
                      outlined
                      :loading="loading"
                      :disabled="disabled"
                      @click="newAboutAppData()"
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
          :title="$t('editData')"
          color="success"
          class="text-h5"
        >
          <v-card-text class="mt-8">
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-textarea
                    v-model="aboutAppData.text"
                    outlined
                    rows="10"
                    :label="$t('text')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <img
                    :src="aboutAppData.image"
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
              @click="dialog1 = false"
            >
              {{ $t('close') }}
            </v-btn>
            <v-btn
              color="success"
              outlined
              :loading="loading"
              :disabled="disabled"
              @click="updateAboutAppData(packageData)"
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
      <v-card v-model="aboutAppData">
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
              @click="deleteAboutAppData(aboutAppData)"
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
  const AboutAppServices = ServiceFactory.get('aboutApp')
  export default {
    data: (vm) => ({
      aboutApp: [],
      loader: null,
      loading: false,
      disabled: false,
      dataLoading: false,
      page: 0,
      total: 0,
      numberOfPages: 0,
      options: {},
      aboutAppData: {
        text: '',
        image: '',
        media: null,
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
        { text: vm.$t('details'), sortable: false, value: 'text' },
        { text: vm.$t('image'), value: 'image', sortable: false },
        { text: vm.$t('actions'), value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      addData: {
        text: '',
        details: '',
        media: null,
      },
      editData: {
        text: '',
        details: '',
        media: null,
      },
      defaultItem: {
        text: '',
        details: '',
        media: null,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Data' : 'Edit Data'
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
      confirmDelete (item) {
        this.aboutAppData = item
        this.dialog2 = true
      },
      editItem (packageItem) {
        this.aboutAppData = packageItem
        this.dialog1 = true
      },
      onFileSelected (event) {
        this.aboutAppData.media = event
      },
      onNewFileSelected (event) {
        this.addData.media = event
      },
      async fetchAllItems () {
        this.dataLoading = true
        const { page, itemsPerPage } = this.options
        const pageNumber = page - 1
        const aboutAppData = await AboutAppServices.getAllAboutAppData(itemsPerPage, page, pageNumber)
        this.aboutApp = aboutAppData.data.data
        this.total = aboutAppData.data.total
        this.numberOfPages = aboutAppData.data.pageCount
        this.dataLoading = false
      },
      async newAboutAppData () {
        this.disabled = true
        this.loading = true
        const Package = this.addData
        const sendSucess = await AboutAppServices.addAboutAppData(Package)
        if (sendSucess) {
          this.close()
          this.disabled = false
          this.loading = false
          this.$router.go('/about-app')
        } else {
          this.disabled = false
          this.loading = false
        }
      },
      async updateAboutAppData (packageData) {
        this.disabled = true
        this.loading = true
        const Package = this.aboutAppData
        const packageId = this.aboutAppData.id
        const updateSucess = await AboutAppServices.updateAboutAppData(packageId, Package)
        if (updateSucess.done) {
          this.dialog1 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/about-app')
        } else {
          this.disabled = false
          this.loading = false
        }
      },
      async deleteAboutAppData (packageData) {
        this.disabled = true
        this.loading = true
        const packageId = this.aboutAppData.id
        const updateSucess = await AboutAppServices.deleteAboutAppData(packageId)
        if (updateSucess.done) {
          this.dialog1 = false
          this.disabled = false
          this.loading = false
          this.$router.go('/about-app')
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
