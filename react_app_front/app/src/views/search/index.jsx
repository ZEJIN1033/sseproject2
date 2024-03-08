import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';



export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const onSearch = () => {
        setIsLoading(true);
        const inputData = { url: searchTerm };
        const token = sessionStorage.getItem('token');

        fetch('apiserver/fetch_script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(inputData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Bad network response OR your URL is invalid');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            setSearchTerm('');
            alert("Summary report wrote into NOTES Successfully!")
        })
        .catch(error => {
            alert(error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const toHome = () => {
        navigate('/home');
    };

    return (
        <div className={styles.container}>
            {isLoading && <div className={styles.overlay}>Loading...</div>}
            <button className={styles.backButton} onClick={toHome} disabled={isLoading}>Back</button>
            
            <div className={styles.searchBoxWrapper}>
                <label htmlFor="searchInput" className={styles.searchLabel}>Enter your search term below:</label>
                <div className={styles.inputButtonRow}>
                    <input
                        id="searchInput"
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder='Enter search term'
                        disabled={isLoading}
                    />
                    <button className={styles.searchButton} onClick={onSearch} disabled={isLoading}>Search</button> {/* 根据isLoading状态禁用按钮 */}
                </div>
            </div>
        </div>
    );
}