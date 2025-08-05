import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/home/home";
import { ProjectsPage } from "./pages/projects/projects";
import { TheaterPage } from "./pages/theater/theater";
import { CalendarPage } from "./pages/calendar/calendar";
import { InfoPage } from "./pages/info/info";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/projects" element={<ProjectsPage />}></Route>
        <Route path="/theater" element={<TheaterPage />}></Route>
        <Route path="/calendar" element={<CalendarPage />}></Route>
        <Route path="/info" element={<InfoPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
