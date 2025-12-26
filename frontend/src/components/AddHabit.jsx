import HabitCard from "./HabitCard";
import { useState } from "react";
import { FaPlus } from 'react-icons/fa';



export default function AddHabit () {
    const [showForm, setShowForm] = useState(false)
    const [duration , setDuration] = useState('')
    const [frequency, setFrequency] = useState('');
    const [customDays, setCustomDays] = useState('');


    return (
        <div className="">
            <button className="bg-primary rounded-md px-4 py-2 text-white flex flex-center shadow-md transition ease-in-out duration-200 text-md" 
                    type="button" 
                    onClick={() => {setShowForm(true)}}
            >
                <span className="mx-2 mt-1 font-light">
                    <FaPlus size={13} />
                </span>
                <span className="">
                    New Habit
                </span>
            </button>
            {
                showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                        <form className="bg-primary-hover p-6 rounded-xl shadow-xl w-full max-w-md grid gap-4 relative"
                            onSubmit={(e) => {
                            e.preventDefault();
                            setShowForm(false);
                        }}>
                            <button
                                type="button"
                                className="absolute top-2 right-2 text-gray"
                                onClick={() => setShowForm(false)}
                            >
                                <span className="text-2xl ">×</span>
                            </button>
                            <span className="grid grid-rows-1">
                                <label htmlFor="title" className="text-primary">Title</label>
                                <input type="text" id="title" className="text-gray p-1 rounded-md shadow-sm"/>
                            </span>
                            

                            <span className="grid grid-rows-1">
                                <label htmlFor="description" className="text-red">Description</label>
                                <input type="text" id="description" className="rounded-md p-1 shadow-sm text-gray"/>
                            </span>


                            <span className="grid grid-row-1 gap-1">
                                <label htmlFor="category" className="text-orange">Category</label>
                                <select name="category" id="category" className="text-gray bg-orange-hover p-1 rounded-md shadow-sm">
                                    <option value="">Select a category</option>
                                    <option value="Health">Health</option>
                                    <option value="Learning">Learning</option>
                                    <option value="Creativity">Creativity</option>
                                    <option value="Productivity">Productivity</option>
                                    <option value="Fitness">Fitness</option>
                                </select>
                            </span>
                            

                            <span className="grid grid-row-1">
                                <label htmlFor="frequency" className="text-light-green">Frequency</label>
                                <select className="text-gray bg-light-green-hover p-1 rounded-md shadow-sm" name="frequency" id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                                    <option value="">Select a category</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                    <option value="Afternoon">Afternoon</option>
                                    <option value="CustomDays">Custom Days</option>
                                </select>
                            </span>
                            

                            {
                                frequency === 'CustomDays' && (
                                    <input 
                                        type='text' 
                                        value={customDays} 
                                        placeholder="Enter your custome days"
                                        onChange={(e) => setCustomDays(e.target.value)}
                                        className="mt-2 block border p-1 rounded text-light-green"
                                    ></input>
                                )
                            }

                            <span className="grid grid-rows-1">
                                <label htmlFor="duration" className="text-purple">Duration</label>
                                <input
                                    className="text-gray p-1 rounded-md shadow-sm"
                                    type="number"
                                    min="5"
                                    step="5"
                                    placeholder="Duration in minutes"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </span>

                            <span>
                                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md transition ease-in-out duration-200 mx-auto my-3 block" >
                                    Add Habit
                                </button>
                            </span>
                        </form>
                    </div>
                    
                )
            }
        </div>
    )
}