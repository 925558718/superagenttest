import { useEffect, useMemo, useRef, useState } from 'react'
import TodoItem from './components/TodoItem.jsx'
import './App.css'

const TODOS_KEY = 'weiguang-todos:v1'
const THEME_KEY = 'weiguang-theme'

const FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'active', label: '进行中' },
  { id: 'completed', label: '已完成' },
]

const EMPTY_STATES = {
  all: {
    title: '清单还是空的',
    hint: '在上面写下第一件想完成的小事，从这里开始。',
  },
  active: {
    title: '没有进行中的任务',
    hint: '所有事情都完成了，给自己一点休息。',
  },
  completed: {
    title: '还没有完成的任务',
    hint: '完成任意一条，它就会出现在这里。',
  },
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeTodo(value) {
  if (!value || typeof value !== 'object') return null
  if (typeof value.text !== 'string') return null
  const text = value.text.trim()
  if (!text) return null
  return {
    id: typeof value.id === 'string' ? value.id : createId(),
    text,
    completed: Boolean(value.completed),
    createdAt: Number(value.createdAt) || Date.now(),
  }
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(TODOS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeTodo).filter(Boolean)
  } catch {
    return []
  }
}

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage may be unavailable; fall back to the system preference.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [theme, setTheme] = useState(getInitialTheme)
  const inputRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
    } catch {
      // Persisting is best-effort; the app still works in memory.
    }
  }, [todos])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Ignore storage failures so theme switching always works.
    }
  }, [theme])

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  )
  const remainingCount = todos.length - completedCount
  const progress = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100)

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed)
    if (filter === 'completed') return todos.filter((todo) => todo.completed)
    return todos
  }, [todos, filter])

  const counts = {
    all: todos.length,
    active: remainingCount,
    completed: completedCount,
  }

  function addTodo(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) {
      inputRef.current?.focus()
      return
    }
    setTodos((current) => [
      ...current,
      { id: createId(), text, completed: false, createdAt: Date.now() },
    ])
    setDraft('')
    setFilter('all')
    inputRef.current?.focus()
  }

  function toggleTodo(id) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    )
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function saveEdit(id, text) {
    const nextText = text.trim()
    setEditingId(null)
    if (!nextText) return
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, text: nextText } : todo)),
    )
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.completed))
    setEditingId(null)
  }

  const emptyState = EMPTY_STATES[filter]
  const showAllDone = filter === 'active' && remainingCount === 0 && todos.length > 0

  return (
    <div className="app">
      <div className="app__glow app__glow--one" aria-hidden="true" />
      <div className="app__glow app__glow--two" aria-hidden="true" />

      <main className="shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d="m5 12.5 4.2 4.2L19 6.8"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="brand__name">微光待办</span>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
                <path
                  d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path
                  d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.4 8.4 0 1 0 10.4 10.4Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </header>

        <section className="intro">
          <h1>
            让每一件小事，
            <br />
            都被<span className="intro__accent">好好完成</span>。
          </h1>
          <p className="intro__lede">
            一个安静、专注的待办清单。写下今天要做的事，逐条推进，收获清爽的一天。
          </p>
        </section>

        <section className="card" aria-label="待办清单">
          <div
            className="progress"
            role="progressbar"
            aria-label="完成进度"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          >
            <div className="progress__fill" style={{ width: `${progress}%` }} />
          </div>

          <form className="composer" onSubmit={addTodo}>
            <span className="composer__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              ref={inputRef}
              className="composer__input"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="添加一件想做的事…"
              aria-label="新任务内容"
              maxLength={120}
              autoComplete="off"
            />
            <button className="composer__submit" type="submit">
              添加
            </button>
          </form>

          <div className="toolbar">
            <div className="filters" role="group" aria-label="筛选任务">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`filters__btn${filter === item.id ? ' is-active' : ''}`}
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                >
                  {item.label}
                  <span className="filters__count">{counts[item.id]}</span>
                </button>
              ))}
            </div>
            <p className="toolbar__status" aria-live="polite">
              还剩 <strong>{remainingCount}</strong> 件
            </p>
          </div>

          {visibleTodos.length > 0 ? (
            <ul className="todo-list">
              {visibleTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isEditing={editingId === todo.id}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEditStart={setEditingId}
                  onEditSave={saveEdit}
                  onEditCancel={() => setEditingId(null)}
                />
              ))}
            </ul>
          ) : (
            <div className="empty">
              <span className="empty__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" opacity=".35" />
                  <path
                    d="M7.6 12.4 10.4 15.2 16.6 8.9"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3>{showAllDone ? '全部完成了' : emptyState.title}</h3>
              <p>{showAllDone ? '清单已经清空，去做点让自己开心的事吧。' : emptyState.hint}</p>
            </div>
          )}

          <footer className="card__footer">
            <span className="card__summary">
              {completedCount} / {todos.length} 已完成
            </span>
            <button
              type="button"
              className="clear-btn"
              onClick={clearCompleted}
              disabled={completedCount === 0}
            >
              清除已完成
            </button>
          </footer>
        </section>

        <p className="hint">双击任务文字可编辑 · 清单只保存在当前浏览器</p>
      </main>
    </div>
  )
}

export default App