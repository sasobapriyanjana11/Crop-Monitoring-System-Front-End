
document.addEventListener("DOMContentLoaded", () => {
    getAllFields();
});

// Save new field
function saveField() {
    const fieldData = getFieldData();

    if (fieldData && selectedRow === null) {
        const formData = new FormData();

        
        formData.append('fieldCode', fieldData.fieldCode);
        formData.append('name', fieldData.name);
        formData.append('extentSize', fieldData.extentSize);
        formData.append('location', fieldData.location);
        formData.append('equipmentCode', fieldData.equipmentCode);

        // Append image files 
        const img1 = $('#image1')[0].files[0];
        const img2 = $('#image2')[0].files[0];

        if (img1) formData.append('image1', img1);
        if (img2) formData.append('image2', img2);

        $.ajax({
            url: "http://localhost:8080/cropMonitor/api/v1/fields",  
            method: "POST",
            data: formData,
            processData: false,  
            contentType: false,  
            success: function () {
                alert("Field added successfully.");
                resetForm();
                getAllFields();
            },
            error: function () {
                alert("Error adding field.");
            }
        });
    }
}

// Update existing field
function updateField() {
    const fieldData = getFieldData();

    if (fieldData && selectedRow !== null) {
        const formData = new FormData();
        const fieldCode = $(selectedRow).find("td:eq(1)").text();  

        
        formData.append('fieldCode', fieldData.fieldCode);
        formData.append('fieldName', fieldData.fieldName); 
        formData.append('fieldSize', fieldData.fieldSize); 
        formData.append('fieldLocation', fieldData.fieldLocation);  
        formData.append('equipmentCode', fieldData.equipmentCode);
        
        // Append image files if available
        const img1 = $('#fieldImage1')[0].files[0];  
        const img2 = $('#fieldImage2')[0].files[0]; 
        
        if (img1) formData.append('fieldImage1', img1); 
        if (img2) formData.append('fieldImage2', img2); 

        $.ajax({
            url: "http://localhost:8080/cropMonitor/api/v1/fields/${fieldCode}",  
            method: "PATCH",
            data: formData,
            processData: false,  
            contentType: false, 
            success: function () {
                alert("Field updated successfully.");
                resetForm();
                getAllFields();
                $('#addFieldModal').modal('hide');
            },
            error: function () {
                alert("Error updating field.");
            }
        });
    }
}

// Fetch all fields data
function getAllFields() {
    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/fields", 
        method: "GET",
        success: function (response) {
            const tbody = $('table tbody');
            tbody.empty();

            response.forEach(field => {
                const row = `
                <tr data-id="${field.fieldCode}">
                    <td><input type="checkbox"></td>
                    <td>${field.fieldCode}</td>
                    <td>${field.fieldName}</td>  <!-- Use fieldName instead of name -->
                    <td>${field.fieldSize}</td>  <!-- Use fieldSize instead of extentSize -->
                    <td>${field.fieldLocation || 'N/A'}</td>  <!-- Use fieldLocation, show N/A if undefined -->
                    <td>${field.image1 ? `<img src="${field.image1}" alt="Image 1" width="50" height="50">` : 'N/A'}</td>
                    <td>${field.image2 ? `<img src="${field.image2}" alt="Image 2" width="50" height="50">` : 'N/A'}</td>
                    <td>${field.equipmentCode}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editField('${field.fieldCode}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteField('${field.fieldCode}')">Delete</button>
                    </td>
                </tr>
            `;
                tbody.append(row);
            });
        },
        error: function (error) {
            console.error("Error:", error);
            alert("Failed to fetch fields data.");
        }
    });
}

// Edit Field 
function editField(fieldCode) {
    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/fields/${fieldCode}",  
        method: "GET",
        success: function (field) {
            $('#fieldCode').val(field.fieldCode);
            $('#fieldName').val(field.name);
            $('#extentSize').val(field.extentSize);
            $('#fieldLocation').val(field.location);
            $('#equipmentCode').val(field.equipmentCode);

            
            $('#img1').val('');
            $('#img2').val('');

            
            if (field.image1) {
                $('#img1Preview').html(`<img src="${field.image1}" alt="Image 1" width="100" height="100">`);
            }
            if (field.image2) {
                $('#img2Preview').html(`<img src="${field.image2}" alt="Image 2" width="100" height="100">`);
            }

            $('#addFieldModal').modal('show');
        },
        error: function (error) {
            console.error("Error:", error);
            alert("Failed to fetch field details.");
        }
    });
}

// Delete Field
function deleteField(fieldCode) {
    if (confirm("Are you sure you want to delete this field?")) {
        $.ajax({
            url: "http://localhost:8080/cropMonitor/api/v1/fields/${fieldCode}",  
            method: "DELETE",
            success: function () {
                alert("Field deleted successfully!");
                getAllFields();
            },
            error: function (error) {
                console.error("Error:", error);
                alert("Failed to delete field.");
            }
        });
    }
}

// Get data from the form
function getFieldData() {
    var formData = new FormData();

    // Append the form fields to the formData object
    formData.append('fieldCode', $('#fieldCode').val());
    formData.append('fieldName', $('#fieldName').val());
    formData.append('fieldSize', parseFloat($('#fieldSize').val())); 
    formData.append('latitude', parseFloat($('#latitude').val())); 
    formData.append('longitude', parseFloat($('#longitude').val())); 
    formData.append('fieldImage1', $('#image1')[0].files[0]); 
    formData.append('fieldImage2', $('#image2')[0].files[0]); 
    formData.append('equipmentCode', $('#equipmentCode').val());

    return formData;
}

// Reset form
function resetForm() {
    $('#fieldForm')[0].reset();
    selectedRow = null;
    $('#img1Preview').html('');
    $('#img2Preview').html('');
}

// Initialize the application
$(document).ready(function () {
    getAllFields();
});

