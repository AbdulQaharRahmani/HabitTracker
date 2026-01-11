import { create } from 'zustand'

export const useTaskCardStore = create((set) => ({
  tasks: [],

  toggleTaskDone : (id) => {
    set((state) => {
        tasks : state.tasks.map((task) => {
            task.id == id ? 
            { ...task, done: !task.done } :
            task
        })
    })
  }
}));

