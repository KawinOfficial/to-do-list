<template>
  <div class="container p-5">
    <HeadTitle />
    <div class="card px-10 py-5 rounded-2xl m-5 w-auto md:w-96">
      <p class="text-sm">Create Account</p>
      <form class="my-5" @submit="onSubmit">
        <p class="font-bold text-left">Username</p>
        <input v-model="username" type="text" class="control mb-5" />

        <p class="font-bold text-left">Password</p>
        <input v-model="password" type="password" class="control mb-5" />
        <p class="font-bold text-left">Confirm Password</p>
        <input v-model="confirmPass" type="password" class="control mb-5" />

        <div class="flex justify-between align-center">
          <nuxt-link to="/" class="link">Back to sign in</nuxt-link>
          <input
            type="submit"
            value="Sign up"
            class="btn button"
            :disabled="password != confirmPass || password == ''"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import HeadTitle from '~/components/HeadTitle.vue'
export default {
  name: 'RegisPage',
  components: { HeadTitle },
  data() {
    return {
      username: '',
      password: '',
      confirmPass: '',
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.$swal('Success!', 'Transaction was successful', 'success')
    },
  },
}
</script>
