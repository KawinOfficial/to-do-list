<template>
  <div>
    <table class="w-full">
      <tbody>
        <tr v-for="(item, index) in listData" :key="index">
          <td class="w-10/12">
            <div class="text-left flex align-center">
              <input
                :id="'check' + index"
                type="checkbox"
                name="status"
                :checked="item.status == 'done'"
                @click="(e) => handleCheck(e, item.id)"
              />
              <span class="checkmark"></span>
              <label
                :for="'check' + index"
                class="ml-2"
                :class="{ 'opacity-30': item.status == 'done' }"
                >{{ item.task }}</label
              >
            </div>
          </td>
          <td>
            <div v-if="item.status == 'inprocess'" class="flex justify-between">
              <button class="btn btn-bg mr-1" @click="handleModal(item)">
                <font-awesome-icon
                  :icon="['fas', 'pen']"
                  class="mx-1 text-yellow-300"
                />
              </button>
              <button class="btn btn-bg" @click="handleDelete(item, index)">
                <font-awesome-icon
                  :icon="['fas', 'delete-left']"
                  class="mx-1 text-red-500"
                />
              </button>
            </div>
            <div v-else>
              <button class="btn mr-1 cursor-default" disabled>
                <font-awesome-icon
                  :icon="['fas', 'check']"
                  class="mx-1 text-green-500"
                />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <EditModal
      v-show="showModal"
      :idtask="idtask"
      :edit="state"
      @close-modal="showModal = false"
    />
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  useStore,
  computed,
} from '@nuxtjs/composition-api'
import swal from 'sweetalert2'
import EditModal from './EditModal.vue'

export default defineComponent({
  components: { EditModal },
  props: {
    datalist: {
      type: Array,
      default() {
        return []
      },
    },
  },
  setup(props) {
    const store = useStore()
    const showModal = ref(false)
    const state = ref('')
    const idtask = ref('')
    const listData = computed(() => props.datalist)

    const handleModal = (list) => {
      state.value = list.task
      idtask.value = list.id
      showModal.value = true
    }

    const handleDelete = (list) => {
      swal({
        type: 'warning',
        title: 'Do you want to delete this task?',
        text: list.task,
        showCancelButton: true,
        confirmButtonColor: '#90B77D',
        cancelButtonColor: '#AC4425',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          const token = localStorage.getItem('token')
          store.dispatch('deleteTask', { token, list })

          swal({
            type: 'success',
            title: 'Task delete',
            showConfirmButton: false,
            timer: 2500,
          })
        }
      })
    }

    const handleCheck = ({ target: { checked } }, id) => {
      let statusChk = 'inprocess'
      if (checked) {
        statusChk = 'done'
      }

      const token = localStorage.getItem('token')
      store.dispatch('doneTask', { token, statusChk, id })
    }

    return {
      showModal,
      listData,
      handleDelete,
      handleCheck,
      handleModal,
      state,
      idtask,
    }
  },
})
</script>

<style scoped>
.btn-bg {
  background-color: transparent;
}

.btn-bg:hover {
  background-color: #eee;
}
.btn-bg:active {
  background-color: #ddd;
}

input[type='checkbox'] {
  appearance: none;
  -webkit-appearance: none;
  height: 1rem;
  width: 1rem;
  border: 2px solid red;
  border-radius: 50%;
}

input[type='checkbox']:hover {
  border-color: #991b1b;
  transform: scale(1.1);
}

input[type='checkbox']:checked {
  border-color: greenyellow;
}
</style>
