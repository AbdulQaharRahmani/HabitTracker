import React from 'react'
import CircularProgress from '../components/CircularProgress'
function Today() {
  return (
      <div className="px-10">
        <h1>Today</h1>
        <div className="grid grid-cols-3 justify-center items-center gap-10">
        <CircularProgress percent={75}/>
        <CircularProgress percent={50}/>
        <CircularProgress percent={20}/>
        <CircularProgress />
        </div>
      </div>
  )
}

export default Today
