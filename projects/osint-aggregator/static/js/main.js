// API endpoints
const API_BASE_URL = 'http://localhost:8000/api';
const ENDPOINTS = {
    username: `${API_BASE_URL}/username-lookup`,
    email: `${API_BASE_URL}/email-lookup`,
    image: `${API_BASE_URL}/image-metadata`
};

// UI Elements
const systemStatus = document.getElementById('system-status');
const usernameResults = document.getElementById('username-results');
const emailResults = document.getElementById('email-results');
const imageResults = document.getElementById('image-results');

// Helper Functions
function updateSystemStatus(status, isError = false) {
    systemStatus.textContent = status;
    systemStatus.style.color = isError ? 'var(--error-color)' : 'var(--success-color)';
}

function createResultCard(data) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    if (typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
            const row = document.createElement('div');
            row.className = 'result-row';
            row.innerHTML = `
                <span class="result-key">${key}:</span>
                <span class="result-value">${
                    typeof value === 'object' ? JSON.stringify(value, null, 2) : value
                }</span>
            `;
            card.appendChild(row);
        });
    } else {
        card.textContent = data;
    }
    
    return card;
}

function showLoading(container) {
    container.innerHTML = '<div class="cyber-loading">PROCESSING REQUEST...</div>';
}

function showError(container, message) {
    container.innerHTML = `<div class="cyber-error">${message}</div>`;
}

// Main Functions
async function searchUsername() {
    const username = document.getElementById('username-input').value.trim();
    const selectedPlatforms = Array.from(document.querySelectorAll('#platform-toggles input:checked'))
        .map(input => input.value);
    
    if (!username) {
        showError(usernameResults, 'USERNAME REQUIRED');
        return;
    }
    
    showLoading(usernameResults);
    try {
        const response = await fetch(ENDPOINTS.username, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                platforms: selectedPlatforms
            })
        });
        
        const data = await response.json();
        usernameResults.innerHTML = '';
        usernameResults.appendChild(createResultCard(data));
        updateSystemStatus('SCAN COMPLETE');
    } catch (error) {
        showError(usernameResults, 'CONNECTION ERROR');
        updateSystemStatus('ERROR', true);
    }
}

async function searchEmail() {
    const email = document.getElementById('email-input').value.trim();
    
    if (!email) {
        showError(emailResults, 'EMAIL REQUIRED');
        return;
    }
    
    showLoading(emailResults);
    try {
        const response = await fetch(ENDPOINTS.email, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        emailResults.innerHTML = '';
        emailResults.appendChild(createResultCard(data));
        updateSystemStatus('SCAN COMPLETE');
    } catch (error) {
        showError(emailResults, 'CONNECTION ERROR');
        updateSystemStatus('ERROR', true);
    }
}

async function analyzeImage() {
    const fileInput = document.getElementById('image-input');
    const file = fileInput.files[0];
    
    if (!file) {
        showError(imageResults, 'IMAGE FILE REQUIRED');
        return;
    }
    
    showLoading(imageResults);
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(ENDPOINTS.image, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        imageResults.innerHTML = '';
        imageResults.appendChild(createResultCard(data));
        updateSystemStatus('ANALYSIS COMPLETE');
    } catch (error) {
        showError(imageResults, 'PROCESSING ERROR');
        updateSystemStatus('ERROR', true);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateSystemStatus('OPERATIONAL');
    
    // Add cyberpunk-style console messages
    console.log('%c NETRUNNER OSINT AGGREGATOR v1.0.0 ', 
        'background: #f40; color: #000; padding: 5px; font-weight: bold;');
    console.log('%c SYSTEM INITIALIZED ', 
        'background: #0f8; color: #000; padding: 5px; font-weight: bold;');
});
