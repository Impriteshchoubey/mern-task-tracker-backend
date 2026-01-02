import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggleStatus, onDelete, onEdit }) {
  if (!tasks.length) {
    return <p className="task-empty">No tasks found. Add a task to get started.</p>;
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}


export default TaskList;
