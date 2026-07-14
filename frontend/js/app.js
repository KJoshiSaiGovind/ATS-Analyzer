document.addEventListener('DOMContentLoaded', () => {
    if (api.getToken() && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleViewBtn = document.getElementById('toggle-view');
    const authTitle = document.getElementById('auth-title');
    const authError = document.getElementById('auth-error');

    let isLogin = true;

    if (toggleViewBtn) {
        toggleViewBtn.addEventListener('click', () => {
            isLogin = !isLogin;
            if (isLogin) {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
                authTitle.textContent = 'Welcome Back';
                toggleViewBtn.textContent = 'Need an account? Register';
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
                authTitle.textContent = 'Create Account';
                toggleViewBtn.textContent = 'Already have an account? Login';
            }
            authError.classList.add('hidden');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            try {
                const data = await api.request('/auth/login', 'POST', { email, password });
                api.setToken(data.access_token);
                window.location.href = 'dashboard.html';
            } catch (err) {
                authError.textContent = err.message;
                authError.classList.remove('hidden');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            try {
                await api.request('/auth/register', 'POST', {
                    full_name: fullName,
                    email,
                    password,
                    role: 'candidate' 
                });
                const data = await api.request('/auth/login', 'POST', { email, password });
                api.setToken(data.access_token);
                window.location.href = 'dashboard.html';
            } catch (err) {
                authError.textContent = err.message;
                authError.classList.remove('hidden');
            }
        });
    }
});
