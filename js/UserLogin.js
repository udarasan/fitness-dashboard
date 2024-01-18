$('#btnLogin').click(function () {


    // Extract email and password
    let email = $('#email').val();
    let password = $('#password').val();

    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/login',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({ "email": email, "password": password }),  // Convert data to JSON string
        success: function(response) {
            console.log(response);
            alert("Login Successful!");
            localStorage.setItem("userEmail",email);
            window.location.href = '../user/index.html';
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Login Failed! Please check your credentials. Also, there might be an issue with the server.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});
