$(document).ready(function() {
    // Attach the form submission handler
    $('#signupForm').on('submit', function(event) {
        event.preventDefault();
        userRegistration();
    });
});

// Function to handle user registration
function userRegistration() {
    // Get form input values
    // const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value; // Get role value
     //!fullName ||
    // Validate form fields
    if ( !email || !password || !confirmPassword || !role) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // AJAX request to register the user
    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/auth/signup",  
        method: "POST",
        contentType: "application/json",  
        data: JSON.stringify({
            // 'fullName': fullName,
            'email': email,
            'password': password,
            'role': role  
        }),
        success: function(response) {
            // On successful registration
            alert('Signup successful!');
            console.log(response);

            // Save JWT token in localStorage for future requests
            localStorage.setItem("token", response.data.token);

            
            $("#message").text("Registration successful!").removeClass("text-danger").addClass("text-success");

            
            $('#signupForm')[0].reset();
        },
        error: function(error) {
            // On error (registration failed)
            console.log(error);

            
            $("#message").text("Registration failed!").removeClass("text-success").addClass("text-danger");
        }
    });
}
