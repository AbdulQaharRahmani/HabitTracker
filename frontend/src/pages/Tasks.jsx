import Header from '../components/Header'
import AddTask from '../components/AddTask'
import TaskCard from '../components/TaskCard';
import { useTaskCardStore } from "../store/useTaskCardStore";


function Tasks () {
  const tasks = useTaskCardStore((state) => state.tasks);
  
  return (
    <div className="md:px-2 bg-gray-50 grid grid-cols gap-4">
      <div className="flex flex-rows justify-between my-2">
        <Header
          title={"Tasks"}
          subtitle={"Manage your daily goals and todos."}
        ></Header>
        <span className="mt-10 mr-8">
          <AddTask></AddTask>
        </span>
      </div>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
}

export default Tasks