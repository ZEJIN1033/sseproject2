import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { useAuth } from '../../services/AuthContext';

export default function Home() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    
    const toChart = () => {
        navigate('/chat');
    };
    const toLogin = () => {
        navigate('/login');
    };
    const toRegister = () => {
        navigate('/register');
    }
    const toSearch = () => {
        navigate('/Search')
    }
    const toNotes = () => {
        const token = sessionStorage.getItem('token');

        fetch('apiserver/auth/getuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.id);
            window.location.href = `/${data.id}/notes`
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            alert(error);
        });        
    }

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    return (
        <>
            <div className={styles['home-con']}>
                <div className={styles['home-head']}>
                    <ul className={styles['head-right']}>
                        <li className={styles['head-item']}>HOME</li>
                        <li onClick={toChart} className={styles['head-item']}>TUTOR</li>
                        <li onClick={toNotes} className={styles['head-item']}>NOTE</li>
                        <li onClick={toSearch} className={styles['head-item']}>SCRIPT</li>
                        {isAuthenticated ? (
                          <li onClick={handleLogout} className={styles['head-item']}>LOGOUT</li>
                        ) : (
                          <li onClick={toLogin} className={styles['head-item']}>LOGIN</li>
                        )}
                     </ul>
                </div>
                <div className={styles['content']}>
                    <div className={styles['title-box']}>
                        <p className={styles['title']}>Unlock Knowledge</p>
                        <p className={styles['title']}>Unleash Potential</p>
                    </div>
                    <div className={styles['content-box']}>
                        <span>Discover the future of learning with AI SCHOLARHUB, where innovation meets education. Our AI-powered tutors are designed to revolutionize your study experience, providing personalized, on-demand guidance across any subject, anytime, anywhere. Join us to unlock your true potential and redefine the boundaries of what you can achieve.</span>
                    </div>
                    <li onClick={toRegister} className={styles['btn']}>SIGN UP</li>
                </div>
            </div>
            <div className={styles['footer']}>
                <div className={styles['footer-box']}>
                    <div className={styles['footer-item']}>
                        <span className={styles['title']}>About Us</span>
                        <p className={styles['desc']}>"AI Tutor empowers your educational journey with on-demand AI assistance. Dive into the realm of artificial intelligence with our expertise guiding you at every step. We're dedicated to demystifying AI concepts, making them accessible and understandable for all."</p>
                    </div>
                    <div className={styles['footer-item']}>
                        <span className={styles['title']}>Our Services</span>
                        <p className={styles['desc']}>"Enhance your learning efficiency with AI Tutor's advanced note-taking and video summarization tools. Convert lectures into concise notes, and distill lengthy videos into digestible reports. Our services are tailored to optimize your study sessions and boost retention."</p>
                    </div>
                    <div className={styles['footer-item']}>
                        <span className={styles['title']}>Contact Information</span>
                        <p className={styles['desc']}>"Start your AI studying experience with AI Tutor today. Encounter a challenge? Reach out at 1033jinz@gmail.com for prompt support."</p>
                    </div>
                </div>
                <div className={styles['footer-bottom']}>
                    <span>Copyright @ 2023 AI SCHOLARHUB ALL Right reserved</span>
                </div>
            </div>
        </>
    );
}
