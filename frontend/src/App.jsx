import { useEffect, useState } from "react";
import api from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    sort: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 2500);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.sort) params.sort = filters.sort;

      const res = await api.get("/api/tasks", { params });
      setTasks(res.data.data || []);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      showNotification("error", "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCreateOrUpdate = async (data, resetForm) => {
    try {
      setSubmitting(true);
      if (editingTask) {
        const res = await api.put(`/api/tasks/${editingTask._id}`, data);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.data.data : t))
        );
        showNotification("success", "Task updated");
        setEditingTask(null);
      } else {
        const res = await api.post("/api/tasks", data);
        setTasks((prev) => [res.data.data, ...prev]);
        showNotification("success", "Task created");
      }
      resetForm();
    } catch (error) {
      console.error("Submit task error:", error);
      const msg =
        error.response?.data?.message || "Failed to save task";
      showNotification("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === "Completed" ? "Pending" : "Completed";
      const res = await api.put(`/api/tasks/${task._id}`, {
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data.data : t))
      );
      showNotification("success", "Status updated");
    } catch (error) {
      console.error("Toggle status error:", error);
      showNotification("error", "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showNotification("success", "Task deleted");
    } catch (error) {
      console.error("Delete task error:", error);
      showNotification("error", "Failed to delete task");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

 return (
  <div className="app-shell">
    <div className="app-container">
      <header className="app-header">
        <div className="app-title-row">
          <div>
            <div className="app-title">
              Task Tracker
              <span className="app-title-pill">MERN • DAILY TASKS</span>
            </div>
            <p className="app-subtitle">
              Create, prioritize, and complete your daily work without losing track.
            </p>
          </div>
          <span className="app-stat-pill">
            <span className="app-stat-dot" />
            {tasks.filter((t) => t.status === "Pending").length} pending
          </span>
        </div>
      </header>

      {notification && (
        <div
          className={`toast ${
            notification.type === "success" ? "toast-success" : "toast-error"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="layout-grid">
        <div className="card task-form">
          {/* TaskForm here */}
          <TaskForm
            onSubmit={handleCreateOrUpdate}
            submitting={submitting}
            existingTask={editingTask}
            onCancel={handleCancelEdit}
          />
        </div>

        <div>
          <div className="card filter-card">
            <FilterBar
              status={filters.status}
              priority={filters.priority}
              sort={filters.sort}
              onChange={handleFilterChange}
              total={tasks.length}
            />
          </div>
          <div className="card task-list-card">
            {loading ? (
              <p style={{ textAlign: "center", fontSize: "0.85rem" }}>Loading...</p>
            ) : (
              <TaskList
                tasks={tasks}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default App;
