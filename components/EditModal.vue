<template>
  <div class="modal-overlay">
    <div class="modal px-5 py-3 w-screen md:w-1/3">
      <div class="flex justify-between align-center">
        <p class="text-xl font-bold">Edit Task</p>
        <button class="btn btn-out" @click="$emit('close-modal')">
          <font-awesome-icon :icon="['fas', 'xmark']" class="mx-1" />
        </button>
      </div>

      <div class="mt-5 text-right">
        <input v-model="edits" type="text" class="control mb-5" />
        <button
          class="btn bg-green-500 font-bold hover:bg-green-600"
          @click="handleEdit"
        >
          Save
        </button>
        <button
          class="btn bg-red-500 text-white font-bold hover:bg-red-900"
          @click="$emit('close-modal')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  ref,
  useStore,
} from '@nuxtjs/composition-api'
import swal from 'sweetalert2'
export default defineComponent({
  props: {
    edit: {
      type: String,
      default: '',
    },
    idtask: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const valueEdit = ref('')
    const edits = computed({
      get: () => props.edit,
      set: (val) => {
        valueEdit.value = val
      },
    })
    const id = computed(() => props.idtask)

    const handleEdit = async () => {
      const token = localStorage.getItem('token')
      const res = await store.dispatch('editTask', {
        token,
        task: valueEdit.value,
        id: id.value,
      })
      if (res) {
        emit('close-modal')
        swal({
          type: 'success',
          title: 'Edit task success',
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }

    return {
      edits,
      valueEdit,
      handleEdit,
    }
  },
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  background-color: white;
  height: 180px;
  margin-top: 25%;
  border-radius: 10px;
  z-index: 10;
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
