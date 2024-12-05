// Store JWT token in localStorage
function storeJwtToken(token) {
    localStorage.setItem('jwtToken', token);
    console.log("JWT token saved:", token);
}

// Retrieve JWT token from localStorage
function getJwtToken() {
    const token = localStorage.getItem('jwtToken');
    console.log("JWT token retrieved:", token);
    return token;
}

// Decode JWT token to check expiry
function decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Check if JWT token exists and is valid (not expired)
function checkJwtToken() {
    const token = getJwtToken();
    console.log("Checking JWT token...");

    if (!token) {
        alert("JWT token missing or invalid. Please log in.");
        window.location.href = "/pages/index.html";
        return null;
    }

    const decoded = decodeJwt(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
        alert("JWT token expired. Please log in again.");
        localStorage.removeItem('jwtToken'); 
        window.location.href = "/pages/index.html";
        return null;
    }

    return token;
}

// Get form data for equipment
function getFormData() {
    const equipmentCode = $('#equipmentCode').val();
    const equipmentName = $('#equipmentName').val();
    const status = $('#status').val();
    const type = $('#equipmentType').val();

    if (!equipmentCode || !equipmentName || !status || !type) {
        alert("Please fill in all required fields.");
        return null;
    }

    return {
        equipmentCode: equipmentCode,
        equipmentName: equipmentName,
        status: status,
        type: type
    };
}

// Reset form fields
function resetForm() {
    $('#equipmentForm')[0].reset();
}

// Save new equipment
function saveEquipment() {
    const equipmentData = getFormData();
    const token = checkJwtToken();

    if (equipmentData && token) {
        $.ajax({
            url: `http://localhost:8080/cropMonitor/api/v1/equipments`,
            method: "POST",
            contentType: "application/json",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(equipmentData),
            success: function () {
                alert("Equipment added successfully.");
                resetForm();
                getAllEquipment();
                $('#addEquipmentModal').modal('hide');
            },
            error: function () {
                alert("Error adding equipment.");
            }
        });
    }
}

// Update existing equipment
function updateEquipment() {
    const equipmentData = getFormData();
    const equipmentCode = $('#equipmentCode').val(); // Assume this is populated somewhere
    const token = checkJwtToken();

    if (equipmentData && equipmentCode && token) {
        $.ajax({
            url: `http://localhost:8080/cropMonitor/api/v1/equipments/${equipmentCode}`,
            method: "PATCH",
            contentType: "application/json",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(equipmentData),
            success: function () {
                alert("Equipment updated successfully.");
                resetForm();
                getAllEquipment();
                $('#addEquipmentModal').modal('hide');
            },
            error: function () {
                alert("Error updating equipment.");
            }
        });
    }
}

// Delete equipment
function deleteEquipment() {
    const equipmentCode = $('#equipmentCode').val();
    const token = checkJwtToken();

    if (equipmentCode && token) {
        $.ajax({
            url: `http://localhost:8080/cropMonitor/api/v1/equipments/${equipmentCode}`,
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function () {
                alert("Equipment deleted successfully.");
                resetForm();
                getAllEquipment();
                $('#addEquipmentModal').modal('hide');
            },
            error: function () {
                alert("Error deleting equipment.");
            }
        });
    }
}

// Fetch all equipment
function getAllEquipment() {
    const token = checkJwtToken();

    if (token) {
        $.ajax({
            url: "http://localhost:8080/cropMonitor/api/v1/equipments/all_equipments",
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (data) {
                let tableBody = '';
                data.forEach(equipment => {
                    tableBody += `<tr>
                        <td><input type="checkbox" class="equipment-checkbox" data-id="${equipment.id}"></td>
                        <td>${equipment.equipmentCode}</td>
                        <td>${equipment.equipmentName}</td>
                        <td>${equipment.status}</td>
                        <td>${equipment.type}</td>
                        <td>
                          <button class="btn btn-warning btn-sm" onclick="editEquipment(this)">Edit</button>
                          <button class="btn btn-danger btn-sm" onclick="removeEquipment(this)">Delete</button>
                        </td>
                    </tr>`;
                });
                $('.tBody').html(tableBody);
            },
            error: function () {
                alert("Error fetching equipment.");
            }
        });
    }
}
// Edit Crop function
function editEquipment(button) {
    selectedRow = $(button).closest("tr");
    const equipmentData = {
        equipmentCode: $(selectedRow).find("td:eq(1)").text(),
        equipmentName: $(selectedRow).find("td:eq(2)").text(),
        status: $(selectedRow).find("td:eq(3)").text(),
        type: $(selectedRow).find("td:eq(4)").text(),
       
    };
    
    $("#equipmentCode").val(equipmentData.equipmentCode);
    $("#equipmentName").val(equipmentData.equipmentName);
    $("#status").val(equipmentData.status);
    $("#type").val(equipmentData.type);
}

// Remove Crop function
function removeEquipment(button) {
    const row = $(button).closest("tr");
    row.remove();
}
// Search equipment by name
function search() {
    const query = $('#searchInput').val().toLowerCase();

    $('.tBody tr').each(function () {
        const equipmentName = $(this).find('td:nth-child(3)').text().toLowerCase();
        if (equipmentName.includes(query)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// Event listener for selecting equipment checkboxes
$(document).on('change', '.equipment-checkbox', function () {
    const equipmentId = $(this).data('id');
    const isChecked = $(this).is(':checked');

    if (isChecked) {
        $('#equipmentCode').val(equipmentId);
       
    } else {
        $('#equipmentCode').val('');
    }
});

// Initialize the equipment table on page load
$(document).ready(function () {
    getAllEquipment();
});
