$(document).ready(function() {
    $('#signupForm').on('submit', function(event) {
        event.preventDefault();
        userRegistration();
    });
});

function userRegistration() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/auth/register",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            'fullName': fullName,
            'email': email,
            'password': password
        }),
        success: function(response) {
            alert('Signup successful!');
            console.log(response);
            localStorage.setItem("token", response.data.token);
            $("#message").text("Registration successful!").removeClass("text-danger").addClass("text-success");
            $('#signupForm')[0].reset();
        },
        error: function(error) {
            console.log(error);
            $("#message").text("Registration failed!").removeClass("text-success").addClass("text-danger");
        }
    });
}
