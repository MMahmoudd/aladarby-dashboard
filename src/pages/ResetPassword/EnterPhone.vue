<template>
  <v-container
    id="regular-tables"
    class="enterphone"
    fluid
    tag="section"
  >
    <v-card
      class="mx-auto"
      max-width="500"
      raised
    >
      <v-list-item>
        <v-list-item-avatar
          color="white"
          tile
          height="50"
          width="50"
        >
          <img
            src="../../assets/vuetify.svg"
            alt="test"
          >
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h5">
            Resset Password
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-form>
        <vue-tel-input v-model="phone" />
        <v-card-actions>
          <v-btn
            class="mr-4 submit"
          >
            <router-link to="/enterCode">
              submit
            </router-link>
          </v-btn>
          <router-link to="/login">
            Back
          </router-link>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
  export default {
    data () {
      return {
        phone: '',
      }
    },
  }
</script>
<style lang="scss">
.enterphone{
  background-image: url('../../assets/aladarby.svg');
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
}
  .v-card{
    top:100px;
    margin: auto;
    .v-form{
      padding: 20px;
    }
    .v-list-item{
      background-color: #00000008;
      padding:10px 20px;
    }
    .v-avatar{
      margin: 0 15px;
    }
    .submit{
      background-color: #28a745 !important;
    }
  }
</style>
