function openDashboard() {
    const modal = document.getElementById('dashboardModal');
    const frame = document.getElementById('dashboardFrame');
    frame.src = 'projects/cyberpunk-dashboard/dist/index.html';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeDashboard() {
    const modal = document.getElementById('dashboardModal');
    const frame = document.getElementById('dashboardFrame');
    frame.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Update the window click handler to handle both modals
const originalWindowClick = window.onclick;
window.onclick = function(event) {
    const dashboardModal = document.getElementById('dashboardModal');
    if (event.target === dashboardModal) {
        closeDashboard();
    }
    // Call the original handler if it exists
    if (originalWindowClick) {
        originalWindowClick(event);
    }
};
