import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get(`localhost:4000/api/projects/`)
      .then(res => {
        setProjects(projects);
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <div className="App">
      {projects.map(project => (
        <div>{project}</div>
      ))}
    </div>
  );
}

export default App;
