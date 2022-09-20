<template>
  <div class="container p-5">
    <HeadTitle />
    <div class="card px-10 py-5 rounded-2xl m-5 w-auto md:w-96">
      <p class="text-sm">Login to start your session</p>

      <form class="my-5" @submit="onSubmit">
        <p class="font-bold text-left">Username</p>
        <input v-model="username" type="text" class="control mb-5" />

        <p class="font-bold text-left">Password</p>
        <input v-model="password" type="password" class="control mb-5" />

        <div class="flex justify-between align-center">
          <nuxt-link to="/regis" class="link">Create Account</nuxt-link>
          <button type="submit" class="btn button">Sign in</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import HeadTitle from '~/components/HeadTitle.vue'

export default {
  name: 'IndexPage',
  components: { HeadTitle },
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.$swal({
        type: 'success',
        title: 'Sign in success',
        showConfirmButton: false,
        timer: 2000,
      }).then(() => this.$router.push('/todo'))
    },
  },
}
</script>

<style scoped></style>
