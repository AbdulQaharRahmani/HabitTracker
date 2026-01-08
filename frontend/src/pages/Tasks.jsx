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
        <span className='mt-10 mr-8'>
          <AddTask></AddTask>
        </span>
      </div>
      <div className=''>
        <TaskCard 
          title={"Complete project proposal"}
          deadline={"Yesterday"}
          category={"HEALTH"}  
        />
      </div>
    </div>
  );
}

export default Tasks