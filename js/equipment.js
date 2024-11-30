let selectedEquipmentId = null;
let selectedRow = null;

// Save new equipment
function saveEquipment() {
    const equipmentData = getFormData();
    if (equipmentData && selectedRow === null) {
       
        $.ajax({
            url: "http://localhost:8080/api/v1/equipments",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(equipmentData),
            success: function () {
                alert("Equipment added successfully.");
                resetForm();
                getAllEquipment();
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
    if (equipmentData && selectedRow !== null) {
        
        $.ajax({
            url: `http://localhost:8080/api/v1/equipments/${selectedEquipmentId}`, 
            method: "PATCH",
            contentType: "application/json",
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

// Fetch all equipment data (Read)
function getAllEquipment() {
    $.ajax({
        url: "http://localhost:8080/api/v1/equipments/all_equipments",  
        method: "GET",
        success: function (response) {
            const tbody = $('table tbody');
            tbody.empty();

            response.forEach(equipment => {
                const row = `
                    <tr data-id="${equipment.id}">
                        <td><input type="checkbox"></td>
                        <td>${equipment.equipmentCode}</td>
                        <td>${equipment.equipmentName}</td>
                        <td>${equipment.type}</td>
                        <td>${equipment.manufacturer}</td>
                        <td>${equipment.purchaseDate}</td>
                        <td>${equipment.details}</td>
                        <td>${equipment.image ? `<img src="${equipment.image}" alt="Equipment Image" width="50">` : "N/A"}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editEquipment(${equipment.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteEquipment(${equipment.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
        },
        error: function (error) {
            console.error("Error:", error);
            alert("Failed to fetch equipment data.");
        }
    });
}

// Edit Equipment (Populate form with data for editing)
function editEquipment(id) {
    selectedEquipmentId = id;

    $.ajax({
        url: `http://localhost:8080/api/v1/equipments/${id}`, 
        method: "GET",
        success: function (equipment) {
            $('#equipmentCode').val(equipment.equipmentCode);
            $('#equipmentName').val(equipment.equipmentName);
            $('#type').val(equipment.type);
            $('#manufacturer').val(equipment.manufacturer);
            $('#purchaseDate').val(equipment.purchaseDate);
            $('#details').val(equipment.details);
            $('#addEquipmentModal').modal('show');
        },
        error: function (error) {
            console.error("Error:", error);
            alert("Failed to fetch equipment details.");
        }
    });
}

// Delete Equipment
function deleteEquipment(id) {
    if (confirm("Are you sure you want to delete this equipment?")) {
        $.ajax({
            url: `http://localhost:8080/api/v1/equipments/${id}`, 
            method: "DELETE",
            success: function () {
                alert("Equipment deleted successfully!");
                getAllEquipment();
            },
            error: function (error) {
                console.error("Error:", error);
                alert("Failed to delete equipment.");
            }
        });
    }
}

// Form data extraction
function getFormData() {
    const equipmentCode = $('#equipmentCode').val();
    const equipmentName = $('#equipmentName').val();
    const type = $('#type').val();
    const manufacturer = $('#manufacturer').val();
    const purchaseDate = $('#purchaseDate').val();
    const details = $('#details').val();
    const image = $('#equipmentImage')[0].files[0];  // Handling file input

    if (equipmentCode && equipmentName && type && manufacturer && purchaseDate && details) {
        const formData = new FormData();
        formData.append('equipmentCode', equipmentCode);
        formData.append('equipmentName', equipmentName);
        formData.append('type', type);
        formData.append('manufacturer', manufacturer);
        formData.append('purchaseDate', purchaseDate);
        formData.append('details', details);
        if (image) {
            formData.append('image', image); // Append the image file if selected
        }

        return formData;
    }
    return null;
}

// Reset form
function resetForm() {
    $('#equipmentForm')[0].reset();
    selectedEquipmentId = null;
}

// Initialize the application
$(document).ready(function () {
    getAllEquipment();
});
