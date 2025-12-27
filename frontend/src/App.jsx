import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css'
import Habits from "./pages/Habits";
import Tasks from "./pages/Tasks";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Today from "./pages/Today";
function App() {
  return (
    <Router>
      <div>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/habits" element={<Habits/>} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<>not found</>} />
        </Routes>
      </Sidebar>
      </div>
    </Router>
  );
}

export default App;

