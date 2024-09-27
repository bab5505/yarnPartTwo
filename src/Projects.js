import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://yarnparttwo.onrender.com';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [input, setInput] = useState({
    name: '',
    description: '',
    hook_size: '',
    needle_size: '',
    yarn_type: '',
    color: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/projects`)
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value || ''  // Ensure the input is never undefined
    });
  };

  const handleAddProject = () => {
    if (isEditing && editId) {
      // Update project
      axios.put(`${API_BASE_URL}/projects/${editId}`, input)
        .then(() => {
          setProjects(projects.map(project => project.id === editId ? { ...project, ...input } : project));
          setIsEditing(false);
          setEditId(null);
          setInput({
            name: '',
            description: '',
            hook_size: '',
            needle_size: '',
            yarn_type: '',
            color: ''
          });
        })
        .catch(error => console.error('Error:', error));
    } else {
      // Add new project
      axios.post(`${API_BASE_URL}/projects`, input)
        .then(response => {
          setProjects([...projects, response.data]);
          setInput({
            name: '',
            description: '',
            hook_size: '',
            needle_size: '',
            yarn_type: '',
            color: ''
          });
        })
        .catch(error => console.error('Error:', error));
    }
  };

  const handleEditProject = (project) => {
    setInput({
      name: project.name || '',
      description: project.description || '',
      hook_size: project.hook_size || '',
      needle_size: project.needle_size || '',
      yarn_type: project.yarn_type || '',
      color: project.color || ''
    });
    setIsEditing(true);
    setEditId(project.id);
  };

  const handleDeleteProject = (id) => {
    axios.delete(`${API_BASE_URL}/projects/${id}`)
      .then(() => {
        setProjects(projects.filter(project => project.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <h2>Projects</h2>
      <input
        type="text"
        name="name"
        value={input.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="text"
        name="description"
        value={input.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="text"
        name="hook_size"
        value={input.hook_size}
        onChange={handleChange}
        placeholder="Hook Size"
      />
      <input
        type="text"
        name="needle_size"
        value={input.needle_size}
        onChange={handleChange}
        placeholder="Needle Size"
      />
      <input
        type="text"
        name="yarn_type"
        value={input.yarn_type}
        onChange={handleChange}
        placeholder="Yarn Type"
      />
      <input
        type="text"
        name="color"
        value={input.color}
        onChange={handleChange}
        placeholder="Color"
      />
      <button onClick={handleAddProject}>
        {isEditing ? 'Update Project' : 'Add Project'}
      </button>
      <ul>
        {projects.map((project, index) => (
          <li key={project.id || index}>
            <div>
              <strong>{project.name}</strong> - {project.description}
              <button onClick={() => handleEditProject(project)}>Edit</button>
              <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
