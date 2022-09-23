<template>
  <div class="container">
    <HeadTitle />
    <div class="card px-8 py-5 rounded-2xl m-5 w-auto md:w-1/2">
      <div class="flex align-center">
        <p class="text-5xl font-bold text-blue-500">{{ day }}</p>
        <div class="ml-1 font-medium">
          <p>{{ month }}</p>
          <p>{{ year }}</p>
        </div>
        <p class="ml-auto font-medium text-xl">{{ dayOfWeek.toUpperCase() }}</p>
      </div>

      <div class="flex align-center">
        <input
          v-model="newTask"
          type="text"
          class="control my-5"
          placeholder="Add new task..."
        />
        <button class="btn button px-4 py-1 ml-2" @click="handleAddTask">
          <font-awesome-icon :icon="['fas', 'plus']" class="mx-1" />
        </button>
      </div>

      <div>
        <ul
          id="tabs"
          class="flex flex-wrap justify-center align-center -mb-px text-sm font-medium text-center"
          role="tablist"
        >
          <li v-for="list in tabList" :key="list" class="w-1/3">
            <button
              :id="list + '-tab'"
              class="pb-4 font-bold hover:opacity-100 hover:text-blue-400"
              :class="{
                'opacity-30': openTab != list,
                'opacity-100': openTab == list,
              }"
              :aria-controls="list"
              @click="toggleTab(list)"
            >
              {{ list }}
            </button>
          </li>
        </ul>
      </div>

      <div class="card-body">
        <TableTodo :datalist="dataList" />
      </div>

      <div class="text-left">
        <button class="btn btn-out mt-5 text-blue-500" @click="onSignOut">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-1" />
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  useRouter,
  useStore,
  onMounted,
  computed,
  watch,
} from '@nuxtjs/composition-api'
import swal from 'sweetalert2'
import HeadTitle from '~/components/HeadTitle.vue'
import TableTodo from '~/components/TableTodo.vue'

export default defineComponent({
  name: 'TodoPage',
  components: { HeadTitle, TableTodo },
  setup() {
    const router = useRouter()
    const store = useStore()

    const dateNow = new Date()
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const tabList = ['All Task', 'Inprocess', 'Done']
    const openTab = ref('All Task')
    const dateFormat = reactive({
      day: dateNow.getDate(),
      month: dateNow.toDateString().slice(4, 8),
      year: dateNow.getFullYear(),
      dayOfWeek: weekday[dateNow.getDay()],
    })
    const newTask = ref('')
    const storeList = computed(() => store.state.list)
    const dataList = ref(storeList.value)

    onMounted(async () => {
      const token = localStorage.getItem('token')
      await store.dispatch('getData', { token })
    })
    watch(storeList, () => {
      dataList.value = storeList.value
    })

    const toggleTab = (tab) => {
      openTab.value = tab
      if (tab !== 'All Task') {
        dataList.value = storeList.value.filter(
          (task) => task.status === tab.toLowerCase()
        )
      } else {
        dataList.value = storeList.value
      }
    }

    const onSignOut = () => {
      swal({
        type: 'warning',
        title: 'Do you want to sign out?',
        showCancelButton: true,
        confirmButtonColor: '#90B77D',
        cancelButtonColor: '#AC4425',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          localStorage.clear()
          store.commit('clear')
          router.push('/')
        }
      })
    }

    const handleAddTask = async () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      await store.dispatch('addTask', { token, userId, newTask })
    }

    return {
      ...toRefs(dateFormat),
      tabList,
      openTab,
      toggleTab,
      onSignOut,
      newTask,
      handleAddTask,
      dataList,
    }
  },
})
</script>

<style scoped>
.card-body {
  height: 50vh;
  overflow: auto;
}

.btn-out {
  background-color: transparent;
  font-weight: bold;
}

.btn-out:hover {
  background-color: #eee;
}

.btn-out:active {
  background-color: #ddd;
}
</style>
