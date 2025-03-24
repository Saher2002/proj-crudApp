import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import './App.css';

function App({ apiUrl = "http://localhost:5000/api/projects" }) {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState("");
  const [projectCount, setProjectCount] = useState(0);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(apiUrl);
      setProjects(res.data.projects);
      const countRes = await axios.get(`${apiUrl}/count`);
      setProjectCount(countRes.data.count);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmit = async () => {
    try {
      if (editingProject) {
        await axios.put(`${apiUrl}/${editingProject.id}`, { name: projectName });
      } else {
        await axios.post(apiUrl, { name: projectName });
      }
      setProjectName("");
      setEditingProject(null);
      setError("");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container">
      <h1>CRUD OPERATION APP</h1>
      <h2>Total Projects: {projectCount}</h2>

      <div className="input_handle">
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button onClick={handleSubmit}>{editingProject ? "Update" : "Add"} Project</button>
      </div>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Refresh */}
      <button onClick={fetchProjects}>Refresh Projects</button>

      {/* Project List */}
      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.id} className="project-item">
            <span className="project-name">{project.name}</span>
            <div className="project-buttons">
              <button onClick={() => handleEdit(project)}>Edit</button>
              <button onClick={() => handleDelete(project.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
