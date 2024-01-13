getAllTrainers();



//delete trainer
$('#deleteTrainer').click(function () {

    let id = $('#trainer_id').val();
    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/delete/'+ id,
        method: 'DELETE',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            console.log(response);
            $('#trainerModal').modal('hide');
            getAllTrainers();
            },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});



//update trainer
$('#updateTrainer').click(function () {

    let id = $('#trainer_id').val();
    let email = $('#trainer_email').val();
    let password = $('#trainer_password').val();
    let category = $('#trainer_category').val();

    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"tid": id, "email": email, "password": password, "category": category}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $('#trainerModal').modal('hide');
            getAllTrainers();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});


//save trainer
$('#saveTrainer').click(function () {

    let id = $('#trainer_id').val();
    let email = $('#trainer_email').val();
    let password = $('#trainer_password').val();
    let category = $('#trainer_category').val();

    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/registration',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"id": id, "email": email, "password": password, "category": category}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
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

            $.each(response.data, function (index, trainer) {
                let row = `<tr><td>${trainer.tid}</td><td>${trainer.email}</td><td>${trainer.category}</td></tr>`;
                $('#tblTrainer').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}


//table click event
$('#tblTrainer').on('click', 'tr', function () {


    // Access the data in the clicked row
    let trainerId = $(this).find('td:first').text(); // Assuming the first cell contains the trainer ID
    let trainerEmail = $(this).find('td:nth-child(2)').text(); // Assuming the second cell contains the trainer email
    let trainerCategory = $(this).find('td:nth-child(3)').text();
    // Perform actions with the retrieved data
    $('#trainerModal').modal('show');
    $('#saveTrainer').css("display", 'none');
    $('#trainer_id').val(trainerId);
    $('#trainer_email').val(trainerEmail);
    $('#trainer_category').val(trainerCategory);

});

