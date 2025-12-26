const baseUrl = 'https://graph.facebook.com/v24.0';

function showLoading(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function clearResults() {
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

function getTokenFromInput() {
    const tokenInput = document.getElementById('access-token-input');
    if (!tokenInput) {
        return '';
    }
    return tokenInput.value.trim();
}

function checkToken() {
    const token = getTokenFromInput();
    if (!token) {
        showError('please enter your access token');
        return false;
    }
    return true;
}

function disableButtons(disable) {
    const buttons = document.querySelectorAll('.fbgraph-btn');
    buttons.forEach(btn => {
        btn.disabled = disable;
    });
}

// fetches data on facebook api graph explore 
async function fetchData(url) {
    try {
        showLoading(true);
        disableButtons(true);
        clearResults();
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            let errorMsg = data.error.message || 'api error occurred';
            if (data.error.type === 'OAuthException') {
                if (data.error.code === 190 || data.error.code === 200 || errorMsg.toLowerCase().includes('invalid') || errorMsg.toLowerCase().includes('expired') || errorMsg.toLowerCase().includes('token')) {
                    errorMsg = 'Wrong access token please double check';
                } else if (errorMsg.toLowerCase().includes('permission')) {
                    errorMsg = 'permission error ' + errorMsg;
                }
            }
            throw new Error(errorMsg);
        }
        
        return data;
    } catch (error) {
        showError('failed to fetch data: ' + error.message);
        return null;
    } finally {
        showLoading(false);
        disableButtons(false);
    }
}

function formatFieldValue(value) {
    if (value === null || value === undefined) {
        return 'N/A';
    }
    if (typeof value === 'object') {
        if (value.name) {
            return value.name;
        }
        if (value.data && value.data.url) {
            return value.data.url;
        }
        if (value.min !== undefined && value.max !== undefined) {
            return value.min + ' - ' + value.max;
        }
        if (value.min !== undefined) {
            return value.min;
        }
        if (Array.isArray(value)) {
            return value.map(function(item) {
                if (typeof item === 'object' && item.name) {
                    return item.name;
                }
                return item;
            }).join(', ');
        }
        return JSON.stringify(value);
    }
    return value;
}

//display data dun sa webpage

function displayProfile(data) {
    const resultsContainer = document.getElementById('results-container');
    if (!resultsContainer || !data) return;
    
    const card = document.createElement('div');
    card.className = 'fbgraph-result-card';
    
    let fieldsHtml = '';
    const fieldOrder = ['id', 'name', 'email', 'birthday', 'age_range', 'gender', 'location', 'hometown', 'link', 'about', 'website', 'verified', 'cover', 'picture', 'work', 'education', 'relationship_status'];
    
    fieldOrder.forEach(field => {
        if (data[field] !== undefined && data[field] !== null) {
            let value = formatFieldValue(data[field]);
            let label = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
            
            if (field === 'age_range') {
                label = 'Age';
            }
            
            if (field === 'picture' && data.picture && data.picture.data) {
                fieldsHtml += '<div class="fbgraph-result-card-field"><span class="fbgraph-result-card-label">Profile Picture:</span><img src="' + data.picture.data.url + '" alt="Profile" class="fbgraph-result-card-image"></div>';
            } else if (field === 'cover' && data.cover && data.cover.source) {
                fieldsHtml += '<div class="fbgraph-result-card-field"><span class="fbgraph-result-card-label">Cover Photo:</span><img src="' + data.cover.source + '" alt="Cover" class="fbgraph-result-card-image"></div>';
            } else {
                fieldsHtml += '<div class="fbgraph-result-card-field"><span class="fbgraph-result-card-label">' + label + ':</span><span class="fbgraph-result-card-value">' + value + '</span></div>';
            }
        }
    });
    
    Object.keys(data).forEach(key => {
        if (fieldOrder.indexOf(key) === -1 && data[key] !== undefined && data[key] !== null) {
            let value = formatFieldValue(data[key]);
            let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
            fieldsHtml += '<div class="fbgraph-result-card-field"><span class="fbgraph-result-card-label">' + label + ':</span><span class="fbgraph-result-card-value">' + value + '</span></div>';
        }
    });
    
    card.innerHTML = '<div class="fbgraph-result-card-header"><h3 class="fbgraph-result-card-title">Profile Information</h3></div><div class="fbgraph-result-card-content">' + fieldsHtml + '</div>';
    
    resultsContainer.appendChild(card);
}

// gets user profile info using /me endpoint
async function getUserProfile() {
    if (!checkToken()) return;
    
    const token = getTokenFromInput();
    const fields = 'id,name,email,birthday,age_range,gender,location,hometown,link,about,website,verified,cover,picture,work,education,relationship_status';
    const url = baseUrl + '/me?fields=' + fields + '&access_token=' + token;
    const data = await fetchData(url);
    
    if (data) {
        displayProfile(data);
    }
}


function getTheme() {
    const savedTheme = localStorage.getItem('fbgraph-theme');
    return savedTheme || 'dark';
}

function setTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (theme === 'light') {
        body.classList.add('light-mode');
        if (themeToggle) {
            themeToggle.checked = true;
        }
    } else {
        body.classList.remove('light-mode');
        if (themeToggle) {
            themeToggle.checked = false;
        }
    }
    
    localStorage.setItem('fbgraph-theme', theme);
}

function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function initTheme() {
    const theme = getTheme();
    setTheme(theme);
}

function setupEventListeners() {
    const getProfileBtn = document.getElementById('get-profile-btn');
    const tokenInput = document.getElementById('access-token-input');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (getProfileBtn) {
        getProfileBtn.addEventListener('click', getUserProfile);
    }
    
    if (tokenInput) {
        tokenInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getUserProfile();
            }
        });
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
}

initTheme();
setupEventListeners();

