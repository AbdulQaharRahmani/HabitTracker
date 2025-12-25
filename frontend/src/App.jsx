import Header from './components/Header.jsx';
import DarkMode from './components/DarkMode.jsx';
import Search from './components/Search.jsx';

function App() {
  return (
  <div className="grid grid-cols-[240px_1fr] min-h-screen">
    {/* Sidebar */}
    <div className="px-[9rem] sidebar-bg">
      Sidebar goes here
    </div>

    {/* Main content */}
    <div className="px-6">
      <div className="flex items-center justify-between">
        <Header />
        <DarkMode/>
      </div>

      <hr className="my-4 ml-12 mr-4 mx-auto border-gray-200" />

      <div className='ml-12 my-6'>
        <Search />      
      </div>

    </div>
  </div>
  )
}

export default App;