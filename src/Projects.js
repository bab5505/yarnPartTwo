import React, { useState } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    hookSize: '',
    needleSize: '',
    yarnType: '',
    color: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value
    });
  };

  const handleAddOrUpdateProject = () => {
    if (isEditing) {
      // Update the project
      const updatedProjects = [...projects];
      updatedProjects[editIndex] = newProject;
      setProjects(updatedProjects);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Add new project
      setProjects([...projects, newProject]);
    }
    setNewProject({
      name: '',
      description: '',
      hookSize: '',
      needleSize: '',
      yarnType: '',
      color: ''
    });
  };

  const handleEditProject = (index) => {
    setNewProject(projects[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Projects</h2>
      <div>
        <input
          type="text"
          name="name"
          value={newProject.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="description"
          value={newProject.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="hookSize"
          value={newProject.hookSize}
          onChange={handleInputChange}
          placeholder="Hook Size"
        />
        <input
          type="text"
          name="needleSize"
          value={newProject.needleSize}
          onChange={handleInputChange}
          placeholder="Needle Size"
        />
        <input
          type="text"
          name="yarnType"
          value={newProject.yarnType}
          onChange={handleInputChange}
          placeholder="Yarn Type"
        />
        <input
          type="text"
          name="color"
          value={newProject.color}
          onChange={handleInputChange}
          placeholder="Color"
        />
        <button onClick={handleAddOrUpdateProject}>
          {isEditing ? 'Update Project' : 'Add Project'}
        </button>
      </div>
      <ul className="inventory-list">
        {projects.map((project, index) => (
          <li key={index} className="inventory-item">
            <div>
              <strong>Name:</strong> {project.name}
              <br />
              <strong>Description:</strong> {project.description}
              <br />
              <strong>Hook Size:</strong> {project.hookSize}
              <br />
              <strong>Needle Size:</strong> {project.needleSize}
              <br />
              <strong>Yarn Type:</strong> {project.yarnType}
              <br />
              <strong>Color:</strong> {project.color}
              <div>
                <button onClick={() => handleEditProject(index)}>Edit</button>
                <button onClick={() => handleDeleteProject(index)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
