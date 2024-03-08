import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from './index.module.css'
export default function Login() {
    const navigate = useNavigate()
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        email: '',
        confirmPassword:''
    }) 
    //统一处理数据
    const resolveInputValue = (event,valueName) => {
        const newRegisterForm = { ...registerForm }
        newRegisterForm[valueName] = event.target.value
        setRegisterForm(newRegisterForm)
    }
    //去注册
    const toLogin = () => {
        navigate('/login')
    }
    //注册
    const onRegister = () => {
        // 检查密码确认逻辑（前端验证）
        console.log(registerForm.password, registerForm.confrmPassword);
        if (registerForm.password !== registerForm.confirmPassword) {
            console.log("bad");
            alert('Passwords do not match!');
            return;
        }
    
        // 准备发送的数据
        const postData = {
            username: registerForm.username,
            password: registerForm.password,
            email: registerForm.email,
        };
    
        // 发送请求
        fetch('apiserver/auth', { // 确保URL是正确的
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Network response was not ok');
            }
            return data;
        })
        .then(data => {
            // 处理成功响应，如跳转到登录页或显示成功消息
            console.log('Registration successful', data);
            navigate('/login');
        })
        .catch(error => {
            // 处理错误情况
            console.error('Registration failed', error);
            alert(error.message);
        });
    };
    
    return (
        <>
            <div className={styled['login-con']}>
                <div className={styled['form-box']}>
                    <span className={styled['title']}>AI Tutor</span>
                    <div className={styled['form-item']}>
                        <span className={styled['label']}>username</span>
                        <input onChange={event => resolveInputValue(event,'username')} placeholder='please enter username'></input>
                    </div>
                    <div className={styled['form-item']}>
                        <span className={styled['label']}>Email</span>
                        <input onChange={event =>resolveInputValue(event,'email')} placeholder='please enter email'></input>
                    </div>
                    <div className={styled['form-item']}>
                        <span className={styled['label']}>password</span>
                        <input type='password' onChange={event =>resolveInputValue(event,'password')} placeholder='please enter password'></input>
                    </div>
                    <div className={styled['form-item']}>
                        <span className={styled['label']}>Confirm Password</span>
                        <input type='password' onChange={event =>resolveInputValue(event,'confirmPassword')} placeholder='please confirm your password'></input>
                    </div>
                    <div className={styled['login-btn']} onClick={onRegister}>Register</div>
                    <span onClick={toLogin} className={styled['register']}>back Login</span>
                </div>
            </div>
        </>
    )
}