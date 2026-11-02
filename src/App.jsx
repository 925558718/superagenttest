import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Explore Vite + React SPA features', completed: true },
    { id: 2, text: 'Optimize the UI design and layout', completed: false },
    { id: 3, text: 'Deploy to production environment', completed: false },
  ])
  const [newTaskText, setNewTaskText] = useState('')

  const addTask = (e) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    setTasks([...tasks, { id: Date.now(), text: newTaskText.trim(), completed: false }])
    setNewTaskText('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">⚡</span>
          <h1>ViteSpark</h1>
        </div>
        <nav className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#community" className="nav-link">Community</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="nav-btn-github">GitHub</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge">✨ Modern UI / UX Redesign</div>
          <h1>Lightning Fast React & Vite Application</h1>
          <p className="hero-desc">
            Experience top-tier performance, sleek glassmorphism aesthetics, and fully interactive components built for the modern web.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setCount(c => c + 1)}>
              Interactive Count: <span>{count}</span>
            </button>
            <a href="#dashboard" className="btn-secondary">Explore Tasks</a>
          </div>
        </div>
        
        <div className="hero-card-preview">
          <div className="card-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="card-title">vitespark-dashboard.jsx</span>
          </div>
          <div className="card-body">
            <div className="stat-grid">
              <div className="stat-item">
                <span className="stat-num">0.4s</span>
                <span className="stat-label">Load Time</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Performance</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">React 19</span>
                <span className="stat-label">Engine</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Task Dashboard Section */}
      <section id="dashboard" className="dashboard-section">
        <div className="section-header">
          <h2>Project Task Manager</h2>
          <p>Organize your development workflow with this built-in interactive manager.</p>
        </div>

        <div className="dashboard-card">
          <form onSubmit={addTask} className="task-form">
            <input 
              type="text" 
              placeholder="Add a new task..." 
              value={newTaskText} 
              onChange={(e) => setNewTaskText(e.target.value)} 
            />
            <button type="submit" className="btn-add">Add Task</button>
          </form>

          <ul className="task-list">
            {tasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <label className="task-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => toggleTask(task.id)} 
                  />
                  <span className="checkbox-custom"></span>
                  <span className="task-text">{task.text}</span>
                </label>
                <button className="btn-delete" onClick={() => deleteTask(task.id)} title="Delete task">×</button>
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="empty-tasks">No tasks available. Add one above!</li>
            )}
          </ul>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Why Choose ViteSpark?</h2>
          <p>Engineered to deliver exceptional developer and user experiences.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Instant HMR</h3>
            <p>Lightning fast module replacement keeps your feedback loop instantaneous during development.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Modern UI & Glass</h3>
            <p>Crafted with gorgeous gradients, subtle shadows, and responsive layouts that adapt seamlessly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Production Ready</h3>
            <p>Optimized asset bundles, robust accessibility, and clean component structures ready for scale.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} ViteSpark Inc. Built with Vite, React, and Passion.</p>
      </footer>
    </div>
  )
}

export default App
