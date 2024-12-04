let selectedRow = null;

function storeJwtToken(token) {
    localStorage.setItem('jwtToken', token);
    console.log("JWT token saved:", token);
}

function getJwtToken() {
    const token = localStorage.getItem('jwtToken');
    console.log("JWT token retrieved:", token);
    return token;
}

// Save Vehicle
function saveVehicle() {
    const vehicleData = getFormData();
    if (vehicleData && selectedRow === null) {
        $.ajax({
            url: `http://localhost:8080/cropMonitor/api/v1/vehicles`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(vehicleData),
            headers: {
                'Authorization': `Bearer ${getJwtToken()}`,
                'Content-Type': 'application/json'
            },
            success: function (response) {
                alert("Vehicle saved successfully!");
                addTableRow(vehicleData);
                resetForm();
                $('#addVehicleModal').modal('hide');
            },
            error: function (error) {
                alert("Error saving vehicle: " + error.responseText);
            }
        });
    } else {
        alert("Please fill in all fields or use Update for existing entries.");
    }
}

// Update Vehicle
function updateVehicle() {
    const vehicleData = getFormData();
    if (vehicleData && selectedRow !== null) {
        const vehicleCode = $(selectedRow).find("td:eq(1)").text();
        $.ajax({
            url: `http://localhost:8080/cropMonitor/api/v1/vehicles/${vehicleCode}`,
            type: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(vehicleData),
            headers: {
                'Authorization': `Bearer ${getJwtToken()}`,
                'Content-Type': 'application/json'
            },
            success: function (response) {
                alert("Vehicle updated successfully!");
                updateTableRow(selectedRow, vehicleData);
                resetForm();
                $('#addVehicleModal').modal('hide');
            },
            error: function (error) {
                alert("Error updating vehicle: " + error.responseText);
            }
        });
    } else {
        alert("Select a vehicle to update.");
    }
}

// Delete Vehicle
function deleteVehicle() {
    if (selectedRow !== null) {
        const vehicleCode = $(selectedRow).find("td:eq(1)").text();
        $.ajax({
            url: `http://localhost:8080/cropMonitor/api/v1/vehicles/${vehicleCode}`,
            type: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getJwtToken()}`,
                'Content-Type': 'application/json'
            },
            success: function (response) {
                alert("Vehicle deleted successfully!");
                $(selectedRow).remove();
                resetForm();
                $('#addVehicleModal').modal('hide');
            },
            error: function (error) {
                alert("Error deleting vehicle: " + error.responseText);
            }
        });
    } else {
        alert("Select a vehicle to delete.");
    }
}

// Get All Vehicles
function getAllVehicles() {
    $.ajax({
        url: `http://localhost:8080/cropMonitor/api/v1/vehicles/all_vehicles`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${getJwtToken()}`,
            'Content-Type': 'application/json'
        },
        success: function (response) {
            $('table tbody').empty();
            response.forEach(vehicle => {
                addTableRow(vehicle);
            });
        },
        error: function (error) {
            alert("Error fetching vehicles: " + error.responseText);
        }
    });
}

// Edit Vehicle
function editVehicle(button) {
    selectedRow = $(button).closest('tr');
    $('#vehicleCode').val($(selectedRow).find("td:eq(1)").text());
    $('#licensePlate').val($(selectedRow).find("td:eq(2)").text());
    $('#category').val($(selectedRow).find("td:eq(3)").text());
    $('#fuelType').val($(selectedRow).find("td:eq(4)").text());
    $('#status').val($(selectedRow).find("td:eq(5)").text());
    $('#remarks').val($(selectedRow).find("td:eq(6)").text());
}

// Add Row to Vehicle Table
function addTableRow(vehicle) {
    const row = `<tr>
        <td><input type="checkbox" onclick="selectRow(this)"></td>
        <td>${vehicle.vehicleCode}</td>
        <td>${vehicle.licensePlate}</td>
        <td>${vehicle.category}</td>
        <td>${vehicle.fuelType}</td>
        <td>${vehicle.status}</td>
        <td>${vehicle.remarks}</td>
        <td>
            <button class="btn btn-info" onclick="editVehicle(this)">Edit</button>
            <button class="btn btn-danger" onclick="deleteVehicle()">Delete</button>
        </td>
    </tr>`;
    $('table tbody').append(row);
}

// Update Row in Vehicle Table
function updateTableRow(row, vehicle) {
    $(row).find("td:eq(1)").text(vehicle.vehicleCode);
    $(row).find("td:eq(2)").text(vehicle.licensePlate);
    $(row).find("td:eq(3)").text(vehicle.category);
    $(row).find("td:eq(4)").text(vehicle.fuelType);
    $(row).find("td:eq(5)").text(vehicle.status);
    $(row).find("td:eq(6)").text(vehicle.remarks);
}

// Get Form Data
function getFormData() {
    const vehicleCode = $('#vehicleCode').val().trim();
    const licensePlate = $('#licensePlate').val().trim();
    const category = $('#category').val();
    const fuelType = $('#fuelType').val();
    const status = $('#status').val();
    const remarks = $('#remarks').val().trim();

    if (vehicleCode && licensePlate && category && fuelType && status && remarks) {
        return {
            vehicleCode,
            licensePlate,
            category,
            fuelType,
            status,
            remarks
        };
    }
    return null;
}

// Reset Form
function resetForm() {
    $('#vehicleCode').val('');
    $('#licensePlate').val('');
    $('#category').val('');
    $('#fuelType').val('');
    $('#status').val('');
    $('#remarks').val('');
    selectedRow = null;
}

// Select Row in Table
function selectRow(checkbox) {
    if (checkbox.checked) {
        selectedRow = $(checkbox).closest('tr');
    } else {
        selectedRow = null;
    }
}
// Initialize the vehicle table on page load
$(document).ready(function () {
    getAllVehicles(); 
});
