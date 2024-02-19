$('#nameLbl').text(localStorage.getItem('adminEmail'));

$(window).on('load', function () {
    // Your JavaScript code goes here
    getAllTrainers();
});

$("#searchTrainers").keyup(function () {
    $('#tblTrainer').empty();
    let text = $('#searchTrainers').val();
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/searchTrainerByName',
        method: 'GET',
        dataType: 'json',
        data: {partialName: text},   // Convert data to JSON string
        success: function (response) {
            if ($("#searchTrainers").val() === "") {
                $('.npResImg').addClass("d-none");
                $('#trainerTable').css("display", "inline-table");
                getAllTrainers();

            } else {
                $.each(response.data, function (index, trainer) {

                    let row = `<tr><td>${trainer.tid}</td><td>${trainer.name}</td><td>${trainer.email}</td><td>${trainer.category}</td><td style="display: none">${trainer.password}</td></tr>`;
                    $('#tblTrainer').append(row);
                });
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.data == null) {
                $('#trainerTable').css("display", "none");
                $('.npResImg').removeClass("d-none");
            }
        }
    });
});
//delete trainer
$('#deleteTrainer').click(function () {

    let id = $('#trainer_id').val();
    var result = window.confirm("Do you want to proceed?");
    if (result) {
        // Make the AJAX request
        $.ajax({
            url: 'http://localhost:8080/api/v1/trainer/delete/' + id,
            method: 'DELETE',
            contentType: 'application/json',  // Set content type to JSON
            success: function (response) {
                alert("Trainer Delete successful!");
                getAllTrainers();
                $('#trainerModal').modal('hide');

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Trainer Delete failed! Please check your input and try again.");

                console.error(jqXHR.responseText);  // Log the response text for debugging
            }
        });
    } else {
        alert("Trainer Details Is Safe !!")
    }
});

let newPassword;

async function hashPassword(password) {
    const base64Encoded = btoa(password);
    console.log(base64Encoded);

    return base64Encoded;
}

//update trainer
$('#updateTrainer').click(function () {

    let id = $('#trainer_id').val();
    let name = $('#trainer_name').val();
    let email = $('#trainer_email').val();
    let password = $('#trainer_password').val();
    let category = $('#trainer_category').val();
    //let age = $('#age').val();

    hashPassword($('#trainer_password').val())
        .then(hashedPassword => {
            console.log('Hashed Password:', hashedPassword);
            newPassword = hashedPassword;
            if (isValidName(name) && isValidEmail(email) && isValidPassword(password)) {
                $.ajax({
                    url: 'http://localhost:8080/api/v1/trainer/update',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',  // Set content type to JSON
                    data: JSON.stringify({
                        "name": name,
                        "tid": id,
                        "email": email,
                        "password": newPassword,
                        "category": category,
                        //"age":age
                    }),  // Convert data to JSON string
                    success: function (response) {
                        console.log(response);
                        alert("Trainer update successful!");
                        getAllTrainers();
                        $('#trainerModal').modal('hide');


                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Trainer update failed! Please check your input and try again.");

                        console.error(jqXHR.responseText);  // Log the response text for debugging
                    }
                });
            }

        })
        .catch(error => {
            console.error('Error hashing password:', error);
        });
    if (!name || !email || !category || !password) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!isValidName(name)) {
        $('#nameErrorLabel').text("Please enter a name with 2 to 50 characters and only use letters");

    } else {
        $('#nameErrorLabel').text(""); // Clear the error label
    }

    if (!isValidEmail(email)) {
        $('#emailErrorLabel').text("Please enter a valid email address.");

    } else {
        $('#emailErrorLabel').text(""); // Clear the error label
    }

    if (!isValidPassword(password)) {
        $('#pwdErrorLabel').text("Please enter a password with 6 to 20 characters.");

    } else {
        $('#pwdErrorLabel').text(""); // Clear the error label
    }

    // Make the AJAX request

});


//save trainer
$('#saveTrainer').click(function () {

    let id = $('#trainer_id').val();
    let name = $('#trainer_name').val();
    let email = $('#trainer_email').val();
    let password = $('#trainer_password').val();
    let category = $('#trainer_category').val();
    //let age = $('#age').val();

    hashPassword($('#trainer_password').val())
        .then(hashedPassword => {
            console.log('Hashed Password:', hashedPassword);
            newPassword = hashedPassword;
            if (isValidName(name) && isValidEmail(email) && isValidPassword(password)) {
                // Make the AJAX request
                $.ajax({
                    url: 'http://localhost:8080/api/v1/trainer/registration',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',  // Set content type to JSON
                    data: JSON.stringify({
                        "name": name,
                        "id": id,
                        "email": email,
                        "password": newPassword,
                        "category": category,
                        //"age":age
                    }),  // Convert data to JSON string
                    success: function (response) {
                        alert("Trainer registration successful!");
                        getAllTrainers();
                        $('#trainerModal').modal('hide');

                        console.log(response);


                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Trainer registration failed! Please check your input and try again.");

                        console.error(jqXHR.responseText);  // Log the response text for debugging
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error hashing password:', error);
        });

    if (!name || !email || !category || !password) {
        alert("Please fill in all required fields.");
        return;
    }
    if (!isValidName(name)) {
        $('#nameErrorLabel').text("Please enter a name with 2 to 50 characters and only use letters");

    } else {
        $('#nameErrorLabel').text(""); // Clear the error label
    }
    if (!isValidEmail(email)) {
        $('#emailErrorLabel').text("Please enter a valid email address.");

    } else {
        $('#emailErrorLabel').text(""); // Clear the error label
    }

    if (!isValidPassword(password)) {
        $('#pwdErrorLabel').text("Please enter a password with 6 to 20 characters.");

    } else {
        $('#pwdErrorLabel').text(""); // Clear the error label
    }


});

//get all trainers
function getAllTrainers() {
    $('#tblTrainer').empty();

// trainerGet All
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getAllTrainers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            console.log(response.data);
            console.log(response.data.email);


            let trainerList = response.data;
            if (trainerList.length === 0) {
                alert("No Trainers found.");
                return;
            }
            $.each(response.data, function (index, trainer) {

                let row = `<tr><td>${trainer.tid}</td><td>${trainer.name}</td><td>${trainer.email}</td><td>${trainer.category}</td><td style="display: none">${trainer.password}</td></tr>`;
                //let row = `<tr><td>${trainer.tid}</td><td>${trainer.name}</td><td>${trainer.email}</td><td>${trainer.category}</td><td>${trainer.age}</td><td style="display: none">${trainer.password}</td></tr>`;
                $('#tblTrainer').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve trainers. Please try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}


//table click event
$('#tblTrainer').on('click', 'tr', function () {


    // Access the data in the clicked row
    let trainerId = $(this).find('td:first').text();
    let trainerName = $(this).find('td:nth-child(2)').text();// Assuming the first cell contains the trainer ID
    let trainerEmail = $(this).find('td:nth-child(3)').text(); // Assuming the second cell contains the trainer email
    let trainerCategory = $(this).find('td:nth-child(4)').text();
    let trainerEnPassword = $(this).find('td:nth-child(5)').text();
    let trainerPassword = atob(trainerEnPassword);
    console.log(trainerPassword);
    // Perform actions with the retrieved data
    $('#trainerModal').modal('show');
    $('#saveTrainer').css("display", 'none');
    $('#updateTrainer').css("display", 'block');
    $('#deleteTrainer').css("display", 'block');
    $('#trainer_id').val(trainerId);
    $('#trainer_name').val(trainerName);
    $('#trainer_email').val(trainerEmail);
    $('#trainer_category').val(trainerCategory);
    $('#trainer_password').val(trainerPassword);

});
$('#closeBtn').click(function () {
    $('#updateTrainer').css("display", 'none');
    $('#deleteTrainer').css("display", 'none');
    $('#emailErrorLabel').text("");
    $('#pwdErrorLabel').text("");
});
$('#addTrainerBtn').click(function () {
    $('#updateTrainer').css("display", 'none');
    $('#deleteTrainer').css("display", 'none');
    $('#saveTrainer').css("display", 'block');
    $('#trainer_id').val("");
    $('#trainer_name').val("");
    $('#trainer_email').val("");
    $('#trainer_category').val("");
    $('#trainer_password').val("");
    $('#emailErrorLabel').text("");
    $('#pwdErrorLabel').text("");

});

