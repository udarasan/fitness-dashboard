async function hashPassword(password) {
    const base64Encoded = btoa(password);
    console.log(base64Encoded);
    return base64Encoded;
}
let usersEmail;
let trainersEmail;
let adminsEmail;
$('#btnLogin').click(function () {
    let email = $('#email').val();
    let password = $('#password').val();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: email},

        success: function (response) {
            console.log(response.data);
            usersEmail=response.data.email;
            hashPassword(password)
                .then(hashedPassword => {
                    console.log('Hashed Password:', hashedPassword);
                    let newPassword = hashedPassword;
                    console.log("new Password: " + newPassword);

                    // Perform login for trainer
                    if (email===usersEmail){
                        $.ajax({
                            url: 'http://localhost:8080/api/v1/user/login',
                            method: 'POST',
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify({"email": email, "password": newPassword}),
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
                    }
                })
                .catch(error => {
                    console.error('Error hashing password:', error);
                });
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    });
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getOneAdmin',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: email},

        success: function (response) {
            console.log(response.data);
            adminsEmail=response.data.email;
            hashPassword(password)
                .then(hashedPassword => {
                    console.log('Hashed Password:', hashedPassword);
                    let newPassword = hashedPassword;
                    console.log("new Password: " + newPassword);

               if (email===adminsEmail){
                        $.ajax({
                            url: 'http://localhost:8080/api/v1/admin/login',
                            method: 'POST',
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify({"email": email, "password": password}),
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
                    }
                })
                .catch(error => {
                    console.error('Error hashing password:', error);
                });

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
     $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: email},

        success: function (response) {
            console.log(response.data);
            trainersEmail=response.data.email;
            hashPassword(password)
                .then(hashedPassword => {
                    console.log('Hashed Password:', hashedPassword);
                    let newPassword = hashedPassword;
                    console.log("new Password: " + newPassword);

                    // Perform login for trainer
                     if(email===trainersEmail){
                        console.log("hello")
                        $.ajax({
                            url: 'http://localhost:8080/api/v1/trainer/login',
                            method: 'POST',
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify({"email": email, "password": newPassword}),
                            success: function (response) {
                                console.log(response);
                                alert("Login Successful!");
                                localStorage.setItem("trainer-email", email);
                                window.location.href = '../trainer/index.html';
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                alert("Login Failed! Please check your credentials. Also, there might be an issue with the server.");
                                console.error(jqXHR.responseText);
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Error hashing password:', error);
                });

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
    console.log(trainersEmail);

});