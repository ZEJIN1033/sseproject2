document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessageDiv = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const data = { username, password };

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1) {
                    console.log('Login successful:', data);
                    console.log("this from the backend", data.data);
                    sessionStorage.setItem('token', data.data);

                    // Parse JWT to get userId
                    const base64Url = data.data.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(window.atob(base64));
                    const userId = payload.id;

                    window.location.href = `/${userId}/notes`;
                } else {
                    errorMessageDiv.textContent = 'Login failed: ' + (data.msg || 'Invalid Username or Password');
                    errorMessageDiv.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Login Error:', error);
                errorMessageDiv.textContent = 'Login error: ' + error.message;
                errorMessageDiv.style.display = 'block';
            });
    });
});