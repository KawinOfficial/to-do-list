<template>
  <div class="container">
    <HeadTitle />
    <div class="card px-8 py-5 rounded-2xl m-5 w-auto md:w-max">
      <div class="flex align-center">
        <p class="text-5xl font-bold text-blue-500">{{ day }}</p>
        <div class="ml-1 font-medium">
          <p>{{ month }}</p>
          <p>{{ year }}</p>
        </div>
        <p class="ml-auto font-medium text-xl">{{ dayOfWeek }}</p>
      </div>

      <div class="flex align-center">
        <input type="text" class="control my-5" />
        <button class="btn button px-4 py-1 ml-2">ADD</button>
      </div>

      <div class="card-body">
        <TableTodo />
      </div>
    </div>
  </div>
</template>

<script>
import HeadTitle from '~/components/HeadTitle.vue'
import TableTodo from '~/components/TableTodo.vue'
export default {
  name: 'TodoPage',
  components: { HeadTitle, TableTodo },
  data() {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    return {
      day: new Date().getDate(),
      month: new Date().toDateString().slice(4, 8),
      year: new Date().getFullYear(),
      dayOfWeek: weekday[new Date().getDay()],
    }
  },
}
</script>

<style scoped>
.card-body {
  height: 50vh;
  overflow: auto;
}
</style>
