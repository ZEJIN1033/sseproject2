import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { useAuth } from '../../services/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });
    // const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onLogin = (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append('username', loginForm.username);
        formData.append('password', loginForm.password);

        fetch('http://server.enhxbpexaqcvguev.uksouth.azurecontainer.io:8000/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem('token', data.access_token);
            login();
            navigate('/home');
        })
        .catch(error => {
            // setError('Login failed. Please check your username and password.');
            alert('Login failed. Please check your username and password.');
        });
    };

    return (
        <>
            <div className={styles['login-con']}>
                <div className={styles['form-box']}>
                    <span className={styles['title']}>AI Tutor</span>
                    <div className={styles['form-item']}>
                        <span className={styles['label']}>username</span>
                        <input
                            name="username"
                            onChange={handleInputChange}
                            placeholder='please enter username'
                        />
                    </div>
                    <div className={styles['form-item']}>
                        <span className={styles['label']}>password</span>
                        <input
                            name="password"
                            type='password'
                            onChange={handleInputChange}
                            placeholder='please enter password'
                        />
                    </div>
                    <div className={styles['login-btn']} onClick={onLogin}>Login</div>
                    <span onClick={() => navigate('/register')} className={styles['register']}>Don't have an account? Register now</span>
                </div>
            </div>
        </>
    );
}
