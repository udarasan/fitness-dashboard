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
        url: 'http://localhost:8080/api/v1/trainer/login',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({ "email": email, "password": password }),  // Convert data to JSON string
        success: function(response) {
            console.log(response);
            // Check if the login was successful (adjust this based on your API response)
            if (response.success) {
                // Redirect to the trainer dashboard
                window.location.href = '../pages/trainer/index.html';  // Adjust the URL accordingly
            } else {
                console.error('Login failed. Handle the error case.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});
