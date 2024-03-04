import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css'; // 修改变量名为styles
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
    const toNotes = () => {
        const token = sessionStorage.getItem('token');

        fetch('http://server.enhxbpexaqcvguev.uksouth.azurecontainer.io:8000/auth/getuser', {
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
        logout(); // 确保调用 logout 函数
        navigate('/home'); // 或者根据你的需求修改导航路径
    };

    return (
        <>
            <div className={styles['home-con']}>
                <div className={styles['home-head']}>
                    {/* <div className={styles['head-left']}></div> */}
                    <ul className={styles['head-right']}>
                        <li className={styles['head-item']}>HOME</li>
                        <li onClick={toChart} className={styles['head-item']}>TUTOR</li>
                        <li onClick={toNotes} className={styles['head-item']}>NOTE</li>
                        <li className={styles['head-item']}>ABOUT</li>
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
                        <span className={styles['title']}>LOREM PSUM DOLOP SIT AMET CONSECTETUR</span>
                        <p className={styles['desc']}>Lorem ipsum dolor sit amet,consctr adipiscing ediy,sed do eiysmod</p>
                    </div>
                    <div className={styles['footer-item']}>
                        <span className={styles['title']}>LOREM PSUM DOLOP SIT AMET CONSECTETUR</span>
                        <p className={styles['desc']}>Lorem ipsum dolor sit amet,consctr adipiscing ediy,sed do eiysmod</p>
                    </div>
                    <div className={styles['footer-item']}>
                        <span className={styles['title']}>LOREM PSUM DOLOP SIT AMET CONSECTETUR</span>
                        <p className={styles['desc']}>Lorem ipsum dolor sit amet,consctr adipiscing ediy,sed do eiysmod</p>
                    </div>
                </div>
                <div className={styles['footer-bottom']}>
                    <span>Copyright @ 2023 AI SCHOLARHUB ALL Right reserved</span>
                </div>
            </div>
        </>
    );
}
