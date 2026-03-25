import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../App.css'; 

const AdminMonitor = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.getAllLogsForAdmin();
                setLogs(response.data);
            } catch (err) {
                console.error("Failed to fetch logs", err);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="monitor-container">
            <h2 className="section-title">Staff Activity Monitor</h2>
            <table className="monitor-table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Work Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <tr key={index}>
                            <td className="emp-name">{log.name}</td>
                            <td>{new Date(log.clock_in).toLocaleString()}</td>
                            <td>{log.clock_out ? new Date(log.clock_out).toLocaleString() : <span className="active-badge">Active</span>}</td>
                            <td className="summary-cell">{log.work_summary || "---"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminMonitor;