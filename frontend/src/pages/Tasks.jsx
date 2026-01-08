import React from 'react'
import Header from '../components/Header'
import AddTask from '../components/AddTask'

function Tasks () {
  return (
    <div className="md:px-2 lg:ml-4 bg-gray-50">
      <div className="flex flex-rows justify-between">
        <Header
          title={"Tasks"}
          subtitle={"Manage your daily goals and todos."}
        ></Header>
        <span className='mt-10'>
          <AddTask></AddTask>
        </span>
      </div>
    </div>
  );
}

export default Tasks