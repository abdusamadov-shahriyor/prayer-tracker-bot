// Prayer Tracker Mini App - Main JavaScript
// Telegram WebApp Integration

// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Apply Telegram theme
if (tg.colorScheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Prayer names
const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_DISPLAY = {
    fajr: '🌅 Fajr',
    dhuhr: '☀️ Dhuhr',
    asr: '🌤️ Asr',
    maghrib: '🌆 Maghrib',
    isha: '🌙 Isha'
};

// Current state
let currentDate = new Date();
let prayerData = {};
let qazaDebt = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
let currentStreak = 0;

// Telegram Cloud Storage wrapper
const CloudStorage = {
    async get(key) {
        return new Promise((resolve) => {
            if (!tg.CloudStorage) {
                // Fallback to localStorage for testing
                resolve(localStorage.getItem(key));
                return;
            }
            tg.CloudStorage.getItem(key, (error, value) => {
                if (error) {
                    console.error('CloudStorage get error:', error);
                    resolve(null);
                } else {
                    resolve(value);
                }
            });
        });
    },
    
    async set(key, value) {
        return new Promise((resolve) => {
            if (!tg.CloudStorage) {
                // Fallback to localStorage for testing
                localStorage.setItem(key, value);
                resolve(true);
                return;
            }
            tg.CloudStorage.setItem(key, value, (error, success) => {
                if (error) {
                    console.error('CloudStorage set error:', error);
                    resolve(false);
                } else {
                    resolve(success);
                }
            });
        });
    },
    
    async getKeys(prefix = '') {
        return new Promise((resolve) => {
            if (!tg.CloudStorage) {
                // Fallback to localStorage
                const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
                resolve(keys);
                return;
            }
            tg.CloudStorage.getKeys((error, keys) => {
                if (error) {
                    console.error('CloudStorage getKeys error:', error);
                    resolve([]);
                } else {
                    const filtered = prefix ? keys.filter(k => k.startsWith(prefix)) : keys;
                    resolve(filtered);
                }
            });
        });
    }
};

// Date helpers
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateDisplay(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function isToday(date) {
    const today = new Date();
    return formatDate(date) === formatDate(today);
}

function isFutureDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
}

// Initialize app
async function initApp() {
    console.log('Initializing Prayer Tracker...');
    
    // Load data from cloud storage
    await loadAllData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI
    updateDateDisplay();
    updatePrayerUI();
    updateStreakDisplay();
    
    // Handle deep links (e.g., /stats, /heatmap)
    handleDeepLink();
    
    console.log('App initialized successfully');
    
    // Send ready signal to Telegram
    tg.ready();
}

// Load all data from cloud storage
async function loadAllData() {
    try {
        // Load prayer data
        const prayerDataStr = await CloudStorage.get('prayer_data');
        if (prayerDataStr) {
            prayerData = JSON.parse(prayerDataStr);
        }
        
        // Load qaza debt
        const qazaDataStr = await CloudStorage.get('qaza_debt');
        if (qazaDataStr) {
            qazaDebt = JSON.parse(qazaDataStr);
        }
        
        // Calculate streak
        currentStreak = calculateStreak();
        
        console.log('Data loaded:', { prayers: Object.keys(prayerData).length, qaza: qazaDebt });
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Save prayer data
async function savePrayerData() {
    try {
        await CloudStorage.set('prayer_data', JSON.stringify(prayerData));
        console.log('Prayer data saved');
    } catch (error) {
        console.error('Error saving prayer data:', error);
    }
}

// Save qaza debt
async function saveQazaDebt() {
    try {
        await CloudStorage.set('qaza_debt', JSON.stringify(qazaDebt));
        console.log('Qaza debt saved');
    } catch (error) {
        console.error('Error saving qaza debt:', error);
    }
}

// Update date display
function updateDateDisplay() {
    const dateStr = formatDateDisplay(currentDate);
    document.getElementById('currentDate').textContent = dateStr;
    
    // Disable future dates
    const nextBtn = document.getElementById('nextDay');
    if (isToday(currentDate)) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
    } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
    }
}

// Update prayer UI for current date
function updatePrayerUI() {
    const dateKey = formatDate(currentDate);
    const dayData = prayerData[dateKey] || {};
    
    PRAYERS.forEach(prayer => {
        const card = document.querySelector(`.prayer-card[data-prayer="${prayer}"]`);
        const buttons = card.querySelectorAll('.status-btn');
        const currentStatus = dayData[prayer];
        
        buttons.forEach(btn => {
            const status = btn.dataset.status;
            if (status === currentStatus) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    });
    
    // Load notes
    const notes = dayData.notes || '';
    document.getElementById('dailyNotes').value = notes;
    
    // Disable future dates
    const isFuture = isFutureDate(currentDate);
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.disabled = isFuture;
        btn.style.opacity = isFuture ? '0.5' : '1';
    });
    document.getElementById('dailyNotes').disabled = isFuture;
}

// Handle prayer status selection
function handlePrayerStatus(prayer, status) {
    if (isFutureDate(currentDate)) {
        tg.showAlert('Cannot log prayers for future dates');
        return;
    }
    
    const dateKey = formatDate(currentDate);
    
    // Initialize day data if needed
    if (!prayerData[dateKey]) {
        prayerData[dateKey] = {};
    }
    
    const currentStatus = prayerData[dateKey][prayer];
    
    // Toggle: if clicking same status, remove it
    if (currentStatus === status) {
        // Remove status
        if (currentStatus === 'missed') {
            // Remove from qaza debt
            qazaDebt[prayer] = Math.max(0, qazaDebt[prayer] - 1);
            saveQazaDebt();
        }
        delete prayerData[dateKey][prayer];
    } else {
        // Update to new status
        if (status === 'missed') {
            // Add to qaza debt
            qazaDebt[prayer] = (qazaDebt[prayer] || 0) + 1;
            saveQazaDebt();
        }
        
        // If changing from missed to something else, reduce qaza debt
        if (currentStatus === 'missed') {
            qazaDebt[prayer] = Math.max(0, qazaDebt[prayer] - 1);
            saveQazaDebt();
        }
        
        prayerData[dateKey][prayer] = status;
    }
    
    savePrayerData();
    updatePrayerUI();
    
    // Recalculate streak
    currentStreak = calculateStreak();
    updateStreakDisplay();
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Calculate current streak
function calculateStreak() {
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    while (true) {
        const dateKey = formatDate(checkDate);
        const dayData = prayerData[dateKey];
        
        if (!dayData) break;
        
        // Check if all 5 prayers are logged
        const prayersLogged = PRAYERS.filter(p => dayData[p]).length;
        if (prayersLogged < 5) break;
        
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
}

// Update streak display
function updateStreakDisplay() {
    document.getElementById('streakCount').textContent = currentStreak;
    
    // Check for milestones
    const milestones = [7, 30, 100, 365];
    if (milestones.includes(currentStreak)) {
        showMilestoneMessage(currentStreak);
    }
}

// Show milestone message
function showMilestoneMessage(days) {
    const messages = {
        7: '🎉 Amazing! 7-day streak!',
        30: '🌟 Incredible! 30-day streak!',
        100: '🏆 Phenomenal! 100-day streak!',
        365: '👑 LEGENDARY! 1 YEAR STREAK!'
    };
    
    if (tg.showPopup) {
        tg.showPopup({
            title: 'Milestone Achieved!',
            message: messages[days] || `${days} days streak!`,
            buttons: [{ type: 'ok' }]
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });
    
    // Date navigation
    document.getElementById('prevDay').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
        updatePrayerUI();
    });
    
    document.getElementById('nextDay').addEventListener('click', () => {
        if (!isToday(currentDate)) {
            currentDate.setDate(currentDate.getDate() + 1);
            updateDateDisplay();
            updatePrayerUI();
        }
    });
    
    document.getElementById('todayBtn').addEventListener('click', () => {
        currentDate = new Date();
        updateDateDisplay();
        updatePrayerUI();
    });
    
    // Prayer status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prayer = e.target.closest('.prayer-card').dataset.prayer;
            const status = e.target.dataset.status;
            handlePrayerStatus(prayer, status);
        });
    });
    
    // Notes textarea
    document.getElementById('dailyNotes').addEventListener('change', (e) => {
        const dateKey = formatDate(currentDate);
        if (!prayerData[dateKey]) {
            prayerData[dateKey] = {};
        }
        prayerData[dateKey].notes = e.target.value;
        savePrayerData();
    });
}

// Switch between views
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Deactivate all nav buttons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Show selected view
    document.getElementById(`${viewName}-view`).classList.add('active');
    
    // Activate nav button
    document.querySelector(`.nav-btn[data-view="${viewName}"]`).classList.add('active');
    
    // Load view content
    if (viewName === 'analytics') {
        loadAnalytics();
    } else if (viewName === 'heatmap') {
        loadHeatmap();
    } else if (viewName === 'qaza') {
        loadQazaTracker();
    }
}

// Load analytics view
function loadAnalytics() {
    const content = document.getElementById('analyticsContent');
    
    // Calculate stats
    const totalDays = Object.keys(prayerData).length;
    const totalPrayers = Object.values(prayerData).reduce((sum, day) => {
        return sum + PRAYERS.filter(p => day[p]).length;
    }, 0);
    
    const ontimePrayers = Object.values(prayerData).reduce((sum, day) => {
        return sum + PRAYERS.filter(p => day[p] === 'ontime').length;
    }, 0);
    
    const jamatPrayers = Object.values(prayerData).reduce((sum, day) => {
        return sum + PRAYERS.filter(p => day[p] === 'jamat').length;
    }, 0);
    
    const completionRate = totalDays > 0 ? ((totalPrayers / (totalDays * 5)) * 100).toFixed(1) : 0;
    
    content.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${totalDays}</div>
                <div class="stat-label">Days Tracked</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalPrayers}</div>
                <div class="stat-label">Total Prayers</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${ontimePrayers}</div>
                <div class="stat-label">On-Time</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${jamatPrayers}</div>
                <div class="stat-label">In Jamat</div>
            </div>
        </div>
        
        <div class="report-section">
            <h3>📊 Completion Rate</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${completionRate}%"></div>
            </div>
            <p style="text-align: center; margin-top: 10px;">${completionRate}% of prayers logged</p>
        </div>
        
        <div class="report-section">
            <h3>🔥 Current Streak</h3>
            <p style="font-size: 48px; text-align: center; margin: 20px 0;">${currentStreak} days</p>
        </div>
    `;
}

// Load heatmap view
function loadHeatmap() {
    const content = document.getElementById('heatmapContent');
    content.innerHTML = '<div class="heatmap-loading">Heatmap view coming soon...</div>';
}

// Load qaza tracker view
function loadQazaTracker() {
    const content = document.getElementById('qazaContent');
    
    const totalDebt = Object.values(qazaDebt).reduce((sum, count) => sum + count, 0);
    
    let html = `
        <div class="report-section" style="text-align: center; margin-bottom: 30px;">
            <h3>Total Qaza Debt</h3>
            <div style="font-size: 48px; color: var(--missed-color); font-weight: bold;">${totalDebt}</div>
            <p>prayers to make up</p>
        </div>
        
        <div class="qaza-grid">
    `;
    
    PRAYERS.forEach(prayer => {
        const count = qazaDebt[prayer] || 0;
        html += `
            <div class="qaza-card">
                <div class="qaza-info">
                    <div class="qaza-prayer-name">${PRAYER_DISPLAY[prayer]}</div>
                    <div class="qaza-count">${count} missed</div>
                </div>
                <div class="qaza-actions">
                    <button onclick="makeUpQaza('${prayer}')" ${count === 0 ? 'disabled' : ''}>
                        Made Up 1
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

// Make up qaza prayer
window.makeUpQaza = function(prayer) {
    if (qazaDebt[prayer] > 0) {
        qazaDebt[prayer]--;
        saveQazaDebt();
        loadQazaTracker();
        
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
        
        tg.showAlert(`Alhamdulillah! ${PRAYER_DISPLAY[prayer]} made up. ${qazaDebt[prayer]} remaining.`);
    }
};

// Handle deep links
function handleDeepLink() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        switchView(hash);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
