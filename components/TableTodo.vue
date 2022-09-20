<template>
  <div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 20" :key="n">
          <td class="w-80">
            <div class="text-left flex align-center">
              <input :id="'check' + n" type="checkbox" name="status" />
              <span class="checkmark"></span>
              <label :for="'check' + n" class="ml-2"> XXXXXXXXXX</label>
            </div>
          </td>
          <td class="flex justify-between">
            <button class="btn btn-warning mr-3">edit</button>
            <button class="btn btn-danger">del.</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script></script>

<style scoped>
.btn-warning {
  background-color: #fde68a;
}

.btn-warning:hover {
  background-color: #fbbf24;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}
.btn-danger:hover {
  background-color: #991b1b;
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
