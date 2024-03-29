$('#btnLogin').click(function () {
    let email = $('#email').val();
    let password = $('#password').val();
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }
    if (!password) {
        alert("Please enter your password.");
        return;
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/login',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"email": email, "password": password}),  // Convert data to JSON string
        success: function (response) {
            console.log(response)
            localStorage.setItem("adminEmail", email);
            alert("Login Successful!");
            window.location.href = '../admin/index.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Login Failed! Please check your credentials. Also, there might be an issue with the server.");

            console.error(jqXHR.responseText);
        }
    });
});
$('#email').on('input', function () {
    let email = $(this).val();

    // Validate email
    if (!isValidEmail(email)) {
        $('#emailErrorLabel').text("Please enter a valid email address.");
    } else {
        $('#emailErrorLabel').text("");
    }
});