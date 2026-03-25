import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import api from './services/api';
import AdminMonitor from './components/AdminMonitor'; 

function App() {
  const [user, setUser] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime ] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00")
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summary, setSummary] = useState('');
  const[activeTab, setActiveTab] = useState('dashboard')

 useEffect(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    
    // Safety: If a regular employee was somehow on the monitor tab, move them to dashboard
    if (!parsedUser.isAdmin && activeTab === 'monitor') {
      setActiveTab('dashboard');
    }
  }
}, [activeTab]);

  useEffect(() => {
    let interval = null;
    if (isClockedIn && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(startTime);
        const diffInMs = now - start;
        const hours = Math.floor(diffInMs / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor ((diffInMs % 3600000) / 60000).toString().padStart(2,'0');
        const seconds = Math.floor((diffInMs % 60000) / 1000).toString().padStart(2,'0');

        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    } else {
      clearInterval(interval);
      setElapsedTime("00:00:00");
    }
    return () => clearInterval(interval);
  }, [isClockedIn,startTime]);

  const handleClockIn = async () => {
    try {
        const response = await api.clockIn(user.id);
        // Store the time sent back from Java
        setStartTime(new Date(response.data)); 
        setIsClockedIn(true);
    } catch (err) {
        alert("Clock-in failed. Check if Java server is running.");
    }
};
  const handleClockOut = async () => {
    try {
      await api.clockOut(user.id, summary);
      setIsClockedIn(false);
      setShowSummaryModal(false);
      setSummary('');
      alert("Shift completed and summary saved.");
    } catch (err){alert ("Error Saving Summary.");}
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) return <Login onLoginSuccess={setUser} />;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="logo">Shift <span className="logo-pro">PRO</span></div>
        <nav className="nav-stack">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </div>
          
          {user.isAdmin && (
            <div 
              className={`nav-item ${activeTab === 'monitor' ? 'active' : ''}`}
              onClick={() => setActiveTab('monitor')}
            >
              Monitor Staff
            </div>
          )}

          <div 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </div>
        </nav>
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1 className="title">
              {activeTab === 'dashboard' ? `Welcome, ${user.name}` : 
               activeTab === 'monitor' ? 'Staff Activity' : 'History'}
            </h1>
            <p className="subtitle">{user.isAdmin ? 'Admin Dashboard' : 'Employee Workspace'}</p>
          </div>
          <div className="user-avatar">{user.name.charAt(0)}</div>
        </header>

        {/* --- DASHBOARD VIEW --- */}
        {activeTab === 'dashboard' && (
          <>
            <div className="stats-row">
              <div className="stat-card">
                <span className="stat-label">Shift Status</span>
                <div className="status-dot" style={{ backgroundColor: isClockedIn ? '#10b981' : '#f59e0b' }}></div>
                <span className="stat-value">{isClockedIn ? 'Active' : 'Offline'}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Total Hours Today</span>
                <span className="stat-value">{elapsedTime}</span>
              </div>
            </div>

            <div className="action-card">
              <h2>Time Tracker</h2>
              <p className="subtitle">Ready to start your shift? Record your time accurately.</p>
              {!isClockedIn ? (
                <button onClick={handleClockIn} className="btn-primary">Clock In Now</button>
              ) : (
                <button onClick={() => setShowSummaryModal(true)} className="btn-danger">Clock Out</button>
              )}
            </div>
          </>
        )}

        {/* --- MONITOR STAFF VIEW --- */}
        {activeTab === 'monitor' && <AdminMonitor />}

        {/* --- HISTORY VIEW --- */}
        {activeTab === 'history' && (
          <div className="action-card">
            <h2>History</h2>
            <p className="subtitle">Individual work history coming soon.</p>
          </div>
        )}

        {/* --- MODAL (Always stays at bottom of main) --- */}
        {showSummaryModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Shift Summary</h3>
              <p>Briefly describe what you worked on today:</p>
              <textarea
                className="summary-input"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder='Ex: Finished the API Integration and styled the Login Page...'
              />

              <div className="modal-actions">
                <button onClick={() => setShowSummaryModal(false)} className="btn-cancel">Cancel</button>
                <button onClick={handleClockOut} className="btn-submit">Submit & Finish</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;