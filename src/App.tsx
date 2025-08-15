import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/home/home";
import { ProjectsPage } from "./pages/projects/projects";
import { TheaterPage } from "./pages/theater/theater";
import { CalendarPage } from "./pages/calendar/calendar";
import { ProjectPage } from "./modules/project-page/project-page";
import { AdminPage } from "./pages/admin/admin";
import { AdminProjects } from "./pages/admin/admin-projects/admin-projects";
import { useEvents, useMembers, useProjects } from "./services/zustand/store";
import { useEffect } from "react";
import { AdminTeam } from "./pages/admin/admin-team/admin-team";

function App() {
  const { fetchProjects } = useProjects();
  const { fetchMembers } = useMembers();
  const { fetchEvents } = useEvents();


  useEffect(() => {
    fetchProjects();
  }, []);
  
  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchEvents();
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
        <Route path="/admin/team_members" element={<AdminTeam />} />
      </Routes>
    </>
  );
}

export default App;
