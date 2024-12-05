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

function fetchDashboardCounts() {
    fetchStaffCount();
    fetchVehicleCount();
    fetchEquipmentCount(); 
}

function fetchStaffCount() {
    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/staff/all_staff",
        method: "GET",
        success: function (response) {
            console.log("Staff Data: ", response);  
            const staffCount = response.length;
            document.getElementById("staffCount").textContent = staffCount;
        },
        error: function () {
            console.error("Error fetching staff data");
            document.getElementById("staffCount").textContent = "N/A";
        }
    });
}

function fetchVehicleCount() {
    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/vehicles/all_vehicles",
        method: "GET",
        success: function (response) {
            console.log("Vehicle Data: ", response);  
            const vehicleCount = response.length;
            document.getElementById("vehicleCount").textContent = vehicleCount;
        },
        error: function () {
            console.error("Error fetching vehicle data");
            document.getElementById("vehicleCount").textContent = "N/A";
        }
    });
}

function fetchEquipmentCount() {
    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/equipments/all_equipments", 
        method: "GET",
        success: function (response) {
            const equipmentCount = response.length;
            document.getElementById("equipmentCount").textContent = equipmentCount;
        },
        error: function () {
            console.error("Error fetching equipment data");
            document.getElementById("equipmentCount").textContent = "N/A";
        }
    });
}
