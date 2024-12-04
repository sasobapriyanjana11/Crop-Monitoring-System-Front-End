let selectedRow = null;

// Save Staff function
function saveStaff() {
    const staffData = getStaffData();
    if (staffData && selectedRow === null) {
        $.ajax({
            url: `http://localhost:8080/cropMonitor/api/v1/staff`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(staffData),
            success: function () {
                alert("Staff added successfully.");
                resetForm();
                getAllStaff(); 
            },
            error: function () {
                alert("Error adding staff.");
            }
        });
    }
}

// Edit Staff function
function editStaff(td) {
    selectedRow = $(td).closest('tr');
    $('#staffId').val($(selectedRow).find("td:eq(1)").text());
    $('#firstName').val($(selectedRow).find("td:eq(2)").text());
    $('#lastName').val($(selectedRow).find("td:eq(3)").text());
    $('#designation').val($(selectedRow).find("td:eq(4)").text());
    $('#gender').val($(selectedRow).find("td:eq(5)").text());
    $('#joinDate').val($(selectedRow).find("td:eq(6)").text());
    $('#dob').val($(selectedRow).find("td:eq(7)").text());
    $('#contactNo').val($(selectedRow).find("td:eq(8)").text());
    $('#address').val($(selectedRow).find("td:eq(9)").text());
    $('#postalCode').val($(selectedRow).find("td:eq(10)").text());
    $('#email').val($(selectedRow).find("td:eq(11)").text());
    $('#equipmentCode').val($(selectedRow).find("td:eq(12)").text());
    $('#vehicleCode').val($(selectedRow).find("td:eq(13)").text());
    $('#addStaffModal').modal('show');
}

// Update Staff function
function updateStaff() {
    const staffData = getStaffData();
    if (staffData && selectedRow !== null) {
        const staffId = $(selectedRow).find("td:eq(1)").text(); 
        
        $.ajax({
            url: `http://localhost:8080/cropMonitor/api/v1/staff/${staffId}`,
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify(staffData),
            success: function () {
                alert("Staff updated successfully.");
                resetForm();
                getAllStaff();
                $('#addStaffModal').modal('hide');
            },
            error: function () {
                alert("Error updating staff.");
            }
        });
    }
}


$(document).on("click", "tr", function () {
    
    if (selectedRow && selectedRow.is(this)) {
        $(this).removeClass("selected");
        selectedRow = null;
        resetForm();
    } else {
        
        if (selectedRow) {
            selectedRow.removeClass("selected");
        }
        $(this).addClass("selected");
        selectedRow = $(this);

        
        const staffId = selectedRow.find("td:nth-child(2)").text();
        const firstName = selectedRow.find("td:nth-child(3)").text();
        const lastName = selectedRow.find("td:nth-child(4)").text();
        const designation = selectedRow.find("td:nth-child(5)").text();
        const gender = selectedRow.find("td:nth-child(6)").text();
        const joinDate = selectedRow.find("td:nth-child(7)").text();
        const dob = selectedRow.find("td:nth-child(8)").text();
        const address = selectedRow.find("td:nth-child(9)").text();
        const contactNo = selectedRow.find("td:nth-child(10)").text();
        const postalCode = selectedRow.find("td:nth-child(11)").text();
        const email = selectedRow.find("td:nth-child(12)").text();
        const equipmentCode = selectedRow.find("td:nth-child(13)").text();
        const vehicleCode = selectedRow.find("td:nth-child(14)").text();

        $('#staffId').val(staffId);
        $('#firstName').val(firstName);
        $('#lastName').val(lastName);
        $('#designation').val(designation);
        $('#gender').val(gender);
        $('#joinDate').val(joinDate);
        $('#dob').val(dob);
        $('#address').val(address);
        $('#contactNo').val(contactNo);
        $('#postalCode').val(postalCode);
        $('#email').val(email);
        $('#equipmentCode').val(equipmentCode);
        $('#vehicleCode').val(vehicleCode);
    }
});

// Get All Staff function
function getAllStaff() {
    $.ajax({
        url:`http://localhost:8080/cropMonitor/api/v1/staff/all_staff`,
        method: "GET",
        success: function (data) {
            const staffTableBody1 = $('table tbody').first(); // Part 1 table
            const staffTableBody2 = $('table tbody').last();  // Part 2 table
            staffTableBody1.empty(); 
            staffTableBody2.empty(); 
            data.forEach(staff => {
                // Part 1 Row
                const newRow1 = `
                    <tr>
                        <td><input type="checkbox"></td>
                        <td>${staff.staffId}</td>
                        <td>${staff.firstName}</td>
                        <td>${staff.lastName}</td>
                        <td>${staff.designation}</td>
                        <td>${staff.gender}</td>
                        <td>${staff.joinDate}</td>
                        <td>${staff.dob}</td>
                    </tr>
                `;
                staffTableBody1.append(newRow1);

                // Part 2 Row
                const newRow2 = `
                    <tr>
                        <td>${staff.address}</td>
                        <td>${staff.contactNo}</td>
                        <td>${staff.postalCode}</td>
                        <td>${staff.email}</td>
                        <td>${staff.equipmentCode}</td>
                        <td>${staff.vehicleCode}</td>
                    </tr>
                `;
                staffTableBody2.append(newRow2);
            });
        },
        error: function () {
            alert("Error fetching staff data.");
        }
    });
}

// Delete Staff function
function deleteStaff(staffId) {
    
    if (selectedRow !== null) {
        const staffId = $(selectedRow).find("td:eq(1)").text();
        $.ajax({
            url: `http://localhost:8080/cropMonitor/api/v1/staff/${staffId}`,
            type: 'DELETE',
            success: function () {
                alert("staff deleted successfully!");
                $(selectedRow).remove();
                getAllStaff();
            },
            error: function (error) {
                alert("Error deleting staff: " + error.responseText);
            }
        });
    } else {
        alert("Select a staff to delete.");
    }

}

// Get Staff Data from the form
function getStaffData() {
    return {
        staffId: $('#staffId').val(),
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        designation: $('#designation').val(),
        gender: $('#gender').val(),
        joinDate: $('#joinDate').val(),
        dob: $('#dob').val(),
        address: $('#address').val(),
        contactNo: $('#contactNo').val(),
        postalCode: $('#postalCode').val(),
        email: $('#email').val(),
        equipmentCode: $('#equipmentCode').val(),
        vehicleCode: $('#vehicleCode').val()
    };
}

// Reset form
function resetForm() {
    $('#staffForm')[0].reset();
    selectedRow = null;
}

// Load all staff on page load
$(document).ready(function () {
    getAllStaff();
});




