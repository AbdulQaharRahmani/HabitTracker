import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import "./index.css";
import Habits from "./pages/Habits";
import Tasks from "./pages/Tasks";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Today from "./pages/Today";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LanguageSwitcher from "./components/internationalization";
import DarkMode from "./components/DarkMode";
import { Toaster } from "react-hot-toast";
import "./styles/toast.css";
import ProtectedRoute from "./components/ProtectedRoute";
import LogsLayout from "./logs dashboard/components/LogsLayout";
import Logs from "./logs dashboard/pages/Logs"

function App() {
  return (
    <>
      <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={20}
      containerClassName="toast-container"
      toastOptions={{
        duration: 5000,
        className: "toast-base",
        success: {
          className: "toast-success",
        },
        error: {
          className: "toast-error",
        },
        loading: {
          className: "toast-loading",
        },
      }}
    />
    <Router>
      <LanguageSwitcher />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
        <Route
          element={
            <Sidebar>
              <Outlet />
            </Sidebar>
          }
        >
          <Route path="/" element={<Today />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        </Route>
        <Route path="*" element={<>not found</>} />
        <Route path="/logs-dashboard" element={<LogsLayout />}>
           <Route path="logs" element= {<Logs />}></Route>
        </Route>
      </Routes>
    </Router>
          </>
  );
}

export default App;
