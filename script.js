// Wait for the entire webpage structure to load before running any JS
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MOBILE MENU LOGIC
    // ==========================================
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebarNav = document.getElementById('sidebar-nav');

    if (menuBtn && sidebarNav) {
        menuBtn.addEventListener('click', () => {
            sidebarNav.classList.toggle('active');
            const isExpanded = sidebarNav.classList.contains('active');
            menuBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    // ==========================================
    // 2. CONNECTING FRONTEND TO BACKEND ENGINE
    // ==========================================
    const BACKEND_URL = 'http://localhost:3000/api/subjects';
    const container = document.querySelector('.subject-container');
    const subjectForm = document.getElementById('subject-form');

    // GET FUNCTION: Fetches data from server and builds cards dynamically
    async function loadDashboardData() {
        try {
            const response = await fetch(BACKEND_URL);
            const jsonResponse = await response.json();

            if (jsonResponse.success) {
                container.innerHTML = ''; // Clear placeholder cards

                jsonResponse.data.forEach(item => {
                    const card = document.createElement('article');
                    card.className = 'card';
                    card.innerHTML = `
                        <h3>${item.name}</h3>
                        <p class="grade">Grade: ${item.grade}</p>
                    `;
                    container.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Network communication error:", error);
            container.innerHTML = `<p style="color: red;">Failed to fetch live database records from backend.</p>`;
        }
    }

    // POST FUNCTION: Captures form input, converts to JSON payload, sends to backend
    if (subjectForm) {
        subjectForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page refresh

            const nameInput = document.getElementById('subject-name');
            const gradeInput = document.getElementById('subject-grade');

            const payload = {
                name: nameInput.value,
                grade: gradeInput.value
            };

            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                // Note: Changed result.message check to handle your specific server response structure
                if (result.success) {
                    nameInput.value = '';
                    gradeInput.value = '';
                    loadDashboardData(); // Refresh UI dynamically
                } else {
                    alert(`Backend Refused: ${result.error || "Unknown error"}`);
                }

            } catch (error) {
                console.error("Error posting data:", error);
            }
        });
    }

    // Automatically execute the load operation when the dashboard mounts
    loadDashboardData();
});