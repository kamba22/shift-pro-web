import React, { useState } from 'react';
import api from '../services/api';
import '../App.css'; 

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.login(email, password);
            if (response.data && response.data.id) {
                localStorage.setItem('user', JSON.stringify(response.data));
                onLoginSuccess(response.data);
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("Cannot connect to server. Is the Java app running?");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>SHIFT</h2>
                <p className="login-subtitle">Sign in to track your work hours</p>
                
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    
                    <input 
                        className="login-input"
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        className="login-input"
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="login-button">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default Login;