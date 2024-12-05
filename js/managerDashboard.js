document.addEventListener("DOMContentLoaded", () => {
    initializeSidebar();
    fetchDashboardCounts();
});


function initializeSidebar() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const sidebar = document.querySelector(".sidebar");

    hamburgerBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}

// Fetch data for dashboard counts
function fetchDashboardCounts() {
    fetchCropCount();
    fetchFieldCount();
    fetchUserCount(); 
}

// Fetch and update crop count
function fetchCropCount() {
    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/crops/allcrops",
        method: "GET",
        success: function (response) {
            console.log("Crop Data: ", response);  
            const cropCount = response.length;
            document.getElementById("cropCount").textContent = cropCount;
        },
        error: function () {
            console.error("Error fetching crop data");
            document.getElementById("cropCount").textContent = "N/A";
        }
    });
}

// Fetch and update field count
function fetchFieldCount() {
    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/fields",
        method: "GET",
        success: function (response) {
            console.log("Field Data: ", response);  
            const fieldCount = response.length;
            document.getElementById("fieldCount").textContent = fieldCount;
        },
        error: function () {
            console.error("Error fetching field data");
            document.getElementById("fieldCount").textContent = "N/A";
        }
    });
}

// Fetch and update user count 
function fetchUserCount() {
    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/user", 
        method: "GET",
        success: function (response) {
            const userCount = response.length;
            document.getElementById("userCount").textContent = userCount;
        },
        error: function () {
            console.error("Error fetching user data");
            document.getElementById("userCount").textContent = "N/A";
        }
    });
}
