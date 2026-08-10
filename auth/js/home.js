// Renders the nav auth controls (Sign In / Register, or account + Sign Out)
// based on Auth module state. See auth/js/auth.js for the Auth module.
document.addEventListener('DOMContentLoaded', async () => {
    await Auth.ready;
    render();
});

function render() {
    const isAuth = Auth.isAuthenticated();
    const user = Auth.getUser();

    const controls = document.getElementById('nav-auth-controls');
    if (!controls) return;

    if (isAuth) {
        controls.innerHTML = `
            <span class="text-muted-light small d-none d-md-inline">${user.email}</span>
            <button class="auth-btn" type="button" onclick="handleLogout()">Sign Out</button>
        `;
    } else {
        controls.innerHTML = `
            <a class="auth-btn" href="/auth/login.html">Sign In</a>
            <a class="auth-btn" href="/auth/register.html">Register</a>
        `;
    }
}

async function handleLogout() {
    if (!confirm('Sign out?')) return;
    await Auth.logout();
    render();
}
