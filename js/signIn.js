$(document).ready(function() {
  $('#signin-form').on('submit', function(event) {
      event.preventDefault();
      userLogin();
  });
});

function userLogin() {
  const email = $("#email").val().trim();
  const password = $("#password").val().trim();

  if (!email || !password) {
      alert("Email and Password are required!");
      return;
  }

  $.ajax({
      url: "http://localhost:8080/api/v1/auth/authenticate",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
          email: email,
          password: password
      }),
      success: function(response) {
          if (response && response.data && response.data.token) {
              localStorage.setItem("token", response.data.token);
              alert("Login successful!");
              window.location.href = "/pages/dashboard.html";
          } else {
              alert("Invalid server response.");
          }
      },
      error: function(error) {
          console.error("Error during login:", error);
          alert("Login failed. Please check your email and password.");
      }
  });
}

document.getElementById("register-btn").addEventListener("click", function () {
    window.location.href = "/pages/signup.html";
});


function setLanguage(language) {
    const languageBtn = document.getElementById('language-btn');
    if (language === 'en') {
        languageBtn.textContent = 'English';
        updateLabels('en');
    } else if (language === 'si') {
        languageBtn.textContent = 'සිංහල';
        updateLabels('si');
    }
    // Close the modal
    const languageModal = document.getElementById('languageModal');
    const modalInstance = bootstrap.Modal.getInstance(languageModal);
    modalInstance.hide();
}

// Update labels based on selected language
function updateLabels(language) {
    const labels = {
        en: {
            emailLabel: 'Enter Email',
            passwordLabel: 'Password',
            termsLabel: 'I agree to all Terms, Privacy Policy, and Fees',
            signInBtn: 'Sign In',
            description: 'Our service combines ease and innovation, ensuring you enjoy the highest level of convenience and satisfaction',
        },
        si: {
            emailLabel: 'ඊමේල් ඇතුළත් කරන්න',
            passwordLabel: 'මුරපදය',
            termsLabel: 'සියලු කොන්දේසි, රහස්‍යතා ප්‍රතිපත්ති, සහ ගාස්තු අනුමත කරන්න',
            signInBtn: 'ප්‍රවිෂ්ට වන්න',
            description: 'අපගේ සේවාව පහසුව සහ නව්‍යකරණය ඒකාබද්ධ කරමින්, ඔබට ඉහළම පහසුව සහ සෑහීම ලබා දෙයි',
        },
    };

    document.getElementById('email-label').textContent = labels[language].emailLabel;
    document.getElementById('password-label').textContent = labels[language].passwordLabel;
    document.getElementById('terms-label').textContent = labels[language].termsLabel;
    document.getElementById('sign-in-btn').textContent = labels[language].signInBtn;
    document.getElementById('description').textContent = labels[language].description;
}