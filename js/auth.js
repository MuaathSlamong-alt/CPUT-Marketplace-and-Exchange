
// Check if user is logged in
async function checkAuthStatus() {
    const API_BASE = globalThis.__API_BASE__ || '';
    try {
        const response = await fetch(API_BASE + '/api/me');
        if (response.ok) {
            const user = await response.json();
            return user;
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Update UI based on authentication status
async function updateAuthUI() {
    const user = await checkAuthStatus();
    const userIcon = document.querySelector('img[alt="User"]');
    
    if (user) {
        // User is logged in
        if (userIcon && userIcon.parentElement) {
            userIcon.parentElement.title = `Logged in as ${user.username}`;
            userIcon.style.filter = 'brightness(1.2)';
        }
        
        // Show user info in sidebar if available
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            let userInfo = document.getElementById('user-info');
            if (!userInfo) {
                userInfo = document.createElement('div');
                userInfo.id = 'user-info';
                userInfo.innerHTML = `
                    <div style="background: #e8f5e8; padding: 10px; margin: 10px 0; border-radius: 8px; font-size: 0.9em;">
                        👤 Welcome, ${user.username}!
                        <br><a href="/logout" style="color: #666; font-size: 0.8em;">Logout</a>
                    </div>
                `;
                sidebar.insertBefore(userInfo, sidebar.firstChild);
            }
        }
        
        return user;
    } else {
        // User is not logged in
        if (userIcon && userIcon.parentElement) {
            userIcon.parentElement.title = 'Click to login';
        }
        return null;
    }
}

// Initialize auth status check on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkAuthStatus, updateAuthUI };
} else {
    globalThis.checkAuthStatus = checkAuthStatus;
    globalThis.updateAuthUI = updateAuthUI;
}