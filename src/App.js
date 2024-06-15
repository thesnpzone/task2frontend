import React, { useState } from 'react';
import {  Routes, Route } from 'react-router-dom';
import TaskListPage from './TaskListPage';
import TaskDetails from './TaskDetails';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
 
  const [accessToken, setAccessToken] = useState('');
  const [showForm, setShowForm] = useState(false); 
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);


  // Login Funcation start

  const handleLogin = (e) => {
    e.preventDefault();
    const username = usernameInput;
    const password = passwordInput;

   
    if (username === 'realUser' && password === 'realPassword') {
      fetch('https://task2backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Authentication failed');
          }
          return response.json();
        })
        .then(data => {
          setAccessToken(data.accessToken);
          setShowForm(true); 
          setLoginError(false); 
        })
        .catch(error => console.error('Login failed:', error));
    } else {
      setLoginError(true); 
    }
  };

    // Login Funcation end


    // Logout Funcation start 

  const handleLogout = () => {
    setAccessToken(''); 
    setShowForm(false); 
    setTasks([]); 
  };


  // Logout Funcation end
  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center mb-4">To-Do App</h1>
   
        {accessToken ? (
          <Routes>
            <Route path="/" element={<TaskListPage tasks={tasks} accessToken={accessToken} />} />
            <Route path="/tasks/:id" element={<TaskDetails accessToken={accessToken} />} />
          </Routes>
        ) : (
          
          <div className="text-center">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="mb-4">
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  required
                />
              </div>
              {loginError && <p className="text-danger">Incorrect username or password.</p>}
              <button type="submit" className="btn btn-primary">Login</button>

              <p>demo user name: realUser</p>
              <p>demo user name: realPassword</p>

              
            </form>
          </div>
          
        )}
        {accessToken && (
          <div className="text-center">
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
