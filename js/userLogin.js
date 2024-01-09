$('#btnLogin').click(function () {
    // Serialize form data into an object
    let formData = $('#loginForm').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    // Extract email and password
    let email = formData.email;
    let password = formData.password;

    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/login',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({ "email": email, "password": password }),  // Convert data to JSON string
        success: function(response) {
            console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});
