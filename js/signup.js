$(document).ready(function() {

    $('#signupForm').on('submit', function(event) {
        event.preventDefault();
        userRegistration();
    });
});


function userRegistration() {
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();
    const role = $('#role').val().trim(); 

    
    if (!email || !password || !role) {
        alert('Please fill in all fields.');
        return;
    }

    $.ajax({
        url: "http://localhost:8080/cropMonitor/api/v1/auth/signup",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            email: email,
            password: password,
            role: role
        }),
        success: function(response) {
            alert('Signup successful!');
            console.log(response);
            localStorage.setItem('jwtToken', response.token);

            $("#message").text("Registration successful!")
                .removeClass("text-danger").addClass("text-success");

            $('#signupForm')[0].reset();
        },
        error: function(error) {
            console.log(error);
            $("#message").text("Registration failed!")
                .removeClass("text-success").addClass("text-danger");
        }
    });
}
