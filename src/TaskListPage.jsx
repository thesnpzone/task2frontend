import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TaskListPage = ({ accessToken }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editTask, setEditTask] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");

  //   Featch Task start

  useEffect(() => {
    fetchTasks();
  }, [sortBy, filterBy, accessToken]);

  const fetchTasks = () => {
    let url = "https://task2backend.onrender.com/tasks";
    if (sortBy) {
      url += `?sortBy=${sortBy}`;
    }
    if (filterBy) {
      url += `&filterBy=${filterBy}`;
    }

    fetch(url, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  //   Featch Task End

  //   form input start

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editTask) {
      setEditTask({ ...editTask, [name]: value });
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  //   form input end

  //   form submit start

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editTask) {
      updateTask(editTask.id, editTask);
    } else {
      createTask(newTask);
    }
  };

  //   form submit start

  //   CURD Task start

  const createTask = (task) => {
    fetch("https://task2backend.onrender.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(task),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error creating task");
        }
        return response.json();
      })
      .then((data) => {
        setTasks([...tasks, data]);
        setNewTask({ title: "", description: "" });
      })
      .catch((error) => console.error("Error creating task:", error));
  };

  const updateTask = (id, updatedTask) => {
    fetch(`https://task2backend.onrender.com/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating task");
        }
        return response.json();
      })
      .then((data) => {
        const updatedTasks = tasks.map((task) =>
          task.id === id ? data : task
        );
        setTasks(updatedTasks);
        setEditTask(null);
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleEdit = (task) => {
    setEditTask(task);
  };

  const handleCancelEdit = () => {
    setEditTask(null);
  };

  const handleDelete = (id) => {
    fetch(`https://task2backend.onrender.com/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error deleting task");
        }
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const handleTaskCompletionToggle = (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    updateTask(id, updatedTask);
  };

  //   CURD Task end

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-8">
            <input
              type="text"
              className="form-control"
              name="title"
              value={editTask ? editTask.title : newTask.title}
              placeholder="Enter task title"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-8">
            <input
              type="text"
              className="form-control"
              name="description"
              value={editTask ? editTask.description : newTask.description}
              placeholder="Enter task description"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-4">
            {editTask ? (
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Update Task
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button type="submit" className="btn btn-success">
                Add Task
              </button>
            )}
          </div>
        </div>
      </form>
      <div className="mb-4">
        <label className="me-2">Sort by:</label>
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">None</option>
          <option value="title">Title</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="me-2">Filter by:</label>
        <select
          className="form-select"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <Link to={`/tasks/${task.id}`} className="text-decoration-none">
                  <h3 className="mb-0">{task.title}</h3>
                </Link>
                <p className="mb-0">{task.description}</p>
              </div>
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger me-2"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
                <button
                  className={`btn ${
                    task.completed
                      ? "btn-outline-secondary"
                      : "btn-outline-success"
                  }`}
                  onClick={() => handleTaskCompletionToggle(task.id)}
                >
                  {task.completed ? "Mark Not Done" : "Mark Completed"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskListPage;
