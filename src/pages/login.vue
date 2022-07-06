<template>
  <v-container
    id="regular-tables"
    class="login"
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
            src="../assets/vuetify.svg"
            alt="test"
          >
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h5">
            Login Ala Darbi Dashboard
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-if="loginErrorMessage">
        <v-alert
          type="error"
          color="#ff5252"
        >
          {{ loginErrorMessage }}
          <!-- The username or password is wrong -->
        </v-alert>
      </template>
      <v-form @submit.prevent="loginSubmit()">
        <vue-tel-input
          v-model="userLogin.mobile"
          type="tel"
          v-bind="bindProps"
        />
        <v-text-field
          v-model="userLogin.password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          hint="At least 8 characters"
          counter
          placeholder="Password"
          outlined
          @click:append="show1 = !show1"
        />
      </v-form>
      <v-card-actions>
        <template>
          <v-btn
            class="mr-4 submit"
            :disabled="formValid && loading"
            :loading="loading"
            @click="loader = 'loading'"
          >
            Login
            <v-icon>
              mdi-login
            </v-icon>
          </v-btn>
        </template>
        <router-link to="/ResetPassword">
          forgett password?
        </router-link>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
  import { VueTelInput } from 'vue-tel-input'
  import { mapState, mapActions } from 'vuex'
  import { validationMixin } from 'vuelidate'
  import { required, email, password } from 'vuelidate/lib/validators'
  export default {
    components: {
      VueTelInput,
    },
    mixins: [validationMixin],
    validations: {
      email: { required, email },
      password: { required, password },
    },
    data () {
      return {
        formValid: false,
        isValid: true,
        show1: false,
        userLogin: {
          mobile: '',
          password: '',
        },
        loader: null,
        loading: false,
        bindProps: {
          mode: 'international',
          disabledFetchingCountry: false,
          disabledFormatting: false,
          defaultCountry: 'SA',
          placeholder: 'أدخل رقم الهاتف',
          required: true,
          enabledCountryCode: false,
          type: 'tel',
          formattedNumber: true,
          autocomplete: 'on',
          // autofocus: true,
          name: 'telephone',
          validCharactersOnly: true,
          dropdownOptions: {
            disabledDialCode: true,
          },
          inputOptions: {
            showDialCode: true,
          },
        },
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
        },
      }
    },
    computed: {
      phoneErrors () {
        const errors = []
        if (!this.$v.phone.$dirty) return errors
        !this.$v.phone.phone && errors.push('Must be valid Phone number')
        !this.$v.phone.required && errors.push('phone number is required')
        return errors
      },
      ...mapState({
        isLoading: state => state.login.isLoading,
        loginErrorMessage: state => state.login.loginErrorMessage,
        loginSuccessful: state => state.login.loggingIn,
      }),
    },
    watch: {
      userLogin: {
        handler (val) {
          // console.log(val)
          if (this.userLogin.mobile && this.userLogin.password) {
            this.formValid = false
          } else {
            this.formValid = true
          }
        },
        deep: true,
      },
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 4000)

        this.loader = null
        this.loginSubmit()
      },
    },
    methods: {
      ...mapActions([
        'doLogin',
      ]),
      loginSubmit () {
        if (!this.formValid) {
          this.doLogin({
            mobile: this.userLogin.mobile.split(' ').join(''),
            password: this.userLogin.password,
          })
        }
      },
    },
  }
</script>
<style lang="scss">
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
.login{
  background-image: url('../assets/aladarby.svg');
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
}
  .v-card{
    top:100px;
    margin: auto;
    .v-form{
      padding: 20px;
      input{
        min-height: 40px !important;
      }
      .vue-tel-input{
        margin: 15px 0;
        &:focus-within{
            box-shadow: unset !important;
            border-color: unset !important;
        }
      }
      v-text-field{
        border-radius: 3px;
        border: 1px solid #bbb;
        text-align: left;
      }
      // .v-input{
      //   &:focus{
      //       box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
      //       border-color: #66afe9;
      //   }
      // }
      .v-text-field--outlined.v-input--has-state fieldset{
        border: 1px solid #bbb;
        &:focus{
          outline: none;
        }
      }
      .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details{
        &:focus{
          border: 1px solid #bbb;
              outline: none;
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
            border-color: #66afe9;
        }
      }
      .v-label{
          left: 0px !important;
          right: auto !important;
        }
    }
    input:-internal-autofill-selected {
      background-color: #fff !important;
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
