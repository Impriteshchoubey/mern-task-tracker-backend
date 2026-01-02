function FilterBar({ status, priority, sort, onChange, total }) {
  const handleChange = (e) => {
    onChange({ status, priority, sort, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="task-list-header">
        <span>Tasks overview</span>
        <span className="badge-count">{total} tasks</span>
      </div>
      <div className="filter-row">
        <select
          name="status"
          className="filter-select"
          value={status}
          onChange={handleChange}
        >
          <option value="">All status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          name="priority"
          className="filter-select"
          value={priority}
          onChange={handleChange}
        >
          <option value="">All priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          name="sort"
          className="filter-select"
          value={sort}
          onChange={handleChange}
        >
          <option value="">Sort by created</option>
          <option value="dueDate">Sort by due date</option>
        </select>
      </div>
    </>
  );
}
export default FilterBar;