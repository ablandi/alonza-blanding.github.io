// OSINT Aggregator Functions
async function launchOSINTAggregator() {
    const modal = document.getElementById('osintModal');
    const iframe = document.getElementById('osintFrame');
    
    try {
        // Try to start the server if it's not running
        const response = await fetch('http://localhost:8000/api/health-check');
        if (response.ok) {
            iframe.src = 'http://localhost:8000/static/index.html';
            modal.style.display = 'block';
        }
    } catch (error) {
        alert('Please start the OSINT Aggregator server first.\n\nTo start the server:\n1. Open the osint-aggregator folder\n2. Double-click start_server.bat\n3. Try launching again');
    }
}

function closeOSINTModal() {
    const modal = document.getElementById('osintModal');
    const iframe = document.getElementById('osintFrame');
    iframe.src = '';
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('osintModal');
    if (event.target === modal) {
        closeOSINTModal();
    }
}