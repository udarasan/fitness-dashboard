$('#btnLogin').click(function () {
    // Serialize form data into an object


    // Extract email and password
    let email = $('#email').val();
    let password = $('#password').val();

    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/login',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({ "email": email, "password": password }),  // Convert data to JSON string
        success: function(response) {
            console.log(response)
            window.location.href = '../admin/index.html';
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});
