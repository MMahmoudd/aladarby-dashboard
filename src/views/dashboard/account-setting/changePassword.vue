<template>
  <div class="change-password">
    <v-card>
      <v-toolbar
        flat
        color="#363636"
        dark
      >
        <v-toolbar-title>Account Setting</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical>
        <v-tab left>
          <v-icon left>
            mdi-account-key
          </v-icon>
          Change Password
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <changePassword />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>
<script>
  import changePassword from '../component/account-setting/change-password'
  export default {
    components: {
      changePassword,
    },
  }
</script>
<style lang="scss">
  .v-tab{
    justify-content: left !important;
  }
</style>
