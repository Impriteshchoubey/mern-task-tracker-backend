import { useState, useEffect } from "react";

const initialState = {
  title: "",
  description: "",
  priority: "Low",
  dueDate: "",
  status: "Pending",
};

function TaskForm({ onSubmit, submitting, existingTask, onCancel }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingTask) {
      setFormData({
        title: existingTask.title,
        description: existingTask.description || "",
        priority: existingTask.priority || "Low",
        dueDate: existingTask.dueDate
          ? existingTask.dueDate.split("T")[0]
          : "",
        status: existingTask.status || "Pending",
      });
    } else {
      setFormData(initialState);
    }
  }, [existingTask]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.title, formData.dueDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData, () => setFormData(initialState));
  };

  const isValid = Object.keys(errors).length === 0 && formData.title && formData.dueDate;

  return (
  <form onSubmit={handleSubmit}>
    <h2>Add Task</h2>
    <p className="task-form-subtitle">
      Title and due date are required. Priority and status help you organize your day.
    </p>

    <div className="form-row">
      <label className="form-label form-label-required">Title</label>
      <input
        type="text"
        name="title"
        className="form-input"
        value={formData.title}
        onChange={handleChange}
      />
      {errors.title && <p className="form-error">{errors.title}</p>}
    </div>

    <div className="form-row">
      <label className="form-label">Description</label>
      <textarea
        name="description"
        className="form-textarea"
        value={formData.description}
        onChange={handleChange}
        rows={3}
      />
    </div>

    <div className="form-grid">
      <div className="form-row">
        <label className="form-label">Priority</label>
        <select
          name="priority"
          className="form-select"
          value={formData.priority}
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="form-row">
        <label className="form-label form-label-required">Due Date</label>
        <input
          type="date"
          name="dueDate"
          className="form-input"
          value={formData.dueDate}
          onChange={handleChange}
        />
        {errors.dueDate && <p className="form-error">{errors.dueDate}</p>}
      </div>

      <div className="form-row">
        <label className="form-label">Status</label>
        <select
          name="status"
          className="form-select"
          value={formData.status}
          onChange={handleChange}
        >
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>
    </div>

    <div className="btn-row">
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!isValid || submitting}
      >
        {submitting ? "Saving..." : existingTask ? "Update Task" : "Add Task"}
      </button>
      {existingTask && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </div>
  </form>
);

}

export default TaskForm;
