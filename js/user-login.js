async function hashPassword(password) {
    const base64Encoded = btoa(password);
    console.log(base64Encoded);
    return base64Encoded;
}

$('#btnLogin').click(function () {

    let email = $('#email').val();
    let password = $('#password').val();

    hashPassword(password)
        .then(hashedPassword => {
            console.log('Hashed Password:', hashedPassword);
            let newPassword = hashedPassword;
            console.log("new Pass word " + newPassword)
            $.ajax({
                url: 'http://localhost:8080/api/v1/user/login',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',  // Set content type to JSON
                data: JSON.stringify({"email": email, "password": newPassword}),  // Convert data to JSON string
                success: function (response) {
                    console.log(response);
                    alert("Login Successful!");
                    localStorage.setItem("userEmail", email);
                    window.location.href = '../user/index.html';
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Login Failed! Please check your credentials. Also, there might be an issue with the server.");
                    console.error(jqXHR.responseText);
                }
            });
        })
        .catch(error => {
            console.error('Error hashing password:', error);
        });
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }


    if (!password) {
        alert("Please enter your password.");

    }


});

//validate email
$('#email').on('input', function () {
    let email = $(this).val();

    // Validate email
    if (!isValidEmail(email)) {
        $('#emailErrorLabel').text("Please enter a valid email address.");
    } else {
        $('#emailErrorLabel').text("");
    }
});
