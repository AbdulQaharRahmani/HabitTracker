import React from 'react'
import CircularProgress from '../components/habits/CircularProgress'
function Today() {
  return (
      <div className="px-4 sm:px-6 md:px-10">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
        Today
      </h1>

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        place-items-center
        gap-6
        sm:gap-8
        md:gap-10
      ">
        <CircularProgress percent={50} />
      </div>
  </div>

  )
}

export default Today
