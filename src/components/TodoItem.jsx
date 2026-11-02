import { useState } from 'react'

function TodoEditor({ todo, onSave, onCancel }) {
  const [draft, setDraft] = useState(todo.text)

  return (
    <li className="todo todo--editing">
      <form
        className="todo__editor"
        onSubmit={(event) => {
          event.preventDefault()
          onSave(draft)
        }}
      >
        <input
          className="todo__editor-input"
          type="text"
          value={draft}
          maxLength={120}
          autoFocus
          aria-label={`编辑任务：${todo.text}`}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => onSave(draft)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              onCancel()
            }
          }}
        />
        <button type="submit" className="btn btn--primary">
          保存
        </button>
        <button
          type="button"
          className="btn"
          onMouseDown={(event) => {
            // Keep the input from blurring (which would save) before cancelling.
            event.preventDefault()
            onCancel()
          }}
        >
          取消
        </button>
      </form>
    </li>
  )
}

function TodoItem({
  todo,
  isEditing,
  onToggle,
  onDelete,
  onEditStart,
  onEditSave,
  onEditCancel,
}) {
  if (isEditing) {
    return (
      <TodoEditor
        todo={todo}
        onSave={(text) => onEditSave(todo.id, text)}
        onCancel={onEditCancel}
      />
    )
  }

  return (
    <li className={`todo${todo.completed ? ' todo--done' : ''}`}>
      <label className="check">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="check__box" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
            <path
              d="m5 12.5 4.2 4.2L19 6.8"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="visually-hidden">
          {todo.completed ? '标记为未完成' : '标记为已完成'}：{todo.text}
        </span>
      </label>

      <span className="todo__text" onDoubleClick={() => onEditStart(todo.id)} title="双击编辑">
        {todo.text}
      </span>

      <div className="todo__actions">
        <button
          type="button"
          className="icon-btn"
          onClick={() => onEditStart(todo.id)}
          aria-label={`编辑：${todo.text}`}
          title="编辑"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <path
              d="M4.5 19.5h4L19 9a2.1 2.1 0 0 0-3-3L5.5 16.5l-1 3Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(todo.id)}
          aria-label={`删除：${todo.text}`}
          title="删除"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <path
              d="M5 7h14M10 7V5h4v2M7 7l.8 12h8.4L17 7M10.5 11v4.5M13.5 11v4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </li>
  )
}

export default TodoItem