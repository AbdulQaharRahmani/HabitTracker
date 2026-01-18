import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Dropdown from './Dropdown';
const months = [
  { name: "Jan", completed: 70 },
  { name: "Feb", completed: 20 },
  { name: "Mar", completed: 30 },
  { name: "Apr", completed: 40 },
  { name: "May", completed: 40 },
  { name: "Jun", completed: 10 },
  { name: "Jul", completed: 20 },
  { name: "Aug", completed: 22 },
  { name: "Sep", completed: 50 },
  { name: "Oct", completed: 12 },
  { name: "Nov", completed: 15 },
  { name: "Dec", completed: 20 },
]
const days = [
  { name: "Sat", completed: 2 },
  { name: "Sun", completed: 5 },
  { name: "Mon", completed: 2 },
  { name: "Tue", completed: 1 },
  { name: "Wed", completed: 3 },
  { name: "Thu", completed: 4 },
  { name: "Fri", completed: 2 },

]
const years = [
  { name: "2024", completed: 1500 },
  { name: "2023", completed: 1000 },
  { name: "2025", completed: 900 },
  { name: "2026", completed: 20 },
]
const filterTerms = [
  { id: "1", name: "Days", value: "days" },
  { id: "2", name: "Months", value: "months" },
  { id: "3", name: "Years", value: "years" },
];
const dataMap = {
  days: days,
  months: months,
  years: years
};
export default function StatisticsChart() {
  const [chartData, setChartData] = useState(months)
  const [activeFilter, setActiveFilter] = useState('months')
  const [title, setTitle] = useState("Activity by Month")
  return (
    <>
      <div className='w-full flex md:justify-between gap-2 justify-center items-center flex-row flex-start p-6 pt-10 flex-wrap'>
        <h2 className='capitalize text-[1.5rem] font-bold'>{title}</h2>

        <div className='w-[200px] '>
          <Dropdown items={filterTerms} value={activeFilter} getValue={(selected) => {
            setActiveFilter(selected)
            setChartData(dataMap[selected])
            setTitle(`Activity by ${selected}`)
          }}></Dropdown>
        </div>

      </div>

      <div className="w-full h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%" className="bg-white p-6 border rounded-[1.5rem]">

          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#E5E7EB" />
            <defs>

              <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2} />
              </linearGradient>

            </defs>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis hide={true} />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="completed"
              stroke="#6366F1"
              fill="url(#fillGradient)"
              strokeWidth={4}

            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
