<template>
  <div class="container p-5">
    <HeadTitle />
    <div class="card px-10 py-5 rounded-2xl m-5 w-auto md:w-96">
      <p class="text-sm">Create Account</p>
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
        <p class="font-bold text-left">Confirm Password</p>
        <input
          v-model="confirmPass"
          type="password"
          class="control mb-5"
          placeholder="Confirm your password"
        />

        <div class="flex justify-between align-center">
          <nuxt-link to="/" class="link">
            <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-1" />
            Back to sign in</nuxt-link
          >
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
import {
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'
import swal from 'sweetalert2'
import HeadTitle from '~/components/HeadTitle.vue'

export default defineComponent({
  name: 'RegisPage',
  components: { HeadTitle },
  setup() {
    const router = useRouter()
    const { $axios } = useContext()
    const state = reactive({
      username: '',
      password: '',
      confirmPass: '',
    })

    const onSubmit = (e) => {
      e.preventDefault()
      swal({
        onOpen: () => {
          swal.showLoading()
        },
        title: 'Sign up in progress.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      })

      $axios.$post('/register', state).then((result) => {
        if (result.state) {
          swal({
            type: 'success',
            title: 'Sign up completed. Please sign in.',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => router.push('/'))
        } else {
          swal({
            type: 'error',
            title: result.msg,
            showConfirmButton: false,
            timer: 4000,
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
