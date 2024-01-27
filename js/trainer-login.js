
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const buffer = await crypto.subtle.digest('SHA-256', data);
    const hashedArray = Array.from(new Uint8Array(buffer));
    const hashedPassword = hashedArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    console.log(hashedPassword);

    return hashedPassword;
}

$('#btnLogin').click(function () {


    // Extract email and password
    let email = $('#email').val();
    let password = $('#password').val();
    hashPassword(password)
        .then(hashedPassword => {
            console.log('Hashed Password:', hashedPassword);
            let newPassword = hashedPassword;
            console.log("new Pass word " + newPassword)
            $.ajax({
                url: 'http://localhost:8080/api/v1/trainer/login',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',  // Set content type to JSON
                data: JSON.stringify({"email": email, "password": newPassword}),  // Convert data to JSON string
                success: function (response) {
                    console.log(response);
                    alert("Login Successful!");
                    localStorage.setItem("trainer-email", email);
                    window.location.href = '../trainer/index.html';

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Login Failed! Please check your credentials. Also, there might be an issue with the server.");

                    console.error(jqXHR.responseText);  // Log the response text for debugging
                }
            });
        })
        .catch(error => {
            console.error('Error hashing password:', error);
        });
    // Make the AJAX request

});
$('#email').on('input', function () {
    let email = $(this).val();

    // Validate email
    if (!isValidEmail(email)) {
        $('#emailErrorLabel').text("Please enter a valid email address.");
    } else {
        $('#emailErrorLabel').text(""); // Clear the error label
    }
});