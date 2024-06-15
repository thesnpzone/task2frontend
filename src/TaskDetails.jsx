import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const TaskDetails = ({ accessToken }) => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = () => {
    fetch(`https://task2backend.onrender.com/tasks/${id}`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Task not found');
        }
        return response.json();
      })
      .then(data => setTask(data))
      .catch(error => console.error('Error fetching task:', error));
  };

  if (!task) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <Link to="/" className="btn btn-primary">Back to Tasks</Link>
    </div>
  );
};

export default TaskDetails;
