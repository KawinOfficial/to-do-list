<template>
  <div class="container p-5">
    <HeadTitle />
    <div class="card px-10 py-5 rounded-2xl m-5 w-auto md:w-96">
      <p class="text-sm">Login to start your session</p>

      <form class="my-5" @submit="onSubmit">
        <p class="font-bold text-left">Username</p>
        <input
          v-model="username"
          type="text"
          class="control mb-5"
          placeholder="Type your username"
        />

        <p class="font-bold text-left">Password</p>
        <input
          v-model="password"
          type="password"
          class="control mb-5"
          placeholder="Type your password"
        />

        <div class="flex justify-between align-center">
          <nuxt-link to="/register" class="link">Create Account</nuxt-link>
          <button type="submit" class="btn button">Sign in</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  useRouter,
  useContext,
} from '@nuxtjs/composition-api'
import swal from 'sweetalert2'
import HeadTitle from '~/components/HeadTitle.vue'

export default defineComponent({
  name: 'IndexPage',
  components: { HeadTitle },
  setup() {
    const router = useRouter()
    const { $axios, store } = useContext()
    const state = reactive({
      username: '',
      password: '',
    })

    const onSubmit = (e) => {
      e.preventDefault()
      swal({
        onOpen: () => {
          swal.showLoading()
        },
        title: 'Loading...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      })

      $axios.$post('/signin', state).then((result) => {
        swal.close()

        if (result.state) {
          localStorage.setItem('token', result.token)
          localStorage.setItem('userId', result.id)
          store.commit('setToken', result.token)
          swal({
            type: 'success',
            title: 'Sign in success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => router.push('/listPage'))
        } else {
          swal({
            type: 'error',
            title: result.msg,
            showConfirmButton: false,
            timer: 6000,
          })
        }
      })
    }

    return {
      ...toRefs(state),
      onSubmit,
    }
  },
})
</script>
