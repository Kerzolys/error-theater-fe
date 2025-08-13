import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/home/home";
import { ProjectsPage } from "./pages/projects/projects";
import { TheaterPage } from "./pages/theater/theater";
import { CalendarPage } from "./pages/calendar/calendar";
import { ProjectPage } from "./modules/project-page/project-page";
import { AdminPage } from "./pages/admin/admin";
import { AdminProjects } from "./pages/admin/admin-projects/admin-projects";
import { useProjects } from "./services/zustand/store";
import { useEffect } from "react";

function App() {
  const { projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, []);

  
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:name" element={<ProjectPage />} />
        <Route path="/theater" element={<TheaterPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
      </Routes>
    </>
  );
}

export default App;
