<template>
  <v-container
    id="regular-tables"
    class="newPassword"
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
            New Password
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-form>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          hint="At least 8 characters"
          counter
          required
          @click:append="show1 = !show1"
        />
        <v-text-field
          v-model="password1"
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show2 ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          hint="At least 8 characters"
          counter
          required
          @click:append="show2 = !show2"
        />
        <v-card-actions>
          <v-btn
            class="mr-4 submit"
          >
            <router-link to="/">
              submit
            </router-link>
          </v-btn>
          <router-link to="/login">
            Back TO Login
          </router-link>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
  import { validationMixin } from 'vuelidate'
  import { required, password } from 'vuelidate/lib/validators'
  export default {
    mixins: [validationMixin],
    validations: {
      password: { required, password },
      password1: { required, password },
    },
    data () {
      return {
        show1: false,
        show2: false,
        password: '',
        password1: '',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => ('The Phone Number and password you entered don\'t match'),
        },
      }
    },
  }
</script>
<style lang="scss">
.newPassword{
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
