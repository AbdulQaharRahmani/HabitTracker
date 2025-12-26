import Header from './components/Header.jsx';
import DarkMode from './components/DarkMode.jsx';
import Search from './components/Search.jsx';
import HabitCard from './components/HabitCard.jsx';
import AddHabit from './components/AddHabit.jsx';

function App() {
  return (
    <div className="grid grid-cols-[240px_1fr] min-h-screen">
      
      {/* Sidebar */}
      <div className="px-6 sidebar-bg">
        Sidebar goes here
      </div>

      {/* Main */}
      <div className="px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Header />
          <DarkMode />
        </div>
        <hr className="my-4 ml-12 mr-4 border-gray-200" />

        {/* Search , View, AddHabit*/}
        <div className="ml-12 my-6 grid grid-cols-2 ">
          <Search />
          <AddHabit />
        </div>

        {/* Habit list of Cards*/}
        <div className="ml-12 mt-6 space-y-4">
          <HabitCard
            title="Morning"
            description="Morning sport"
            category="Health"
            time="Daily"
            duration="30m"
          />
        </div>

      </div>
    </div>
  );
}

export default App;
