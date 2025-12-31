import { useState } from "react";
import { GrAdd } from "react-icons/gr";

export default function AddHabit () {
    const [showForm, setShowForm] = useState(false)

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [duration , setDuration] = useState('')
    const [frequency, setFrequency] = useState('');
    const [customDays, setCustomDays] = useState('');

    return (
        <div className="">
            <button className="bg-indigo-500 hover:bg-indigo-600  rounded-md px-4 py-2 text-white flex items-center justify-center shadow-md text-md transition ease-in-out duration-200" 
                    type="button" 
                    onClick={() => {setShowForm(true)}}
            >
                <span className="mx-2  font-normal">
                    <GrAdd size={14}/>
                </span>
                <span className="">
                    New Habit
                </span>
            </button>
            {
                showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 rounded-xl">
                        <div className="relative bg-gray-50 flex flex-col rounded-xl shadow-xl w-full max-w-md h-[80vh]">
                            <span className="px-6 py-6 border-b border-gray-200">
                                <h3 className="text-gray-800 text-lg font-bold">Add New Habit</h3>
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-gray"
                                    onClick={() => setShowForm(false)}
                                >
                                    <p className="text-3xl px-3 mt-2 text-gray-400 hover:text-gray-600 transition in-out duration-150">×</p>
                                </button>
                            </span>
                                                        
                            <div className="flex-1 bg-white w-full overflow-y-auto px-6 pb-6 rounded-xl">
                                <form className="w-full h-full flex flex-col gap-4 mt-4"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setShowForm(false)
                                    }}
                                >
                                    <span className="grid grid-rows-1">
                                        <label 
                                            htmlFor="title" 
                                            className="text-gray-600"
                                        >
                                            Title
                                        </label>
                                        <input 
                                            type="text" 
                                            id="title" 
                                            value={title} onChange={(e) => setTitle(e.target.value)} 
                                            className="text-gray p-2 rounded-md shadow-sm bg-gray-50  border border-gray-200" 
                                            placeholder="Enter habit title..."/>
                                    </span>

                                    <span className="grid grid-rows-1">
                                        <label 
                                            htmlFor="description" 
                                            className="text-gray-600"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            className="w-[100%] h-24 p-2 rounded-md shadow-sm text-gray bg-gray-50  border border-gray-200"
                                            placeholder="Description..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </span>

                                    <span className="grid grid-row-1">
                                        <label htmlFor="frequency" className="text-gray-600">Frequency</label>
                                        <select 
                                            className="text-gray bg-gray-50 p-2 rounded-md shadow-sm border border-gray-200" name="frequency" id="frequency" 
                                            value={frequency} onChange={(e) => setFrequency(e.target.value)}
                                        >
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
                                                className="mt-2 block border p-2 bg-gray-50 shadow-sm rounded text-gray"
                                            ></input>
                                        )
                                    }

                                    <span className="grid grid-row-1 gap-1">
                                        <label htmlFor="category" className="text-gray-600">
                                            Category
                                        </label>
                                        <select 
                                            name="category" id="category" className="text-gray p-2 rounded-md shadow-sm bg-gray-50  border border-gray-200"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option value="">Select a category</option>
                                            <option value="Health">Health</option>
                                            <option value="Learning">Learning</option>
                                            <option value="Creativity">Creativity</option>
                                            <option value="Productivity">Productivity</option>
                                            <option value="Fitness">Fitness</option>
                                        </select>
                                    </span>

                                    <span className="grid grid-rows-1">
                                        <label htmlFor="duration" className="text-gray-600">Duration</label>
                                        <input
                                            className="text-gray p-2 rounded-md shadow-sm bg-gray-50  border border-gray-200"
                                            type="number"
                                            min="5"
                                            step="5"
                                            placeholder="Duration in minutes"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                        />
                                    </span>
                                    <span className="border-t border-gray-200 p-6">
                                        <button
                                            type="submit"
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md mx-auto block w-full transition ease-in-out duration-200"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="my-3 bg-white hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-md mx-auto block w-full transition ease-in-out duration-200 border border-gray-300"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </span>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}