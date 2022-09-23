export const state = () => ({
  list: [],
  token: '',
})

export const mutations = {
  add(state, todo) {
    state.list = todo.filter((task) => task.status !== 'delete')
  },
  addNew(state, todo) {
    state.list.push(todo)
  },
  remove(state, { id }) {
    state.list.splice(
      state.list.findIndex((task) => task.id === id),
      1
    )
  },
  editTask(state, { task, id }) {
    state.list.find((task) => task.id === id).task = task
  },
  toggle(state, { id, statusChk }) {
    state.list.find((task) => task.id === id).status = statusChk
  },
  clear(state) {
    state.list = []
  },
  setToken(state, token) {
    state.token = token
  },
}

const endPoint = 'https://kawin-to-do-list.hasura.app/v1/graphql'
export const actions = {
  getData({ commit }, { token }) {
    this.$axios
      .$post(
        endPoint,
        {
          query: `query getData {
              todo_list {
                id
                status
                task
              }
            }`,
          variables: {},
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      )
      .then(({ data }) => {
        commit('add', data.todo_list)
      })
  },
  async addTask({ commit }, { token, userId, newTask }) {
    const res = await this.$axios
      .$post(
        endPoint,
        {
          query: `mutation ($status: String!, $task: String! , $user_id: uuid! ) {
                    insert_todo_list(objects: {
                      status: $status,
                      task: $task,
                      user_id: $user_id
                    })
                    { returning {id}}
                  }`,
          variables: {
            status: 'inprocess',
            task: newTask.value,
            user_id: userId,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      )
      .then(
        ({
          data: {
            insert_todo_list: { returning },
          },
        }) => {
          commit('addNew', {
            id: returning[0].id,
            status: 'inprocess',
            task: newTask,
          })
        }
      )

    return res
  },
  async doneTask({ commit }, { token, statusChk, id }) {
    const res = await this.$axios.$post(
      endPoint,
      {
        query: `mutation MyMutation($id: uuid!, $status: String!) {
                    update_todo_list(where: {id: {_eq: $id}}, _set: {status: $status}) {
                      affected_rows
                    }
                  }`,
        variables: {
          id,
          status: statusChk,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    )

    commit('toggle', { id, statusChk })

    return res
  },
  async deleteTask({ commit }, { token, list }) {
    const res = await this.$axios.$post(
      endPoint,
      {
        query: `mutation MyMutation($id: uuid, $status: String!) {
                           update_todo_list(where: {id: {_eq: $id}}, _set: {status: $status}){
                      affected_rows
                    }
                        }`,
        variables: {
          id: list.id,
          status: 'delete',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    )

    commit('remove', { id: list.id })
    return res
  },
  async editTask({ commit }, { token, id, task }) {
    const res = await this.$axios.$post(
      endPoint,
      {
        query: `mutation MyMutation($id: uuid , $task: String) {
                  update_todo_list(where: {id: {_eq: $id}}, _set: {task: $task}) {
                    affected_rows
                  }
                }`,
        variables: {
          id,
          task,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    )
    commit('editTask', { id, task })

    return res
  },
}
