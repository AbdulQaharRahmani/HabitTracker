import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import './index.css'
import Habits from "./pages/Habits";
import Tasks from "./pages/Tasks";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Today from "./pages/Today";
import Login from './pages/Login';
import Signup from "./pages/Signup";
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login />} />
          <Route element={
              <Sidebar>
                <Outlet />
              </Sidebar>
          }>

            <Route path="/" element={<Today />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<>not found</>} />
        </Routes>
    </Router>
  );
}

export default App;