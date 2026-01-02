function TaskItem({ task, onToggleStatus, onDelete, onEdit }) {
  const isCompleted = task.status === "Completed";

  const priorityClass =
    task.priority === "High"
      ? "priority-high"
      : task.priority === "Medium"
      ? "priority-medium"
      : "priority-low";

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <span
          className={
            "task-status-pill " +
            (isCompleted ? "task-status-completed" : "task-status-pending")
          }
        >
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta-row">
        <span className={`task-meta-pill ${priorityClass}`}>
          Priority: {task.priority}
        </span>
        <span className="task-meta-pill">
          Due:{" "}
          {new Date(task.dueDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="task-actions">
        <button
          className="btn-task-primary"
          onClick={() => onToggleStatus(task)}
        >
          {isCompleted ? "Mark pending" : "Mark completed"}
        </button>
        <button
          className="btn-task-secondary"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="btn-task-danger"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}


export default TaskItem;
