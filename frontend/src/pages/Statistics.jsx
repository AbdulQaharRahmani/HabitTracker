import React from 'react'
import DayilyConsistency from '../components/DailyConsistency'
import Header from '../components/Header'
import { MdDownload } from "react-icons/md";
import ExportData from '../components/ExportData';


function Statistics() {
  return (
    <div className=''>
      <div className="grid grid-cols-2 justify-between my-2 items-center mr-9">
        <Header
          title={"Your Progress"}
          subtitle={"Overview of your consistency and growth."}
        />
        <span className='pt-6 ml-auto'>
          <ExportData />
        </span>
      </div>

      <DayilyConsistency />
    </div>
  );
}

export default Statistics
