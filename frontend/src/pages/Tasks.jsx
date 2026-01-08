import React from 'react'
import Header from '../components/Header'
import AddTask from '../components/AddTask'
import TaskCard from '../components/TaskCard';

function Tasks () {
  return (
    <div className="md:px-2 lg:ml-4 bg-gray-50 grid grid-cols gap-4">
      <div className="flex flex-rows justify-between my-2">
        <Header
          title={"Tasks"}
          subtitle={"Manage your daily goals and todos."}
        ></Header>
        <span className="mt-10 mr-8">
          <AddTask></AddTask>
        </span>
      </div>
      <div className='grid gap-4'>
        <TaskCard
          title={"Complete project proposal"}
          deadline={"Yesterday"}
          category={"Work"}
        />
        <TaskCard
          title={"Buy groceries for the week"}
          deadline={"Today"}
          category={"Personal"}
        />
        <TaskCard
          title={"Schedule dentist appoinment"}
          deadline={"Tomorrow"}
          category={"Health"}
        />
        <TaskCard
          title={"Call Mom"}
          deadline={"No date"}
          category={"Family"}
        />
      </div>
    </div>
  );
}

export default Tasks